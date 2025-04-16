# SpartanMatch
# Set Up Guide
## 0. Prerequisites
<a href="https://www.python.org/downloads/" target="_blank">Python 3.12.x</a><br/>
<a href="https://nodejs.org/en/download/package-manager" target="_blank">Node.js</a>

## 1. Clone the Repository Your System
 1. Open Command Prompt/Powershell on Windows or Terminal on Mac
 2. Change into the directory that you want to put the project in
    e.g:
    > cd Desktop
 3. Clone the repo and go into it
    > git clone https://github.com/bhuvaneshsel/SpartanMatch.git<br/>
    > cd SpartanMatch <br/>
    > code . <br/>
    
    *This should open the project in VSCode
## 3. Set Up Each Folder
 4. Open a new Terminal inside VSCode
    > For Windows: Ctrl + Shift + `
    > 
    > For Mac: Command + Shift + `
 5. Open client folder
    >cd client <br/>
    >npm install<br/>
    >npm run dev<br/>
 6. Open a different terminal to set up server
    >Setting up the virtual server and activating it: <br/>
    >cd server <br/>
    >Windows: py -3 -m venv .venv  <br/>
    >Windows: .venv\Scripts\activate  <br/>
    
    >Mac: python3 -m venv .venv  <br/>
    >Mac: source .venv/bin/activate  <br/>
    
    *Note that for Windows, you might run into an error where you don't have permissions to activate the Virtual Environment. If so, then you will have to open a Command Prompt and activate it there instead of using VSCode terminal.
 8. Install from requirements.txt
    >Make sure your virtual environment is active<br/>
    >pip install -r requirements.txt
 9. Create a file called .env inside of the server folder
     >Inside the file, add the line: OPENAI_API_KEY=your-api-key
     >Replace your-api-key with the actual api key
 9. Run the backend server
    >python main.py <br/>
    OR<br/>
    >python3 main.py<br/>
    
    *Open the server and in the URL add /api/openai to the end of the URL
 10. Go to the frontend server and test the button.

