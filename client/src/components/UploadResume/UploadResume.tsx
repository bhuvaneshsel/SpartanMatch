import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "./UploadResume.css";
import logo from "../../../public/logo.png"
import uploadImage from "../../../public/upload.png"
import axios from "axios"


function UploadResume() {

    const [resumeFile, setResumeFile] = useState(null)
    const fileInputRef = useRef(null);
    const navigate = useNavigate();


    const onFileChange = (event) => {
        setResumeFile(event.target.files[0])
        
        /*const rresumeFile = event.target.files[0]


        if (rresumeFile) {
          if (rresumeFile.type === 'application/pdf') {
            let path = "/upload-job-description"
            navigate(path)
          }
        }*/
    }

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append("Resume", resumeFile, resumeFile.name)
        const response = await axios.post("http://localhost:8080/api/upload-resume", formData)
        console.log(response)
    }

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };



  return (
    <>
      { <div className="upload-resume-container">
          <header className='upload-resume-header-container'>
            <img className="home-page-logo" src={logo} alt="Logo"/>
            <div className="upload-resume-header">
              <h1>SpartanMatch</h1>
              <h2>Advanced ATS Resume Checker</h2>
            </div>
          </header>

          <div className="background-rectangle">
            <div className='upload-resume-content-container'>
              <h2 className='upload-resume-description'>Get started by uploading your resume</h2>
              <img className="upload-image" src={uploadImage} alt="UploadImage"/>

              <button onClick={handleButtonClick} className='upload-resume-button'>Upload
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{display: 'none'}}
                onChange={onFileChange}
              />

              <h3 className='upload-resume-file-type-description'>File Type: PDF Only</h3>
              </div>
            </div>
        </div> }
    </>
  )
}

export default UploadResume
