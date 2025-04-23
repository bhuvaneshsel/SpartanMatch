import psycopg2
from dotenv import load_dotenv, dotenv_values
import os


load_dotenv()
psql_password = os.getenv("PSQL_PASSWORD") #Update your .env file with PSQL_PASSWORD=insert_password_here

connection = psycopg2.connect(host="localhost", dbname="postgres", user="postgres", password=psql_password, port=5432)

cursor = connection.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS resumes (
    session_id INT PRIMARY KEY,
    file_name VARCHAR(255),
    file_data BYTEA
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

#Shouldnt we add an imrpovement keyword to this?
cursor.execute("""CREATE TABLE IF NOT EXISTS improvements (
    session_id INT PRIMARY KEY,
    improvement TEXT,
    reference_text TEXT
);
""")

#FOR TESTING!!!!!
# cursor.execute("""INSERT INTO improvements (session_id, improvement, reference_text) VALUES
# (1, 'misspelled', 'apple'),
# (2, 'repeated word', 'banana');
# """)

with open('pdfs/resume_john.pdf', 'rb') as file1, open('pdfs/resume_alice.docx', 'rb') as file2:
    file1_data = file1.read()
    file2_data = file2.read()

cursor.execute("""INSERT INTO resumes (session_id, file_name, file_data) VALUES
(1, 'resume_bob.pdf', %s),
(2, 'resume_alice.docx', %s);
""", (file1_data, file2_data))

cursor.execute("""INSERT INTO job_description (session_id, job_description) VALUES
(1, 'move boxes'),
(2, 'SWE');
""")



connection.commit()

cursor.close()
connection.close()