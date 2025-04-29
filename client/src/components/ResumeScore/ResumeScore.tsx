import { useState, useEffect } from 'react'
import "./ResumeScore.css";
import "./ScoresProgressCircle.css"
import logo from "../../../public/logo.png"
import ScoresProgressCircle from './ScoresProgressCircle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function ResumeScore() {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

    const routeChange = () =>{
        let path = "/resume-improvements"
        navigate(path)
    }

    const fetchScores = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:8080/api/resume-score", 
          { withCredentials: true }
        );
        console.log(response.data)
        console.log(response.data.experience_score)
        setScores(response.data);
        setIsError(false)
        setIsLoading(false)
      }
      catch (error) {
        setIsError(true)
        setErrorMessage(error?.response?.data?.error)
        setIsLoading(false)
      }
    }

    useEffect(() => {
      setIsLoading(true)
      fetchScores()
    }, []);
 
  return (
    <>
       <div className="resume-score-container">
            <div className='resume-score-container'>
                <img className="logo" src={logo} alt="Logo" onClick={() => navigate("/")}/>
                <header className="resume-score-header">
                    <h1>Resume Analysis Results</h1>
                </header>
            </div>

           {!isLoading && !isError && (<div className='resume-score-display-container'>
              <div className="scores-background-rectangle">
                <div className='resume-score-category-container'>
                  <h2 className='category-label'>Experience</h2>
                    <div className='score-circle-alignment'>
                      <ScoresProgressCircle
                      r="60"
                      cx="80"
                      cy="80"
                      strokeWidth="7"
                      progress={scores.experience_score}
                      />
                    </div>

                    {scores.experience_positives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ✅{category}
                      </h2>
                    ))}
                    {scores.experience_negatives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ❌{category}
                      </h2>
                    ))}
                </div>
              </div>

                <div className='resume-score-category-container'>
                  < div className="scores-background-rectangle">
                    <h2 className='category-label'>Skills</h2>
                    <div className='score-circle-alignment'>
                      <ScoresProgressCircle
                      r="60"
                      cx="80"
                      cy="80"
                      strokeWidth="7"
                      progress={scores.skills_score}
                      />
                    </div>
                    {scores.skills_positives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ✅{category}
                      </h2>
                    ))}
                    {scores.skills_negatives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ❌{category}
                      </h2>
                    ))}
                  </div>
                </div>

                <div className='resume-score-category-container'>
                  <div className="scores-background-rectangle">
                    <h2 className='category-label'>Structure</h2>
                    <div className='score-circle-alignment'>
                      <ScoresProgressCircle
                      r="60"
                      cx="80"
                      cy="80"
                      strokeWidth="7"
                      progress={scores.structure_score}
                      />
                    </div>
                    {scores.structure_positives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ✅{category}
                      </h2>
                    ))}
                    {scores.structure_negatives?.map((category, index) => (
                      <h2 key = {index} className="subcategory-label">
                        ❌{category}
                      </h2>
                    ))}
                  </div>
                </div>
            </div> )}
         {!isLoading && !isError && (
          <button className={`improve-resume-button`}
            onClick={routeChange}
            >Improve Resume
          </button>
         )} 
          {isLoading && !isError && (
            <div className="loading-container">
              <img src="../../../public/Loading.gif"></img>
              <p>Loading Resume Scores...</p>
            </div>
          )}
          {isError && (
          <div className="error-container">
            <h1>Error</h1>
            <p>{errorMessage}</p>
          </div>
          )}
        </div> 
        
    </>
  )
}

export default ResumeScore
