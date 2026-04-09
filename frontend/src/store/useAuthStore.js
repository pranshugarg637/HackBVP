import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:8000":"/";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isCheckingAuth:true,

    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
        }catch(err){
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        }catch(err){
            console.log(err);
            toast.error(err.response.data.message);
        }finally{
            console.log("Signup Function");
        }
    },

    login:async(data)=>{
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Welcome Back");
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Login failed");
        }finally{
            console.log("Login function");
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out succesfully");
        }catch(err){
            console.log(err);
            toast.error(err.response.data.message);
        }finally{
            console.log("Logout function");
        }
    },

    updateProfile:async(data)=>{
        try{
            const res=axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated succesfully");
        }catch(err){
            console.log(err);
            toast.error(err.response.data.message);
        }finally{
            console.log("Profile updation function");
        }
    }
}))

