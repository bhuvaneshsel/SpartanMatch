from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv, dotenv_values
from openai import OpenAI
import os

app = Flask(__name__)
cors = CORS(app, origin='*')

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

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
    return "Resume recieved"


@app.route("/api/upload-job-description", methods = ['POST'])
def upload_job_description():
    data = request.get_json()
    job_description = data.get("job_description")

    return job_description



if __name__ == "__main__":
    app.run(debug=True, port=8080)