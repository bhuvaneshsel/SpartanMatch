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
    const navigate = useNavigate();

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

    






    // Fetching input from the textbox (Placeholder) --> From ChatGPT
    //const [message, setMessage] = useState(''); --> would need this
    
    /*const fetchJobDesc = async () => {
        setIsLoading(true)
        const response = await axios.post('http://localhost:8080/api/upload-job-description', {
            description: jobDescription,
          });
        
        // Handle the response from the backend
        if (response.status === 200) {
            setMessage('Job description successfully saved!');
            setJobDescription(''); // Clear the input after successful save
        } else {
            setMessage('Failed to save job description.');
        }
        } catch (error) {
        console.error('Error saving job description:', error);
        setMessage('Error saving job description. Please try again.');
        } finally {
        setIsLoading(false);
        }
    }*/












    
    const uploadJobDescription = async () => {
        const response = await axios.post(
          "http://localhost:8080/api/upload-job-description",
          { job_description: jobDescription }, 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }       
        )
        console.log(response)
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
                    onClick={routeChange}
                    >View Analysis
                </button>
            </div>
        </div> }
    </>
  )
}

export default UploadJobDescription