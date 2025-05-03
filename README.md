Set Up Guide

0. Prerequisites
Python 3.12.x: https://www.python.org/downloads/*
Node.js: https://nodejs.org/en/download/package-manager
HomeBrew (for Mac/Linux): https://brew.sh/

*Note that it must be python version 3.12, other versions of python won’t work

1. Install PostgreSQL
-Download from https://www.postgresql.org/
-Make sure that pgAdmin 4 is installed alongside postgres
-Remember the password that you set up

2. Install Tesseract 
For Mac:
>brew install tesseract
For Windows:
-Download from: https://github.com/UB-Mannheim/tesseract/wiki
-Add the Tesseract folder to your system PATH
	-Search “View advanced system settings” in Windows search bar
	-Go to Advanced → Environment Variables
	-In System Variables, find Path →Click Edit →Add path to Tesseract installation

3. Install Poppler 
For Mac:
>brew install poppler
For Windows:
Download from https://github.com/oschwartz10612/poppler-windows/releases
-Extract the zip
-Add to system PATH
	-Search “View advanced system settings” in Windows search bar
	-Go to Advanced → Environment Variables
	-In System Variables, find Path →Click Edit →Add path to Poppler installation
	-The path should be something like PATH_TO_POPPLER\Library\bin





4. Clone the SpartanMatch Repository To Your System
-Open Command Prompt/Powershell on Windows or Terminal on Mac
-Change into the directory that you want to put the project in
e.g:
> cd Desktop
 -Clone the repo and go into it
> git clone https://github.com/bhuvaneshsel/SpartanMatch.git
> cd SpartanMatch
> code . 
   	 *This should open the project in VSCode

5. Set Up Each Folder
-Open a new Terminal inside VSCode
> For Windows: Ctrl + Shift + `
> For Mac: Command + Shift + `
-Open client folder
>cd client 
>npm install
-Open a different terminal to set up server
Setting up the virtual server and activating it: 
>cd server 
>Windows: py -3 -m venv .venv  
>Windows: .venv\Scripts\activate  
    
>Mac: python3 -m venv .venv  
>Mac: source .venv/bin/activate  
    
    *Note that for Windows, you might run into an error where you don't have permissions to activate the Virtual Environment. If so, then you will have to open a Command Prompt and activate it there instead of using VSCode terminal.

 6. Install from requirements.txt
-Make sure your virtual environment is active
>pip install -r requirements.txt
 7. Create a file called .env inside of the server folder
 -Inside the file, add copy and paste:
OPENAI_API_KEY=your-api-key
PSQL_PASSWORD=your-psql-password
-Replace your-psql-password with the postgres password you set up
 
8. Create the database
-Open pgAdmin 4 and click on Servers in the Object Explorer
-Enter your password when prompted
-Make sure you are in the server folder and that the virtual environment is active:
>python3 create_database.py
OR
>python create_database.py
9. Run backend
-Make sure you are in the server folder and that the virtual environment is active:
>python3 main.py
	OR
	>python main.py
10. Run frontend
-Navigate to the client folder 
	>npm run dev
Go to the URL that it provides

Libraries/Open Source Packages Used:
Tesseract/Pytesseract
Flask
dotenv
OpenAI
Pdfplumber
pdf2image
Poppler
Axios
React
React-pdf
Pdfjs
React-router-dom

