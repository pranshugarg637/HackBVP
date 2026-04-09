require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT || 8000;
const mongoose=require('mongoose');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const User=require("./models/userModel");
const Resume=require("./models/ResumeModel");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const authRoutes=require("./routes/authRoutes");
const resumeRoutes=require("./routes/resumeRoutes");
const cors=require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

async function main(){
    mongoose.connect(process.env.MONGO_URL);
}
main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
})

// app.get("/",(req,res)=>{
//     res.send("Hello World");
// })
app.use("/api/auth",authRoutes);
app.use("/api/resumes",resumeRoutes);

app.listen(port,()=>{
    console.log("Listening to port");
})
