from flask import Flask, jsonify, request, send_file,  make_response
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import psycopg2
import json
import os
import io
import PyPDF2
import uuid
import traceback



app = Flask(__name__)
cors = CORS(app, origin='*', supports_credentials=True)

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
psql_password = os.getenv("PSQL_PASSWORD")

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        dbname="postgres",
        user="postgres",
        password=psql_password,
        port=5432
    )

def openai(context, prompt):

    client = OpenAI(api_key=api_key)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": context
             },
            {"role": "user", 
             "content": prompt
             },
        ],
    )
    response = completion.choices[0].message.content
    clean_response = response.strip()
    clean_response = response.strip("```json")
    return clean_response

def extract_text_from_pdf(file_stream):
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        print(f"[PDF ERROR] {e}")
    return text

def extract_text(file_stream, filename):
    if filename.lower().endswith('.pdf'):
        return extract_text_from_pdf(file_stream)
    else:
        raise ValueError("Unsupported file format. Use PDF only.")
    
@app.route("/api/upload-resume", methods=["POST"])
def upload_resume():
    if "Resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    resume_file = request.files["Resume"]
    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())

    if resume_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not resume_file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        extracted_text = extract_text(resume_file.stream, resume_file.filename)
        if len(extracted_text.split()) < 100:
            return jsonify({"error": "Resume must be at least 100 words long"}), 400
        
        resume_file.stream.seek(0)
        pdf_content = resume_file.stream.read()
    
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "INSERT INTO resumes (session_id, resume_text, resume_data) VALUES (%s, %s, %s) ON CONFLICT (session_id) DO UPDATE SET resume_text = EXCLUDED.resume_text, resume_data = EXCLUDED.resume_data",
            (session_id, extracted_text, psycopg2.Binary(pdf_content))
        )

        cursor.execute("""
            DELETE FROM scores
            WHERE session_id = %s;
        """, (session_id,))

        cursor.execute("""
            DELETE FROM resume_improvements
            WHERE session_id = %s;
        """, (session_id,))

        connection.commit()
        cursor.close()
        connection.close()

        response = make_response({"message": "Resume uploaded and saved successfully"})
        response.set_cookie("session_id", session_id)
        return response, 200
    
    except ValueError as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {e}"}), 500

@app.route("/api/upload-job-description", methods=['POST'])
def upload_job_description():
    session_id = request.cookies.get("session_id")
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    #Check if resume exists in table, if no resume return error
    cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
    resume_text = cursor.fetchone()
    if not (resume_text):
        return jsonify({"error": f"No resume found. Please upload a resume first"}), 500
    else:
        data = request.get_json()
        job_description = data.get("job_description")

        #Insert job_description into db with session_id. If a row shares this session_id replace its job_description
        cursor.execute("""
            INSERT INTO job_description (session_id, job_description)
            VALUES (%s, %s)
            ON CONFLICT (session_id)
            DO UPDATE SET job_description = EXCLUDED.job_description;
        """, (session_id, job_description))

        #Delete rows from scores and resume_improvements DB that share the session_id
        cursor.execute("""
            DELETE FROM scores
            WHERE session_id = %s;
        """, (session_id,))

        cursor.execute("""
            DELETE FROM resume_improvements
            WHERE session_id = %s;
        """, (session_id,))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Job description successfully saved"}), 200

    
@app.route("/api/get-resume", methods=['GET'])
def get_resume():
    session_id = request.cookies.get("session_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT resume_data FROM resumes WHERE session_id = %s", (session_id,))
    resume = cursor.fetchone()
    return send_file(
        io.BytesIO(resume[0]),
        mimetype="application/pdf",
        as_attachment=False,
        download_name="resume.pdf"
    )

