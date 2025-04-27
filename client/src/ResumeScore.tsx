import { useState, useEffect } from 'react'
import "./ResumeScore.css";
import "./ScoresProgressCircle.css"
import logo from "./logo.png"
import ScoresProgressCircle from './ScoresProgressCircle';
import { useNavigate } from 'react-router-dom';


function ResumeScore() {
  const navigate = useNavigate();

    const routeChange = () =>{
        let path = "/resume-improvements"
        navigate(path)
    }

    const subcategories = [
      { name: 'Work Experience', passed: true },
      { name: 'Education', passed: true },
      { name: 'Soft Skills', passed: true },
      { name: 'Technical Skills', passed: false },
      { name: 'Spelling & Grammer', passed: true },
      { name: 'Repetition', passed: true },
      { name: 'Format', passed: false },
      { name: 'Readability', passed: false },
      { name: 'Keyword Usage', passed: false },
    ];
 
  return (
    <>
      { <div className="resume-score-container">
            <div className='resume-score-container'>
                <img className="logo" src={logo} alt="Logo"/>

                <header className="resume-score-header">
                    <h1>Resume Analysis Results</h1>
                </header>
            </div>

            <div className='resume-score-display-container'>
              <div className="scores-background-rectangle">
                <div className='resume-score-category-container'>
                  <h2 className='category-label'>Experience</h2>
                    <div className='score-circle-alignment'>
                      <ScoresProgressCircle
                      r="60"
                      cx="80"
                      cy="80"
                      strokeWidth="7"
                      progress={100}
                      />
                    </div>

                  {subcategories
                    .filter(sub => sub.name === 'Work Experience' || sub.name === 'Education')
                    .map((sub, index) => (
                      <h2 key={index} className='subcategory-label'>
                        {sub.passed ? '✅' : '❌'} {sub.name}
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
                      progress={80}
                      />
                    </div>
                    {subcategories
                    .filter(sub => sub.name === 'Soft Skills' || sub.name === 'Technical Skills')
                    .map((sub, index) => (
                      <h2 key={index} className='subcategory-label'>
                        {sub.passed ? '✅' : '❌'} {sub.name}
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
                      progress={50}
                      />
                    </div>
                    {subcategories
                    .filter(sub => sub.name === 'Spelling & Grammer' || sub.name === 'Repetition' || sub.name === 'Format'
                      || sub.name === 'Readability' || sub.name === 'Keyword Usage')
                    .map((sub, index) => (
                      <h2 key={index} className='subcategory-label'>
                        {sub.passed ? '✅' : '❌'} {sub.name}
                      </h2>
                    ))}
                  </div>
                </div>
            </div>
          <button className={`improve-resume-button`}
            onClick={routeChange}
            >Improve Resume
          </button>
        </div> 
        }
    </>
  )
}

export default ResumeScore
