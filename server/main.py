from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI
import psycopg2
import json
import os

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
    return "Resume recieved"


@app.route("/api/upload-job-description", methods = ['POST'])
def upload_job_description():
    data = request.get_json()
    job_description = data.get("job_description")

    return job_description

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
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            }},
            {{
                "suggestion": "What to improve",
                "referenceText": "Exact copy and pasted text from the resume that the suggestion refers to"
            }},
            ...
        ]
        General Guidelines:
        1. The referenceText must be the EXACT TEXT from the resume, character-for-character. DO not paraphrase or summarize. Do not jump between sections in the resume. 
        2. Only respond with the JSON array and no additional comments, etc.
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