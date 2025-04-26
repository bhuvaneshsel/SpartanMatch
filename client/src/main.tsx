import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import UploadResume from './UploadResume.tsx'
import UploadJobDescription from './UploadJobDescription.tsx'
import ResumeScore from './ResumeScore.tsx'
import ResumeImprovements from './components/ResumeImprovements/ResumeImprovements.tsx'


const router = createBrowserRouter([
  { path: "/", element: <UploadResume />},
  { path: "/upload-job-description", element: <UploadJobDescription/> },
  { path: "/resume-score", element: <ResumeScore/> },
  { path: "/resume-improvements", element: <ResumeImprovements/>},
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
)
