# Set Up Guide

1. **[Install PostgreSQL](https://www.postgresql.org/download/)**

2. **[Install Tesseract](https://github.com/UB-Mannheim/tesseract/wiki)**

3. **[Install Poppler](https://github.com/oschwartz10612/poppler-windows/releases)**

4. **Set Up Frontend**
```bash
cd client 
npm install 
npm run dev 
```
5. **Set up Backend**

```bash
cd server 
```

```bash
Windows:
python3 -m venv .venv 
source .venv/bin/activate
Mac:
python3 -m venv .venv  
source .venv/bin/activate 
```

```bash
pip install -r requirements.txt 
```

6. **Create .env file in server folder**
   
```env
OPENAI_API_KEY=your-api-key <br/>
PSQL_PASSWORD=your-psql-password <br/>
```

7. **Create the database and run the Backend**

```bash
python3 create_database.py 
python3 main.py 
```



