import './App.css'
import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ResumeAnalysisPage from './pages/ResumeAnalysisPage'
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react'

function App() {
  const {checkAuth,authUser,isCheckingAuth}=useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  return (
    <>
      <Routes>
        <Route path="/" element={authUser?<LandingPage/>:<LandingPage/>}/>
        <Route path="/login" element={!authUser?<LoginPage/>:<ResumeAnalysisPage/>}/>
        <Route path="/signup" element={!authUser?<SignupPage/>:<ResumeAnalysisPage/>}/>
        <Route path="/resumeAn" element={authUser?<ResumeAnalysisPage/>:<LoginPage/>}/>
      </Routes>
    </>
  )
}

export default App
