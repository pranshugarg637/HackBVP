import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { login } = useAuthStore();
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  })
  const validateForm=()=>{
    if(!formData.email.trim()) return toast.error("Email is Required");
    if (!formData.password) return toast.error("Password is required");
    if(formData.password.length<6) return toast.error("Password must be greater than 6 Digits");
    return true;
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const success=validateForm();
    if(success===true) await login(formData);
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-slate-100 overflow-hidden">

      {}
      <div className="absolute top-25 left-25 w-75 h-75 bg-indigo-400 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-25 -right-25 w-75 h-75 bg-purple-400 opacity-30 blur-[120px] rounded-full"></div>

      {}
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/80 backdrop-blur-lg border border-white/30 
      max-w-md w-full p-8 rounded-2xl shadow-xl text-gray-600">

        <h2 className="text-xl font-semibold mb-6 text-center">
        Welcome Back 
        </h2>

        {/* Email */}
        <div className="flex items-center my-3 border border-gray-200 rounded-lg px-3 bg-white/60 focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            className="w-full outline-none bg-transparent py-3"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e)=>setFormData({...formData,email:e.target.value})}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center my-3 border border-gray-200 rounded-lg px-3 bg-white/60 focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            className="w-full outline-none bg-transparent py-3"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e)=>setFormData({...formData,password:e.target.value})}
            required
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>
          <a className="text-indigo-600 hover:underline" href="#">
            Forgot?
          </a>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full mb-3 bg-linear-to-r from-indigo-500 to-purple-500 
          hover:opacity-90 transition py-3 rounded-lg text-white font-semibold shadow-md"
        >
          Log In
        </button>

        {/* Footer */}
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
