import { useState, useEffect } from 'react'
import axios from 'axios';


function UploadJobDescription() {

    const [jobDescription, setJobDescription] = useState("")

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
      <textarea onChange={(e) => setJobDescription(e.target.value)}>{jobDescription}</textarea>
      <button onClick={uploadJobDescription}>Upload Job Description</button>
    </>
  )
}

export default UploadJobDescription
