import { useState, useEffect } from 'react';
import "./UploadJobDescription.css";
import logo from "../../../public/logo.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function UploadJobDescription() {

    const [jobDescription, setJobDescription] = useState("")
    const [text, setText] = useState('');  
    const [wordCount, setWordCount] = useState(0);  
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const {erroeMessage, setErrorMessage} = useState("");
    const navigate = useNavigate();

    const input = document.querySelector(".upload-job-description-textbox");

    const routeChange = () =>{
        let path = "/resume-score"
        navigate(path)
    }

    const handleTextChange = (event) => {
        const newText = event.target.value;
        setText(newText);
    
        const words = newText.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
      };
      const buttonDisabled = wordCount < 100;

    






   
    
    const uploadJobDesc = async () => {
      try {
        setIsLoading(true)
        console.log(input.value)
        const response = await axios.post('http://localhost:8080/api/upload-job-description', {
          job_description: input.value,
        }, {
          withCredentials: true  // This is important to send cookies with the request
        });
        
        // Handle the response from the backend
        if (response.status === 200) {
            setJobDescription(''); // Clear the input after successful save
            routeChange();
        } else {
            setIsError(true);
            setErrorMessage('Failed to save job description.');
        }
      }
      catch (error) {
        console.error('Error saving job description:', error);
        setIsError(true);
        setErrorMessage('Error saving job description. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

 
  return (
    <>
        { <div className="upload-job-description-container">
            <div className='upload-job-description-header-container'>
                <img className="logo" src={logo} alt="Logo"/>

                <header className="upload-job-description-header">
                    <h1>Upload Job Description</h1>
                </header>
            </div>

            <div className='upload-job-description-content-container'>
                <textarea className = "upload-job-description-textbox" placeholder='Copy and paste the job description here (100 words minimum)...'
                    value={text}
                    onChange={handleTextChange}
                />
                <div className="word-count">Word count: {wordCount}</div>
                <button className={`upload-job-description-button ${buttonDisabled ? 'disabled' : ''}`} disabled={buttonDisabled}
                    onClick={uploadJobDesc}
                    >View Analysis
                </button>
            </div>
        </div> }
    </>
  )
}

export default UploadJobDescription