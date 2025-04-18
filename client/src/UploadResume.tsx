import { useState, useEffect } from 'react'
import axios from "axios"


function UploadResume() {

    const [resumeFile, setResumeFile] = useState(null)


    const onFileChange = (event) => {
        setResumeFile(event.target.files[0])
    }

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append("Resume", resumeFile, resumeFile.name)
        const response = await axios.post("http://localhost:8080/api/upload-resume", formData)
        console.log(response)
    }




  return (
    <>
      <input type="file" accept="application/pdf" onChange={onFileChange}/>
      <button onClick={onFileUpload}>Upload Resume</button>
    </>
  )
}

export default UploadResume
