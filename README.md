# Set Up Guide
1. Install PostgreSQL <br/>
<br/>
2. Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki <br/>
<br/>
3. Install Poppler: https://github.com/oschwartz10612/poppler-windows/releases <br/>
<br/>   
4. Set Up Frontend <br/>
>cd client <br/>
>npm install <br/>
>npm run dev <br/>
<br/>
5. Set up Backend <br/>
>cd server <br/>
Windows: <br/>
>py -3 -m venv .venv  <br/>
>.venv\Scripts\activate  <br/>
Mac: <br/>
>python3 -m venv .venv  <br/>
>source .venv/bin/activate  <br/>
<br/>
>pip install -r requirements.txt <br/>
Then, create a file called .env inside of the server folder <br/>
 -Inside the file, add copy and paste: <br/>
OPENAI_API_KEY=your-api-key <br/>
PSQL_PASSWORD=your-psql-password <br/>
 -Replace your-psql-password with the postgres password you set up <br/>
<br/>
6. Create the database and run the Backend <br/>
>python3 create_database.py <br/>
>python3 main.py <br/>

