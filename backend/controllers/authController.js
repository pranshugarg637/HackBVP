const User=require("../models/userModel");
const bcrypt = require('bcrypt');
const {genToken}=require("../lib/utils");
const {cloudinary}=require("../lib/cloudinary");

const signup=async(req,res)=>{
    const {fullname,email,password}=req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({message:"Credentials Required"});
    }
    try{
        if(password.length<6){
            return res.status(400).json({message:"Password must be greater than 6 digits"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists. Try logging in instead"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullname:fullname,
            email:email,
            password:hashedPassword,
        })
        if(newUser){
            genToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })
        }else{
            return res.status(400).json({message:"Invalid data"});
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({message:"Some internal error occured"});
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"No user found with these credentials"});
        }
        const isCorrectPassword=await bcrypt.compare(password,user.password);
        if(!isCorrectPassword){
            return res.status(400).json({message:"Invalid credentials"});
        }
        genToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic,
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({message:"Some error occured"});
    }
}

const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"Logout successful"});
    }catch(error){
        console.log(error);
        return res.status(400).json({message:"Some error occured"});
    }
}

const updateProfilePic=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        if(!profilePic){
            return res.status(400).json("No profile pic uploaded");
        }
        const userId=req.user._id;
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);
    }catch(error){
        return res.status(400).json({message:"Some error occured"});
    }
}
const checkAuth=async(req,res)=>{
    try{
        return res.status(200).json(req.user);
    }
    catch(err){
        console.log(err);
        return res.status(400).json({message:"Internal server error"});
    }
}

module.exports={updateProfilePic,logout,login,signup,checkAuth};