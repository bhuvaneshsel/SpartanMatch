import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ResumeImprovements.css";
import logo from "../../../public/logo.png"
import axios from 'axios';

import {
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
} from "../react-pdf-higlighter";
import type {
  IHighlight,
  NewHighlight,
} from "../react-pdf-higlighter";

import { Sidebar } from "./Sidebar";




const getNextId = () => String(Math.random()).slice(2); //creates new unique ID

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ //if the highlight has a comment ,it displays this
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;



export default function ResumeImprovements() {
  const searchParams = new URLSearchParams(document.location.search);

  const [url, setUrl] = useState("");
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

  const fetchComments = async () => {
    const response = await axios.get("http://localhost:8080/api/resume-improvements")
    for (const i of response.data) {
      addTextHighlight(i.suggestion, i.referenceText)
    }
    console.log(response.data)
  }

  const fetchResume = async() => {
    const response = await axios.get("http://localhost:8080/api/get-resume", {
      responseType: "blob",
    });

    const blob = response.data;
    const url = URL.createObjectURL(blob);
    setUrl(url)
  }


  const scrollViewerTo = useRef((highlight: IHighlight) => {});

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights((prevHighlights) => [
      { ...highlight, id: getNextId() },
      ...prevHighlights,
    ]);
  };

  useEffect(() => {

    const loadResume = async () => {
      await fetchResume();
    };
    loadResume();

    const findTextHighlights = () => {
      fetchComments();
    }
    const timeout = setTimeout(findTextHighlights, 3000);
 
    return () => clearTimeout(timeout);
  }, []);

  
  const addTextHighlight = (comment, referenceText) => {

    if (referenceText === "") {
      console.log("Reference text not found")
      addHighlight({
        content: { text: "No reference text" },
        position: {
          boundingRect: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            width: 0,
            height: 0,
          },
          rects: [],
          pageNumber: 1,
        },
        comment: { text: comment, emoji: "" }
      });
      return;
    }
    const spanElements = Array.from(document.querySelectorAll(".textLayer span[role='presentation']"));

    let fullText = "";
    const spanIndexArray = spanElements.map((span) => {
      const text = span.textContent || "";
      const startIndex = fullText.length;
      fullText += (fullText && text ? " " : "") + text; 
      const endIndex = fullText.length;
      return {span, startIndex, endIndex}
    })



    const referenceTextStart = fullText.toLowerCase().indexOf(referenceText.toLowerCase())
    const referenceTextEnd = referenceTextStart + referenceText.length;

    if (referenceTextStart === -1) {
      console.log("Reference text not found")
      addHighlight({
        content: { text: referenceText },
        position: {
          boundingRect: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            width: 0,
            height: 0,
          },
          rects: [],
          pageNumber: 1,
        },
        comment: { text: comment, emoji: "" }
      });

      return;
    }

    const highlightSpans = spanIndexArray.filter(({startIndex, endIndex}) => {
      return endIndex > referenceTextStart && startIndex < referenceTextEnd;
    })

    const highlightGroups = []

    const allRects = highlightSpans.map(({span}) => {
      const spanElement = span.getBoundingClientRect();
      const resumeElement = span.closest(".page") as HTMLElement;
      const resumeContainer = resumeElement.getBoundingClientRect();

      const x1 = spanElement.left - resumeContainer.left;
      const y1 = spanElement.top - resumeContainer.top;
      const x2 = spanElement.right - resumeContainer.left;
      const y2 = spanElement.bottom - resumeContainer.top;
      const width = resumeElement.offsetWidth;
      const height = resumeElement.offsetHeight;

      const rect = {x1, y1, x2, y2, width, height};

      const highlightGroup = highlightGroups.find(({x1,thatY1,x2,y2,width,height}) => {
        return thatY1 - y1 < 3
      })
      if (highlightGroup) {
        highlightGroup.push(rect)
      }
      else {
        highlightGroups.push([rect])
      }
    })

    if (allRects.length === 0) {
      console.log("No matching spans found.");
      return;
    }

    const rects = highlightGroups.map((group) => {
      const x1 = Math.min(...group.map(r => r.x1));
      const y1 = Math.min(...group.map(r => r.y1));
      const x2 = Math.max(...group.map(r => r.x2));
      const y2 = Math.max(...group.map(r => r.y2));
      return {
        x1,
        y1,
        x2,
        y2,
        width: group[0].width,
        height: group[0].height
      };
    });

    const boundingRect = {
      x1: Math.min(...rects.map(r => r.x1)),
      y1: Math.min(...rects.map(r => r.y1)),
      x2: Math.max(...rects.map(r => r.x2)),
      y2: Math.max(...rects.map(r => r.y2)),
      width: rects[0].width,
      height: rects[0].height,
    };

    addHighlight({
      content: { text: referenceText },
      position: {
        boundingRect,
        rects,
        pageNumber: 1
      },
      comment: { text: comment, emoji: "" }
    });
  }
  

  return (
    <>
      <header className="resume-improvements-header">
        <img className="logo" src={logo} alt="Logo"/>
        <h1>Resume Improvements</h1>
      </header>
      <div className="resume-improvements-container">
        <Sidebar
          highlights={highlights}
          scrollToHighlight={(highlight) => scrollViewerTo.current(highlight)}
        />
        <div
          style={{
            height: "100vh",
            width: "50vw",
            position: "relative",
          }}
        >
          <PdfLoader url={url} beforeLoad="">
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => false}
                onScrollChange={resetHash}
                scrollRef={(scrollTo) => {
                  scrollViewerTo.current = scrollTo;
                  scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => (
                  null
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                
                  const component = (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) 
                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </>
  );
}
