const express = require("express");
const { protectRoute } = require("../middlewares/authMiddleware");
const { analyzeResume, getDashboardData } = require("../controllers/resumeController");

const router = express.Router();

router.get("/dashboard", protectRoute, getDashboardData);
router.post("/analyze", protectRoute, analyzeResume);

module.exports = router;
