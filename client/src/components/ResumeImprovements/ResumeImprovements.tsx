import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ResumeImprovements.css";
import logo from "../../../public/logo.png"
import axios from 'axios';
import {pdfjs } from "react-pdf";
import { Document, Page } from 'react-pdf';
import { useNavigate } from 'react-router-dom';



pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import { Sidebar } from "./Sidebar";



export default function ResumeImprovements() {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [improvements, setImprovements] = useState([])
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")


  const fetchImprovements = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:8080/api/resume-improvements", 
        { withCredentials: true }
      );
      setImprovements(response.data);
      setIsLoading(false)
    }
    catch (error) {
      setIsError(true)
      setErrorMessage(error?.response?.data?.error)
      setIsLoading(false)
    }
    
  }

  const fetchResume = async() => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:8080/api/get-resume", {
        responseType: "blob",
        withCredentials: true,
      });
  
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setUrl(url)
      return true;
    }
    catch (error) {
      setIsError(true)
      setErrorMessage("Resume not found. Please upload a resume and job description first.")
      setIsLoading(false)
      return false;
    }
  }

  useEffect(() => {
    const loadImprovements = async () => {
      const isSuccess = await fetchResume();
      if (isSuccess) {
        await fetchImprovements()
      }
    };
   loadImprovements()
  }, []);

  return (
    <>
      <header className="resume-improvements-header">
        <img className="logo" src={logo} alt="Logo" onClick={() => navigate("/")}/>
        <h1>Resume Improvements</h1>
      </header>
      {!isLoading && !isError && (
        <>
          <div className="resume-improvements-container">
            <Sidebar improvements={improvements}/>
            <div className="resume-display">
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess} >
                {Array.apply(null, Array(numPages)).map((page, index) => index + 1 ).map((page) => {
                  return (
                    <Page pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} className="pdf-page"/>
                  )
                })}
            </Document>
            </div>
           
          </div> 
          <div className="nav-buttons">
            <button onClick={() => navigate("/resume-score")}>Go Back</button>
            <button onClick={() => navigate("/")}>Start New Analysis</button>
          </div>
        </>
      )}
      {isLoading && !isError && (
        <div className="loading-container">
          <img src="../../../public/Loading.gif"></img>
          <p>Loading Resume Improvements...</p>
        </div>
      )}
      {isError && (
        <div className="error-container">
          <h1>Error</h1>
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
}