@app.route("/api/resume-score", methods=['GET'])
def calculate_score():
    data = request.get_json()
    session_id = request.cookies.get("session_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT resume_scores FROM scores WHERE session_id = %s", (session_id,))
    scores = cursor.fetchone()
    
    if scores:
        cursor.close()
        connection.close()
        return jsonify(json.loads(scores[0]))
    else:
        context = """
        You are an AI expert resume analyzer that always responds in clean nested JSON format. The user will input a resume, in text form, 
        and a job description, in text form. You must analyze the resume based on the job descriptions.
        Your analyses will return the following.
        experience_score (0-100): Based on work experience and education keywords
        skills_score (0-100): Based on soft skills and technical skills keywords
        structure_score (0-100): Based on spelling & grammar, repetition, format, readability and keyword usage
        For each score also include a list of positives and negatives.

        Example Output:
        {
            "experience_score": 85,
            "experience_positives": ["work experience"],
            "experience_negatives": ["education"],

            "skills_score": 100,
            "skills_positives": ["soft skills", "technical skills"],
            "skills_negatives": [],

            "structure_score": 75,
            "structure_positives": ["spelling & grammar", "repetition", "format"],
            "structure_negatives": ["readability", "keyword usage"]
        }

        General Guidelines:
        1. Use ONLY the following exact labels for positives/negatives:
            - Experience: "work experience", "education"
            - Skills: "soft skills", "technical skills"
            - Structure: "spelling & grammar", "repetition", "format", "readability", "keyword usage"
        2. Do not paraphrase or summarize - only use the exact category labels
        3. Only respond with the single JSON object, no additional comments, etc.
        """

        cursor.execute("SELECT job_description FROM job_description WHERE session_id = %s", (session_id,))
        job_desc_result = cursor.fetchone()
        if not job_desc_result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Job description not found"}), 404
        job_description = job_desc_result[0]

        cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
        resume_result = cursor.fetchone()
        if not resume_result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Resume not found"}), 404
        resume = resume_result[0]

        prompt = f"""
        -RESUME-
        {resume}

        -JOB DESCRIPTION-
        {job_description}
        """

        response = openai(context, prompt)
        json_response = json.loads(response)

        cursor.execute(
            "INSERT INTO scores (session_id, resume_scores) VALUES (%s, %s)",
            (session_id, json.dumps(json_response))
        )
     
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify(json_response), 200

@app.route("/api/resume-improvements", methods=['GET'])
def resume_improvements():
    session_id = request.cookies.get("session_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT improvements FROM resume_improvements WHERE session_id = %s", (session_id,))
    improvements = cursor.fetchone()
    
    if improvements:
        cursor.close()
        connection.close()
        return jsonify(json.loads(improvements[0]))
    else:
        context = """
        You are an AI expert resume analyzer that always responds in clean nested JSON format. The user will input a resume, in text form, 
        and also a job description, in text form. You must analyze the resume based on the job descriptions and suggest improvements
        based on the job description, but also general resume improvements.

        Respond in the following format:
        [
            {
                "category": "What type of suggestion it is. Consider the categories like Experience, Skills, Structure",
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            },
            {
                "category": "What type of suggestion it is. Consider the categories like Experience, Skills, Structure",
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            }
        ]
        
        General Guidelines:
        1. The referenceText must be the EXACT TEXT from the resume. If there is '/n' do not include it when giving the reference text. DO not paraphrase or summarize. Do not jump between sections in the resume. 
        2. After including suggestions that refer to the job description, also include general resume improvement suggestions. For these, leave referenceText blank.
        3. Only respond with the JSON array and no additional comments, etc.
        """

        cursor.execute("SELECT job_description FROM job_description WHERE session_id = %s", (session_id,))
        job_desc_result = cursor.fetchone()
        if not job_desc_result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Job description not found"}), 404
        job_description = job_desc_result[0]

        cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
        resume_result = cursor.fetchone()
        if not resume_result:
            cursor.close()
            connection.close()
            return jsonify({"error": "Resume not found"}), 404
        resume = resume_result[0]

        prompt = f"""
        -RESUME-
        {resume}

        -JOB DESCRIPTION-
        {job_description}
        """

        response = openai(context, prompt)
        json_response = json.loads(response)

        cursor.execute(
            "INSERT INTO resume_improvements (session_id, improvements) VALUES (%s, %s)",
            (session_id, json.dumps(json_response))
        )
     
        connection.commit()
        cursor.close()
        connection.close()
    
        return jsonify(json_response), 200

@app.route("/api/extract-text", methods=["POST"])
def extract_text_endpoint():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        extracted_text = extract_text(file.stream, file.filename)
        return jsonify({"extracted_text": extracted_text}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)