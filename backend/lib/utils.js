const jwt=require("jsonwebtoken");

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in backend/.env");
    }

    return process.env.JWT_SECRET;
}

const genToken=(userId,res)=>{
    const token=jwt.sign({userId},getJwtSecret(),
        {expiresIn:"7d"}
    )
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    })
}
module.exports={genToken,getJwtSecret};
