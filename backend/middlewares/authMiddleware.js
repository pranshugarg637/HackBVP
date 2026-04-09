const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const { getJwtSecret } = require("../lib/utils");
const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({message:"Unauthorized : User does not exist"});
        }
        const decoded=jwt.verify(token,getJwtSecret());
        if(!decoded){
            return res.status(400).json({mmessage:"Unauthorized : No token"});
        }
        const user=await User.findById(decoded.userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        req.user=user;
        next();
    }catch(error){
        console.log(error);
        return res.status(400).json({message:"Some error occured"});
    }
}
module.exports={protectRoute};
