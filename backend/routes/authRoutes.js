const express=require("express");
const router=express.Router();
const {signup}=require("../controllers/authController");
const {login}=require("../controllers/authController");
const {logout}=require("../controllers/authController");
const {updateProfilePic}=require("../controllers/authController");
const {checkAuth}=require("../controllers/authController");
const {protectRoute}=require("../middlewares/authMiddleware");

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/check",protectRoute,checkAuth);
router.put("/update-profile",protectRoute,updateProfilePic);
module.exports=router;
