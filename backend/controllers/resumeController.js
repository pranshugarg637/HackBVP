const Resume = require("../models/ResumeModel");
const { generateResumeAnalysis } = require("../lib/resumeAnalysis");

const analyzeResume = async (req, res) => {
  try {
    const { fileName, resumeText, targetRole } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({ message: "Resume text and target role are required" });
    }

    const analysis = generateResumeAnalysis({
      fileName,
      resumeText,
      targetRole,
    });

    const resume = await Resume.create({
      user: req.user._id,
      ...analysis,
    });

    return res.status(201).json({
      message: "Resume analyzed successfully",
      resume,
      weakSectionNotes: analysis.weakSectionNotes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to analyze resume right now" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const totalResumes = await Resume.countDocuments({ user: req.user._id });
    const latestResume = resumes[0] || null;

    const averageAtsScore = resumes.length
      ? Math.round(
          resumes.reduce((total, item) => total + (item.atsAnalysis?.score || 0), 0) /
            resumes.length
        )
      : 0;

    return res.status(200).json({
      latestResume,
      recentResumes: resumes,
      metrics: {
        totalResumes,
        averageAtsScore,
        latestReadiness: latestResume?.jobMatchAnalysis?.readinessScore || 0,
        totalSkillGaps: latestResume?.jobMatchAnalysis?.missingSkills?.length || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to load dashboard data" });
  }
};

module.exports = {
  analyzeResume,
  getDashboardData,
};