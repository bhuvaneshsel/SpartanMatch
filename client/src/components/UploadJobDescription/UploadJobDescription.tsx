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
    const [errorMessage, setErrorMessage] = useState("");
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
        const response = await axios.post('http://localhost:8080/api/upload-job-description', {
          job_description: input.value,
        }, {
          withCredentials: true  
        });
        if (response.status === 200) {
            setJobDescription(''); 
            setIsLoading(false)
            routeChange();
        } else {
            setIsError(true);
            setErrorMessage('Failed to save job description.');
            setIsLoading(false)
        }
      }
      catch (error) {
        console.error('Error saving job description:', error);
        setIsError(true);
        setErrorMessage('Error saving job description. Please try again.');
        setIsLoading(false)
      } finally {
        setIsLoading(false);
      }
    };

    const fetchResume = async() => {
      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:8080/api/get-resume", {
          responseType: "blob",
          withCredentials: true,
        });
        setIsLoading(false)
        setIsError(false)
        return true;
      }
      catch (error) {
        setIsError(true)
        setErrorMessage("Resume not found. Please upload a resume first.")
        setIsLoading(false)
        return false;
      }
    }

    useEffect(() => {
      const checkForResume = async () => {
        const isSuccess = await fetchResume();
      };
      checkForResume();
    }, []);

 
  return (
    <>
         <div className="upload-job-description-container">
            <div className='upload-job-description-header-container'>
                <img className="logo" src={logo} alt="Logo" onClick={() => navigate("/")}/>

                <header className="upload-job-description-header">
                    <h1>Upload Job Description</h1>
                </header>
            </div>

            {!isError && (
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
            )}
            {!isLoading && isError && (
              <div className="error-container">
                <h1>Error</h1>
                <p>{errorMessage}</p>
              </div>
            )}
        </div> 
    </>
  )
}

export default UploadJobDescription