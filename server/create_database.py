import psycopg2
from dotenv import load_dotenv, dotenv_values
import os


load_dotenv()
psql_password = os.getenv("PSQL_PASSWORD") #Update your .env file with PSQL_PASSWORD=insert_password_here

connection = psycopg2.connect(host="localhost", dbname="postgres", user="postgres", password=psql_password, port=5432)

cursor = connection.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS resumes (
    session_id TEXT PRIMARY KEY,
    resume_text TEXT,
    resume_data BYTEA
   
);
""")

cursor.execute("""CREATE TABLE IF NOT EXISTS job_description (
    session_id TEXT PRIMARY KEY,
    job_description TEXT
);
""")

cursor.execute("""CREATE TABLE IF NOT EXISTS scores (
    session_id TEXT PRIMARY KEY,
    resume_scores JSON
);
""")

cursor.execute("""CREATE TABLE IF NOT EXISTS resume_improvements (
    session_id TEXT PRIMARY KEY,
    improvements JSON
);
""")

connection.commit()

cursor.close()
connection.close()