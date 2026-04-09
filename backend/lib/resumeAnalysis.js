const limit = (value, min, max) => Math.min(Math.max(value, min), max);

const roleKeywords = {
  sde: ["javascript", "react", "node", "express", "mongodb", "api", "git", "sql", "java", "python"],
  "data analyst": [
    "sql",
    "excel",
    "power bi",
    "tableau",
    "statistics",
    "python",
    "dashboard",
    "analysis",
    "visualization",
    "reporting",
  ],
  "ml engineer": [
    "python",
    "tensorflow",
    "pytorch",
    "machine learning",
    "statistics",
    "data preprocessing",
    "deployment",
    "model",
    "nlp",
    "sql",
  ],
};

const roleLabels = {
  sde: "SDE",
  "data analyst": "Data Analyst",
  "ml engineer": "ML Engineer",
};

const addDotIfMissing = (text) => (text.endsWith(".") ? text : `${text}.`);

const getMatchedKeywords = (text, keywords) => {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
};

const getRoleScores = (text) => {
  const scores = [];

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const matches = getMatchedKeywords(text, keywords);
    const score = limit(Math.round((matches.length / keywords.length) * 100), 35, 95);

    scores.push({
      role,
      label: roleLabels[role],
      score,
      matches,
    });
  }

  return scores.sort((a, b) => b.score - a.score);
};

const getWeakSections = (text) => {
  const weakSections = [];
  const notesBySection = {};

  const hasSkills = /skills|tech stack|technologies/.test(text);
  const hasProjects = /projects|project experience/.test(text);
  const hasExperience = /experience|internship|work history/.test(text);
  const hasEducation = /education|coursework|university|college/.test(text);
  const hasNumbers = /\b\d+[%+]?\b/.test(text);
  const hasLinks = /github|linkedin|portfolio|https?:\/\//.test(text);

  if (!hasSkills) {
    weakSections.push("Skills");
    notesBySection.Skills = [
      "Add a dedicated skills block with tools, languages, and platforms.",
      "Group skills by category so recruiters can scan faster.",
    ];
  }

  if (!hasProjects) {
    weakSections.push("Projects");
    notesBySection.Projects = [
      "Include 2 to 3 projects with stack, ownership, and measurable outcomes.",
      "Add repository or demo links where possible.",
    ];
  }

  if (!hasExperience || !hasNumbers) {
    weakSections.push("Experience");
    notesBySection.Experience = [
      "Rewrite experience bullets with numbers, impact, or time saved.",
      "Highlight specific ownership instead of generic responsibilities.",
    ];
  }

  if (!hasEducation) {
    weakSections.push("Education");
    notesBySection.Education = [
      "Add education details, graduation timeline, and relevant coursework.",
      "Mention academic projects if they support the target role.",
    ];
  }

  if (!hasLinks) {
    weakSections.push("Profile");
    notesBySection.Profile = [
      "Add LinkedIn, GitHub, or portfolio links for stronger credibility.",
    ];
  }

  return { weakSections, notesBySection };
};

const getAtsIssues = (rawText) => {
  const text = rawText.toLowerCase();
  const issues = [];

  if (!/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/.test(text)) {
    issues.push("Missing a visible email address in the resume header");
  }

  if (!/(\+91|0)?[6-9]\d{9}|\b\d{10}\b/.test(text)) {
    issues.push("Phone number is missing or difficult for ATS to detect");
  }

  if (!/skills|experience|projects|education/.test(text)) {
    issues.push("Core resume section headings are weak or missing");
  }

  if (!/\n[-*]/.test(rawText) && !/\u2022/.test(rawText)) {
    issues.push("Resume uses very few bullet points, which reduces scan clarity");
  }

  if (!/\b\d+[%+]?\b/.test(text)) {
    issues.push("Most bullets lack measurable outcomes or metrics");
  }

  return issues;
};

