import React from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react';
import {useAuthStore} from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData,setFormData]=useState({
    fullname:"",
    email:"",
    password:"",
  })
  const {signup}=useAuthStore();
  const validateForm=()=>{
    if(!formData.fullname.trim()) return toast.error("Username is Required");
    if(!formData.email.trim()) return toast.error("Email is Required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  } 
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const success=validateForm();
    if(success===true){
      await signup(formData)
    };
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-slate-100 overflow-hidden">
      <div className="absolute -top-25 left-25 w-75 h-75 bg-indigo-400 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-25 -right-25 w-75 h-75 bg-purple-400 opacity-30 blur-[120px] rounded-full"></div>

      <form onSubmit={handleSubmit} className="relative z-10 bg-white/80 backdrop-blur-lg border border-white/30 
      max-w-md w-full p-8 rounded-2xl shadow-xl text-gray-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account 
        </h2>

        {/* Username */}
        <div className="my-3 border border-gray-200 rounded-lg px-3 bg-white/60 focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            id="username"
            className="w-full outline-none bg-transparent py-3"
            type="text"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={(e)=>setFormData({...formData,fullname:e.target.value})}
            required
          />
        </div>

        {/* Email */}
        <div className="my-3 border border-gray-200 rounded-lg px-3 bg-white/60 focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            id="email"
            className="w-full outline-none bg-transparent py-3"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e)=>setFormData({...formData,email:e.target.value})}
            required
          />
        </div>

        {/* Password */}
        <div className="my-3 border border-gray-200 rounded-lg px-3 bg-white/60 focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            id="password"
            className="w-full outline-none bg-transparent py-3"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e)=>setFormData({...formData,password:e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mb-3 bg-linear-to-r from-indigo-500 to-purple-500 
          hover:opacity-90 transition py-3 rounded-lg text-white font-semibold shadow-md"
        >
          Create Account
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignupPage