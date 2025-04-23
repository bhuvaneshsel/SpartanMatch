import psycopg2
from dotenv import load_dotenv, dotenv_values
import os


load_dotenv()
psql_password = os.getenv("PSQL_PASSWORD") #Update your .env file with PSQL_PASSWORD=insert_password_here

connection = psycopg2.connect(host="localhost", dbname="postgres", user="postgres", password=psql_password, port=5432)

cursor = connection.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS resumes (
    session_id INT PRIMARY KEY,
    resume_name VARCHAR(255),
    resume_data BYTEA,
    resume_text TEXT
);
""")

cursor.execute("""CREATE TABLE IF NOT EXISTS job_description (
    session_id INT PRIMARY KEY,
    job_description TEXT
);
""")

# should we split the three scores into different tables?
cursor.execute("""CREATE TABLE IF NOT EXISTS scores (
    session_id INT PRIMARY KEY,
    experience_score INT,
    experience_positives TEXT[],
    experience_negatives TEXT[],
    skills_score INT,
    skills_positives TEXT[],
    skills_negatives TEXT[],
    structure_score INT,
    structure_positives TEXT[],
    structure_negatives TEXT[]
);
""")

cursor.execute("""CREATE TABLE IF NOT EXISTS resume_improvements (
    session_id INT PRIMARY KEY,
    improvements JSON
);
""")

connection.commit()

cursor.close()
connection.close()