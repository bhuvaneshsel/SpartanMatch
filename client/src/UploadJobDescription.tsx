import { useState, useEffect } from 'react'
import React from 'react';
import axios from 'axios';
import logo from './logo.png';


function UploadJobDescription() {

    const [jobDescription, setJobDescription] = useState("")
    const [backgroundColor] = useState('#E5A823');
    const [text, setText] = useState('');  
    const [wordCount, setWordCount] = useState(0);  


    const headlineStyle = {
      textAlign: 'center',           
      position: 'absolute',          
      top: '40px',                   
      left: '50%',                   
      transform: 'translateX(-50%)', 
      fontSize: '3.5rem',              
      fontWeight: 'bold',            
      fontFamily: 'CoFo Sans',    
      color: '#0055A2',              
      textShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', 
    };

    const descriptionStyle = {
      textAlign: 'center',           
      position: 'absolute',          
      top: '275px',                   
      left: '50%',                   
      transform: 'translateX(-50%)', 
      fontSize: '1.75rem',              
      fontWeight: 'bold',            
      fontFamily: 'CoFo Sans',    
      color: '#000000',              
      textShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', 
    };

    const centeredTextboxStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh', 
      width: '100%',
      boxSizing: 'border-box',
    };
    
    const textboxStyle = {
      width: '1000px', 
      height: '400px', 
      border: '1px solid black',
      padding: '10px',
      fontSize: '1rem',
      resize: 'none', 
      borderRadius: '20px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
    
    const buttonStyles = {
      position: 'absolute',
      bottom: '70px',
      padding: '15px 60px',
      fontSize: '16px',
      backgroundColor: '#0055A2',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      // transition: 'background-color 0.3s ease', // Add a transition effect when hovering
    };
  
    const handleClick = () => {
      alert("Button clicked!");
    };

    const handleTextChange = (event) => {
      const newText = event.target.value;
      setText(newText);
  
      // Calculate word count: split by spaces and filter out empty entries
      const words = newText.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    };

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

    useEffect(() => {
      document.body.style.backgroundColor = backgroundColor;

      return () => {
       document.body.style.backgroundColor = ' ';
      };
    }, [backgroundColor]);
 
  return (
    <>
      <img src={logo} alt="Logo" style={{ width: '250px', height: 'auto' }} />
      <h1 style={headlineStyle}>Upload Job Description</h1>
      <h1 style={descriptionStyle}>Uploading a job description will lead to greater in-depth analysis</h1>
      
      <div style={centeredTextboxStyle}>
      <textarea style={textboxStyle} 
                value={text}
                onChange={handleTextChange}  
                placeholder="Copy and paste the job description here (100 words minimum)..." />

        <button 
        onClick={handleClick} 
        style={buttonStyles} 
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}  // Change color on hover (currently turnedf off)
        onMouseOut={(e) => e.target.style.backgroundColor = '#0055A2'}  // Reset color on hover out
      >
        View Analysis
      </button>


      
      <div
          style={{
            position: 'absolute',
            bottom: '175px', 
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '20px',
            color: '#555',
          }}
        >
          Word Count: {wordCount}
        </div>

      <style>
        {
        
        
        `
          textarea::placeholder {
            font-size: 20px;  /* Change the placeholder font size */
            color: #888;      /* Optional: Change the placeholder color */
            font-family: Arial, sans-serif; /* Optional: Change the placeholder font */
          }
        `}
      </style>
      </div>

    </>
  )
}

export default UploadJobDescription
