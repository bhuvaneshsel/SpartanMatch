import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "./UploadResume.css";
import logo from "../../../public/logo.png"
import uploadImage from "../../../public/upload.png"
import axios from "axios"


function UploadResume() {

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")


  const onFileChange = (event) => {
      uploadFile(event.target.files[0])
      event.target.value = null
  }

  const uploadFile = async (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("Resume", file, file.name)

    try {
      const response = await axios.post("http://localhost:8080/api/upload-resume", 
        formData,
        { withCredentials: true } 
      )
      setIsError(false)
      setErrorMessage("")
      navigate("/upload-job-description")
    }
    catch (error) {
      setIsError(true)
      setErrorMessage(error?.response?.data?.error)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };



  return (
    <>
      <div className="upload-resume-container">
        <header className='upload-resume-header-container'>
          <img className="home-page-logo" src={logo} alt="Logo"/>
          <div className="upload-resume-header">
            <h1>SpartanMatch</h1>
            <h2>Advanced ATS Resume Checker</h2>
          </div>
        </header>
        <p className="product-description"><span className="bold-blue">SpartanMatch</span> is a robust resume analyzer that utilizes the <strong>power of AI</strong> to accurately analyze your resume and optimize it for <strong>ATS</strong>. We analyze your resume and <strong>match it with any job description</strong> you want, ensuring that your resume is optimized for that job.</p>
        <div className="background-rectangle">
          <div className='upload-resume-content-container'>
            <h2 className='upload-resume-description'>Get started by uploading your resume</h2>
            <img className="upload-image" src={uploadImage} alt="UploadImage"/>
            <button onClick={handleButtonClick} className='upload-resume-button'>
              Upload
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
        <p className="error-message">{errorMessage}</p>
      </div> 
    </>
  )
}

export default UploadResume
