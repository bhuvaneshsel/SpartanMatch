from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI
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

@app.route("/api/openai", methods = ['POST'])
def openai():

    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt or not isinstance(prompt, str):
        return "NO PROMPT"

    client = OpenAI(api_key=api_key)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "developer", "content": ""},
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )
    return completion.choices[0].message.content


@app.route("/api/upload-resume", methods = ['POST'])
def upload_resume():
    resume = request.files["Resume"]

    return resume.filename


@app.route("/api/upload-job-description", methods = ['POST'])
def upload_job_description():
    data = request.get_json()
    job_description = data.get("job_description")

    return job_description

@app.route("/api/resume-improvements", methods = ['POST'])
def resume_improvements():
    # -get session id (not sure how we are actually passing the session id...)
    data = request.get_json()
    session_id = data.get("session_id")

	# -fetch resumepdf and job description from database
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT job_description FROM job_description WHERE session_id = %s", (session_id,))
    job_desc = cursor.fetchone()

    cursor.execute("SELECT file_name, file_data FROM resumes WHERE session_id = %s", (session_id,))
    resume = cursor.fetchone()

    # To test if data properly fetched from database
    # return {
    #     "job_description": job_desc[0],
    #      "resume_filename": resume[0],
    # }

    return "improvements"



if __name__ == "__main__":
    app.run(debug=True, port=8080)