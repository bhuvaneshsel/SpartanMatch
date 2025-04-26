from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI
import psycopg2
import json
import os
import io

app = Flask(__name__)
cors = CORS(app, origin='*')

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
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )
    response = completion.choices[0].message.content
    clean_response = response.strip()
    clean_response = response.strip("```json")
    return clean_response


@app.route("/api/upload-resume", methods = ['POST'])
def upload_resume():
    resume = request.files["Resume"]

    return resume.filename


@app.route("/api/upload-job-description", methods = ['POST'])
def upload_job_description():
    session_id = 1 #hard coded for now should get session ID from cookie

    connection = get_db_connection()
    cursor = connection.cursor()
    
    #Check if resume exists in table, if no resume return error
    cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
    resume_text = cursor.fetchone()
    if not (resume_text):
        return jsonify({"error": f"No resume found for session_id {session_id}."}), 500
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

        return "Success!"

@app.route("/api/resume-score", methods = ['GET'])
def calculate_score():
    data = request.get_json()
    session_id = data.get("session_id")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT session_id, resume_scores FROM scores WHERE session_id = %s", (session_id,))
    scores = cursor.fetchone()
    if (scores):
        return jsonify(scores)
    else:
        context = f"""
        You are an AI expert resume analyzer that always responds in clean nested JSON format. The user will input a resume, in text form, 
        and a job description, in  text form. You must analyze the resume based on the job descriptions.
        Your analyses will return the following.
        experience_score (0-100): Based on work experience and education keywords
        skills_score (0-100): Based on soft skills and technical skills keywords
        structure_score (0-100): Based on spelling & grammer, repetition, format, readability and keyword usage
        For each score alos include a list of positives and negatives.

        Example Output:
        [
            {{
                "experience_score": 85,
                "experience_positives": ["work experience"],
                "experience_negatives": ["education"],

                "skills_score": 100,
                "skills_positives": ["soft skills", "technical skills"],
                "skills_negatives": [],

                "structure_score": 75,
                "structure_positives": ["spelling & grammer", "repetition", "format"],
                "structure_negatives": ["readability", "keyword usage"]
            }},
            ...
        ]

        General Guidelines:
        1. Use ONLY the following exact labels for positives/negatives:
            - Experience: "work experience", "education"
            - Skills: "soft skills", "technical skills"
            - Structure: "spelling & grammar", "repetition", "format", "readability", "keyword usage"
        2. Do not paraphrase or summarize - only use the exact category labels
        3. Only respond with the single JSON object, not an array and no additional comments, etc.
        """

        cursor.execute("SELECT job_description FROM job_description WHERE session_id = %s", (session_id,))
        job_description = cursor.fetchone()[0]

        cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
        resume = cursor.fetchone()[0]

        prompt = f"""
        -RESUME-
        {resume}

        -JOB DESCIPTION-
        {job_description}
        """

        response = openai(context, prompt)
        json_response = json.loads(response)

        cursor.execute(
        "INSERT INTO scores (session_id, resume_scores) VALUES (%s, %s)",
        (session_id, json.dumps(json_response)))
     
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify(json_response)

@app.route("/api/resume-improvements", methods = ['GET'])
def resume_improvements():
    session_id = 1 #hard coded for now

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT improvements FROM resume_improvements WHERE session_id = %s", (session_id,))
    improvements = cursor.fetchone()
    if (improvements):
        return jsonify(improvements[0])
    else:
        context = f"""
        You are an AI expert resume analyzer that always responds in clean nested JSON format. The user will input a resume, in text form, 
        and also a job description, in  text form. You must analyze the resume based on the job descriptions and suggest improvements
        based on the job description, but also general resume improvements.

        Respond in the following format:
        [
            {{
                "category": "What type of suggestion it is. Consider the categories like Experience, Skills, Structure",
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            }},
            {{
                "category": "What type of suggestion it is. Consider the categories like Experience, Skills, Structure",
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            }},
            ...
        ]
        General Guidelines:
        1. The referenceText must be the EXACT TEXT from the resume. If there is '/n' do not include it when giving the reference text. DO not paraphrase or summarize. Do not jump between sections in the resume. 
        2. After including suggestions that refer to the job description, also include general resume improvement suggestions. For these, leave referenceText blank.
        3. Only respond with the JSON array and no additional comments, etc.
        """

        cursor.execute("SELECT job_description FROM job_description WHERE session_id = %s", (session_id,))
        job_description = cursor.fetchone()[0]

        cursor.execute("SELECT resume_text FROM resumes WHERE session_id = %s", (session_id,))
        resume = cursor.fetchone()[0]

        prompt = f"""
        -RESUME-
        {resume}


        -JOB DESCIPTION-
        {job_description}
        """

        response = openai(context, prompt)
        json_response = json.loads(response)

        cursor.execute(
        "INSERT INTO resume_improvements (session_id, improvements) VALUES (%s, %s)",
        (session_id, json.dumps(json_response)))
     
        connection.commit()
        cursor.close()
        connection.close()
    
        return jsonify(json_response)

if __name__ == "__main__":
    app.run(debug=True, port=8080)