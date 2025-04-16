import { useState, useEffect } from 'react'
import axios from "axios"

function App() {
  const [count, setCount] = useState(0)
  const [response, setResponse] = useState();
 

  const fetchAPI = async () => {
    const input = prompt("Enter a prompt");
    console.log(input);
    const response = await axios.post(
      "http://localhost:8080/api/openai",
      { prompt: input }, 
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    setResponse(response.data);
  }

  return (
    <>
      <button onClick={fetchAPI}>Send Prompt</button>
      <div className="card">
        <p>
          ChatGPT says: { response }
        </p>
      </div>
    </>
  )
}

export default App