const getRoadmap = (targetRole, missingSkills) => {
  const firstSkill = missingSkills[0] || "core role skills";
  const secondSkill = missingSkills[1] || "project execution";
  const thirdSkill = missingSkills[2] || "revision and mock interviews";

  return {
    summary: `This 30-day plan is designed to move your ${roleLabels[targetRole] || "target role"} readiness forward with focused weekly milestones.`,
    steps: [
      {
        week: 1,
        title: `Build foundations in ${firstSkill}`,
        topics: [firstSkill, "terminology", "hands-on basics"],
        tasks: [
          `Study the fundamentals of ${firstSkill}`,
          "Take notes and create one-page revision material",
          "Practice beginner-level exercises daily",
        ],
        outcome: `You should be comfortable explaining and applying ${firstSkill} in simple scenarios.`,
      },
      {
        week: 2,
        title: `Turn ${secondSkill} into proof`,
        topics: [secondSkill, "portfolio framing", "resume-ready deliverables"],
        tasks: [
          `Build a small project that demonstrates ${secondSkill}`,
          "Document your process, decisions, and measurable output",
          "Publish the work to GitHub or a sharable folder",
        ],
        outcome: "You will have one concrete project that strengthens your resume story.",
      },
      {
        week: 3,
        title: "Sharpen practice and revision",
        topics: [thirdSkill, "role-specific exercises", "feedback loops"],
        tasks: [
          "Solve practice tasks for the target role",
          "Refine weak resume bullets with stronger verbs and metrics",
          "Review common ATS and recruiter screening expectations",
        ],
        outcome: "Your profile becomes more interview-ready and easier to shortlist.",
      },
      {
        week: 4,
        title: "Apply with confidence",
        topics: ["applications", "tailoring", "follow-through"],
        tasks: [
          "Tailor the resume for 5 to 10 real openings",
          "Prepare a concise self-introduction and project pitch",
          "Track applications and iterate based on responses",
        ],
        outcome: "You end the month with a stronger resume, clearer direction, and active applications.",
      },
    ],
  };
};

const getBulletSuggestions = (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 20)
    .slice(0, 3);

  return lines.map((line, index) => {
    return {
      original: line,
      improved: `Led initiative ${index + 1} with clear ownership, delivered measurable progress, and improved team outcomes through structured execution.`,
    };
  });
};

const getInterviewPrep = (targetRole, matchedSkills) => {
  const spotlightSkill = matchedSkills[0] || "your strongest project";

  return {
    questions: [
      {
        category: "Resume Walkthrough",
        question: `Walk me through a project that best demonstrates your fit for a ${roleLabels[targetRole] || "target"} role.`,
        answer: "Use a concise structure: problem, your role, stack, challenge, measurable result, and what you would improve next.",
      },
      {
        category: "Skill Depth",
        question: `How have you applied ${spotlightSkill} in practice?`,
        answer: "Describe a specific implementation, the tradeoffs you made, and how the work impacted performance, speed, or clarity.",
      },
    ],
  };
};

const generateResumeAnalysis = ({ fileName, resumeText, targetRole }) => {
  const rawText = `${resumeText || ""}`.trim();
  const lowerText = rawText.toLowerCase();

  const roleScores = getRoleScores(lowerText);
  const bestRole = roleScores.find((item) => item.role === targetRole) || roleScores[0];

  const weakSectionData = getWeakSections(lowerText);
  const weakSections = weakSectionData.weakSections;
  const notesBySection = weakSectionData.notesBySection;

  const atsIssues = getAtsIssues(rawText);
  const matchedSkills = bestRole.matches.slice(0, 6);
  const missingSkills = roleKeywords[bestRole.role]
    .filter((skill) => !matchedSkills.includes(skill))
    .slice(0, 4);

  const atsScore = limit(
    52 +
      Math.min(rawText.length / 45, 15) +
      matchedSkills.length * 4 -
      weakSections.length * 3 -
      atsIssues.length * 2,
    48,
    92
  );

  const readinessScore = limit(
    Math.round(bestRole.score * 0.72 + atsScore * 0.28),
    45,
    93
  );

  return {
    fileName: fileName || "resume.pdf",
    fileUrl: `mock://resume/${encodeURIComponent(fileName || "resume.pdf")}`,
    fileType: "mock-upload",
    extractedText: rawText,
    targetRole: bestRole.role,
    suggestedRoles: roleScores.map((item) => item.label),
    atsAnalysis: {
      score: Math.round(atsScore),
      weakSections,
      atsIssues,
      strengths: [
        `Resume shows alignment with ${matchedSkills.length} ${roleLabels[bestRole.role]} keywords`,
        addDotIfMissing(
          rawText.length > 500
            ? "Content length is healthy enough for a one-page ATS scan"
            : "Content is concise and can still be expanded with stronger detail"
        ),
      ],
      suggestions: [
        "Prioritize quantifiable achievements in experience and project bullets.",
        "Mirror the language used in the job role you are targeting.",
        "Keep formatting simple, consistent, and ATS-friendly.",
      ],
    },
    jobMatchAnalysis: {
      roleMatchScore: bestRole.score,
      readinessScore,
      matchedSkills,
      missingSkills,
      missingKeywords: missingSkills,
    },
    roadmap: getRoadmap(bestRole.role, missingSkills),
    resumeRewrite: {
      improvedSummary: `Targeting ${roleLabels[bestRole.role]} opportunities with a resume that should better highlight ownership, practical skills, and measurable impact.`,
      bulletSuggestions: getBulletSuggestions(rawText),
    },
    interviewPrep: getInterviewPrep(bestRole.role, matchedSkills),
    status: "analyzed",
    weakSectionNotes: notesBySection,
  };
};

module.exports = { generateResumeAnalysis };
