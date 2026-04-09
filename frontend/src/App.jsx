import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f8fc,#eef2ff)] text-slate-700">
        <div className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm tracking-[0.2em] uppercase shadow-sm">
          Loading workspace
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <ResumeAnalysisPage />} />
      <Route path="/signup" element={!authUser ? <SignupPage /> : <ResumeAnalysisPage />} />
      <Route path="/resumeAn" element={authUser ? <ResumeAnalysisPage /> : <LoginPage />} />
    </Routes>
  );
}

export default App;
