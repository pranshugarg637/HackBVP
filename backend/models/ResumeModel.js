const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    },
    category: {
        type: String
    }
});

const roadmapStepSchema = new mongoose.Schema(
  {
    week: {
        type: Number,
    },
    title: {
      type: String,
    },
    topics:[
        {
            type: String,
        }
    ],
    tasks:[
        {
            type: String,
        }
    ],
    outcome: {
        type: String,
    },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String
    },
    extractedText: {
      type: String,
      default: "",
    },
    targetRole: {
      type: String,
      trim: true,
      default: "",
    },
    jobDescription: {
      type: String,
      default: "",
    },
    suggestedRoles: [
      {
        type: String,
        trim: true,
      },
    ],

    atsAnalysis: {
      score: {
        type: Number,
        default: 0,
      },
      weakSections: [
        {
          type: String,
          trim: true,
        },
      ],
      atsIssues: [
        {
          type: String,
          trim: true,
        },
      ],
      strengths: [
        {
          type: String,
          trim: true,
        },
      ],
      suggestions: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    jobMatchAnalysis: {
      roleMatchScore: {
        type: Number,
        default: 0,
      },
      readinessScore: {
        type: Number,
        default: 0,
      },
      matchedSkills: [
        {
          type: String,
          trim: true,
        },
      ],
      missingSkills: [
        {
          type: String,
          trim: true,
        },
      ],
      missingKeywords: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    roadmap: {
      summary: {
        type: String,
        default: "",
      },
      steps: [roadmapStepSchema],
    },

    resumeRewrite: {
      improvedSummary: {
        type: String,
        default: "",
      },
      bulletSuggestions: [
        {
          original: {
            type: String,
            trim: true,
          },
          improved: {
            type: String,
            trim: true,
          },
        },
      ],
    },

    interviewPrep: {
      questions: [interviewQuestionSchema],
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "analyzed", "failed"],
      default: "uploaded",
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;
