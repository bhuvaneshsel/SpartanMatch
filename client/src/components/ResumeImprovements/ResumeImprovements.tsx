import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ResumeImprovements.css";
import logo from "../../../public/logo.png"
import axios from 'axios';
import {pdfjs } from "react-pdf";
import { Document, Page } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import { Sidebar } from "./Sidebar";



export default function ResumeImprovements() {

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [improvements, setImprovements] = useState([])


  const fetchImprovements = async () => {
    setIsLoading(true)
    const fullText = getResumeText();
    const response = await axios.post("http://localhost:8080/api/resume-improvements", 
      { fullText: fullText },
      { withCredentials: true }
    )
    console.log(response.data)
    setImprovements(response.data);
    setIsLoading(false)
  }

  const fetchResume = async() => {
    setIsLoading(true)
    const response = await axios.get("http://localhost:8080/api/get-resume", {
      responseType: "blob",
      withCredentials: true,
    });

    const blob = response.data;
    const url = URL.createObjectURL(blob);
    setUrl(url)
  }

  useEffect(() => {

    const loadResume = async () => {
      await fetchResume();
    };
    loadResume();

    const findTextHighlights = () => {
      fetchImprovements();
    }
    const timeout = setTimeout(findTextHighlights, 3000);
    return () => clearTimeout(timeout);
   
  }, []);

  
  const getResumeText = () => {
    const spanElements = Array.from(document.querySelectorAll(".textLayer span[role='presentation']"));

    let fullText = "";
    const spanIndexArray = spanElements.map((span) => {
      const text = span.textContent || "";
      const startIndex = fullText.length;
      fullText += (fullText && text ? " " : "") + text; 
      const endIndex = fullText.length;
      return {span, startIndex, endIndex}
    })
    return fullText;

  }
  return (
    <>
      <header className="resume-improvements-header">
        <img className="logo" src={logo} alt="Logo"/>
        <h1>Resume Improvements</h1>
      </header>
      {!isLoading && (
        <>
          <div className="resume-improvements-container">
            <Sidebar improvements={improvements}/>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess} >
              <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}/>
            </Document>
          </div> 
          <div className="nav-buttons">
            <button>Go Back</button>
            <button>Start New Analysis</button>
          </div>
       
        </>
      )}
      {isLoading && (
        <div className="loading-container">
          <img src="../../../public/Loading.gif"></img>
          <p>Loading Resume Improvements...</p>
        </div>
      )}
    </>
  );
}
