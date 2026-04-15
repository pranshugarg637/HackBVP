const limit = (value, min, max) => Math.min(Math.max(value, min), max);

const roleConfig = {
  sde: {
    label: "SDE",
    keywords: ["javascript", "react", "node", "express", "mongodb", "api", "git", "sql", "java", "python"],
    projects: [
      "Build a recruiter-friendly full-stack project with auth, dashboards, and role-based workflows.",
      "Ship a performance-focused frontend case study with lighthouse improvements and responsive states.",
      "Create a backend service with clean REST APIs, validation, and deployment notes.",
      "Publish a developer portfolio with 2 strong projects, architecture notes, and GitHub links.",
    ],
    learning: [
      "DSA revision",
      "system design basics",
      "testing and debugging",
      "deployments",
      "clean API design",
    ],
    interviewFocus: ["problem solving", "project walkthroughs", "tradeoff explanations", "debugging mindset"],
  },
  "data analyst": {
    label: "Data Analyst",
    keywords: [
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
    projects: [
      "Build a KPI dashboard with business questions, assumptions, and stakeholder insights.",
      "Create an end-to-end SQL plus Excel analysis case study using messy operational data.",
      "Publish a dashboard teardown showing metrics, trends, and recommendations.",
      "Document a data-cleaning project with before-after quality improvements and charts.",
    ],
    learning: [
      "SQL joins and window functions",
      "dashboard storytelling",
      "statistics refresh",
      "business problem framing",
      "Excel automation",
    ],
    interviewFocus: ["stakeholder communication", "metric design", "analysis framing", "storytelling with charts"],
  },
  "ml engineer": {
    label: "ML Engineer",
    keywords: [
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
    projects: [
      "Build an ML project with clean data preprocessing, evaluation, and deployment notes.",
      "Create a model comparison case study with metrics, tradeoffs, and failure analysis.",
      "Ship a lightweight inference demo and document the production constraints.",
      "Publish an end-to-end notebook showing feature engineering and model iteration.",
    ],
    learning: [
      "model evaluation",
      "feature engineering",
      "ml deployment",
      "experimentation tracking",
      "data preprocessing",
    ],
    interviewFocus: ["model tradeoffs", "feature decisions", "evaluation metrics", "production readiness"],
  },
};

const sectionPatterns = {
  Skills: /skills|tech stack|technologies|tools/,
  Projects: /projects|project experience|case study|portfolio/,
  Experience: /experience|internship|work history|employment/,
  Education: /education|coursework|university|college|b\.tech|btech/,
  Profile: /github|linkedin|portfolio|https?:\/\//,
};

const suggestionLibrary = {
  Skills: [
    "Group tools by category so the recruiter can scan languages, frameworks, and platforms in one pass.",
    "Promote your strongest stack to the first line of the skills section instead of burying it in project bullets.",
    "Keep the skills block ATS-friendly by avoiding icons-only layouts and uncommon abbreviations.",
  ],
  Projects: [
    "Lead each project bullet with the problem and outcome, not just the tech stack.",
    "For your top project, mention scale, users, latency, accuracy, or efficiency gains if available.",
    "Add one project that mirrors the target role more directly so relevance is obvious in the first 15 seconds.",
  ],
  Experience: [
    "Replace responsibility-only bullets with action plus metric plus outcome phrasing.",
    "Bring ownership words forward: built, automated, analyzed, designed, optimized, deployed.",
    "Make one bullet explicitly about collaboration, stakeholder handling, or team impact.",
  ],
  Education: [
    "Mention graduation year or expected graduation if you are early-career.",
    "Add relevant coursework only if it strengthens the target role and does not crowd the page.",
    "If experience is limited, use education projects to bridge credibility gaps.",
  ],
  Profile: [
    "Put your GitHub or LinkedIn near the header so ATS and recruiters can find it immediately.",
    "Use a short profile line that names your target role and strongest strengths.",
    "Keep contact details text-based instead of image-based so ATS parsers can read them.",
  ],
};

const addDotIfMissing = (text) => (text.endsWith(".") ? text : `${text}.`);

const hashString = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createSeededRandom = (seedInput) => {
  let state = hashString(seedInput) || 1;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const unique = (items) => [...new Set(items)];

const normalizeTokens = (text) => {
  return unique(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s/-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );
};

const countMatches = (text, phrase) => {
  const safe = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${safe}\\b`, "g");
  return (text.match(pattern) || []).length;
};

const getMatchedKeywords = (text, keywords) => {
  return keywords
    .map((keyword) => ({
      keyword,
      count: countMatches(text, keyword.toLowerCase()),
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
    .map((item) => item.keyword);
};

const getRoleScores = (text, tokenSet) => {
  return Object.entries(roleConfig)
    .map(([role, config]) => {
      const matches = getMatchedKeywords(text, config.keywords);
      const tokenBonus = config.keywords.filter((keyword) => tokenSet.includes(keyword.split(" ")[0])).length;
      const score = limit(Math.round(28 + matches.length * 8 + tokenBonus * 2), 35, 96);

      return {
        role,
        label: config.label,
        score,
        matches,
      };
    })
    .sort((a, b) => b.score - a.score);
};

const weightedSample = (items, count, random) => {
  const pool = [...items];
  const selected = [];

  while (pool.length && selected.length < count) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let threshold = random() * totalWeight;
    let pickedIndex = pool.length - 1;

    for (let index = 0; index < pool.length; index += 1) {
      threshold -= pool[index].weight;

      if (threshold <= 0) {
        pickedIndex = index;
        break;
      }
    }

    selected.push(pool[pickedIndex].value);
    pool.splice(pickedIndex, 1);
  }

  return selected;
};

const getResumeSignals = (rawText, lowerText) => {
  const bulletCount = (rawText.match(/\n[-*]\s/g) || []).length + (rawText.match(/\u2022/g) || []).length;
  const metricCount = (rawText.match(/\b\d+(?:\.\d+)?[%+x]?\b/g) || []).length;
  const projectCount = (lowerText.match(/project/g) || []).length;
  const experienceWords = (lowerText.match(/experience|internship|worked|built|developed|analyzed|designed/g) || []).length;
  const experienceYearsMatch = lowerText.match(/(\d+)\+?\s*(?:years|yrs)/);
  const experienceYears = experienceYearsMatch ? Number(experienceYearsMatch[1]) : 0;

  return {
    bulletCount,
    metricCount,
    projectCount,
    experienceWords,
    experienceYears,
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
  };
};

const getWeakSections = (text, signals) => {
  const weakSections = [];
  const notesBySection = {};

  if (!sectionPatterns.Skills.test(text)) {
    weakSections.push("Skills");
    notesBySection.Skills = weightedSample(
      suggestionLibrary.Skills.map((value, index) => ({ value, weight: 3 - index * 0.4 })),
      2,
      createSeededRandom(`skills-${text.length}`)
    );
  }

  if (!sectionPatterns.Projects.test(text) || signals.projectCount < 2) {
    weakSections.push("Projects");
    notesBySection.Projects = weightedSample(
      suggestionLibrary.Projects.map((value, index) => ({ value, weight: 3 - index * 0.4 })),
      2,
      createSeededRandom(`projects-${signals.projectCount}-${text.length}`)
    );
  }

  if (!sectionPatterns.Experience.test(text) || signals.metricCount < 2) {
    weakSections.push("Experience");
    notesBySection.Experience = weightedSample(
      suggestionLibrary.Experience.map((value, index) => ({ value, weight: 3 - index * 0.4 })),
      2,
      createSeededRandom(`experience-${signals.metricCount}-${text.length}`)
    );
  }

  if (!sectionPatterns.Education.test(text)) {
    weakSections.push("Education");
    notesBySection.Education = weightedSample(
      suggestionLibrary.Education.map((value, index) => ({ value, weight: 3 - index * 0.4 })),
      2,
      createSeededRandom(`education-${text.length}`)
    );
  }

  if (!sectionPatterns.Profile.test(text)) {
    weakSections.push("Profile");
    notesBySection.Profile = weightedSample(
      suggestionLibrary.Profile.map((value, index) => ({ value, weight: 3 - index * 0.4 })),
      2,
      createSeededRandom(`profile-${text.length}`)
    );
  }

  return { weakSections, notesBySection };
};

const getAtsIssues = (rawText, lowerText, signals) => {
  const issues = [];

  if (!/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/.test(lowerText)) {
    issues.push("Missing a visible email address in the header.");
  }

  if (!/(\+91|0)?[6-9]\d{9}|\b\d{10}\b/.test(lowerText)) {
    issues.push("Phone number is missing or hard for ATS to detect.");
  }

  if (!/skills|experience|projects|education/.test(lowerText)) {
    issues.push("Core section headings are weak or missing.");
  }

  if (signals.bulletCount < 3) {
    issues.push("Resume uses very few bullet points, so scan clarity drops.");
  }

  if (signals.metricCount < 2) {
    issues.push("Most bullets lack measurable outcomes or metrics.");
  }

  if (signals.wordCount < 120) {
    issues.push("Resume content is too thin for strong ATS keyword coverage.");
  }

  return issues;
};

const getTopMissingSkills = (config, matchedSkills, random) => {
  const weighted = config.keywords
    .filter((skill) => !matchedSkills.includes(skill))
    .map((skill, index) => ({
      value: skill,
      weight: Math.max(1, config.keywords.length - index),
    }));

  return weightedSample(weighted, 4, random);
};

const buildSuggestions = (targetRole, missingSkills, signals, weakSections, random) => {
  const config = roleConfig[targetRole];
  const suggestionPool = [
    ...missingSkills.map((skill, index) => ({
      value: `Add stronger evidence of ${skill} through one project bullet or a dedicated skills mention.`,
      weight: 6 - index,
    })),
    ...config.learning.map((topic, index) => ({
      value: `Spend one focused revision block this week on ${topic}.`,
      weight: 5 - index * 0.4,
    })),
    ...weakSections.map((section, index) => ({
      value: `Rework the ${section.toLowerCase()} section so it looks intentional instead of filler content.`,
      weight: 4 - index * 0.3,
    })),
    {
      value:
        signals.metricCount < 3
          ? "Add metrics to at least 2 bullets so your impact is visible to both ATS and recruiters."
          : "Keep your strongest quantified bullet near the top third of the resume.",
      weight: 5,
    },
    {
      value:
        signals.experienceYears === 0
          ? "If you are early-career, let projects carry more proof of ownership and outcomes."
          : "Use your experience years strategically by naming ownership, scope, and outcomes together.",
      weight: 4,
    },
  ];

  return weightedSample(suggestionPool, 3, random);
};

const getRoadmap = (targetRole, missingSkills, random) => {
  const config = roleConfig[targetRole];
  const firstSkill = missingSkills[0] || config.learning[0];
  const secondSkill = missingSkills[1] || config.learning[1];
  const thirdSkill = missingSkills[2] || config.interviewFocus[0];
  const projectIdea = weightedSample(
    config.projects.map((value, index) => ({ value, weight: 5 - index * 0.5 })),
    1,
    random
  )[0];

  return {
    summary: `This 30-day plan pushes your ${config.label} profile toward a stronger shortlist by mixing skill-building, proof of work, and sharper positioning.`,
    steps: [
      {
        week: 1,
        title: `Strengthen ${firstSkill}`,
        topics: [firstSkill, "resume positioning", "target-role vocabulary"],
        tasks: [
          `Revise the basics of ${firstSkill} and note the most interview-relevant concepts.`,
          "Update resume wording so your strongest matching keywords appear naturally in visible sections.",
          "Rewrite one project or experience bullet with outcome-first phrasing.",
        ],
        outcome: `Your profile will sound more aligned to ${config.label} roles in both ATS and recruiter review.`,
      },
      {
        week: 2,
        title: "Create stronger proof of work",
        topics: [secondSkill, "portfolio evidence", "deliverables"],
        tasks: [
          projectIdea,
          `Make ${secondSkill} visible through screenshots, GitHub notes, or short documentation.`,
          "Add 2 measurable bullets from this work back into the resume.",
        ],
        outcome: "You will have stronger evidence instead of only listing skills.",
      },
      {
        week: 3,
        title: "Sharpen story and confidence",
        topics: [thirdSkill, "mock questions", "communication"],
        tasks: [
          "Practice a 60-second introduction tailored to the role.",
          "Prepare concise answers for project choices, tradeoffs, and outcomes.",
          "Refine weak sections so each one earns space on the page.",
        ],
        outcome: "Your resume and verbal narrative will start supporting each other.",
      },
      {
        week: 4,
        title: "Apply with a tighter loop",
        topics: ["tailoring", "applications", "iteration"],
        tasks: [
          "Tailor the resume for 5 to 10 openings with small keyword adjustments.",
          "Track which roles feel strongest and which missing skills keep repeating.",
          "Continue iterating based on recruiter expectations and interview feedback.",
        ],
        outcome: "You finish with a better resume, sharper targeting, and an active application loop.",
      },
    ],
  };
};

const rewriteBullet = (line, targetRole, signals) => {
  const label = roleConfig[targetRole].label;

  if (/\b\d/.test(line)) {
    return `Delivered ${label.toLowerCase()} work with clear ownership, stronger context, and better framing of the existing measurable result: ${line}`;
  }

  return `Built this into a stronger ${label} bullet by naming the problem, your contribution, the stack, and one measurable outcome or user impact.`;
};

const getBulletSuggestions = (rawText, targetRole, random) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 24 && !/:$/.test(line))
    .slice(0, 8);

  const selected = weightedSample(
    lines.map((value, index) => ({
      value,
      weight: Math.max(1, 8 - index),
    })),
    3,
    random
  );

  return selected.map((line) => ({
    original: line,
    improved: rewriteBullet(line, targetRole),
  }));
};

const getInterviewPrep = (targetRole, matchedSkills, missingSkills) => {
  const config = roleConfig[targetRole];
  const spotlightSkill = matchedSkills[0] || "your strongest project";
  const growthSkill = missingSkills[0] || config.learning[0];

  return {
    questions: [
      {
        category: "Resume Walkthrough",
        question: `Walk me through the project that best proves your fit for a ${config.label} role.`,
        answer: "Structure it as problem, your role, approach, stack, tradeoffs, measurable outcome, and what you would improve next.",
      },
      {
        category: "Skill Depth",
        question: `How have you used ${spotlightSkill} in practice rather than just listing it on the resume?`,
        answer: "Explain one concrete implementation, why you chose that approach, and what changed because of it.",
      },
      {
        category: "Growth Gap",
        question: `What is your current plan to improve ${growthSkill}?`,
        answer: "Show a realistic learning loop: what you are studying, how you are practicing it, and how it will become proof of work.",
      },
    ],
  };
};

const generateResumeAnalysis = ({ fileName, resumeText, targetRole }) => {
  const rawText = `${resumeText || ""}`.trim();
  const lowerText = rawText.toLowerCase();
  const tokenSet = normalizeTokens(rawText);
  const roleScores = getRoleScores(lowerText, tokenSet);
  const preferredRole = roleScores.find((item) => item.role === targetRole);
  const bestRole = preferredRole || roleScores[0];
  const config = roleConfig[bestRole.role];
  const random = createSeededRandom(`${fileName || "resume"}|${bestRole.role}|${rawText}`);
  const signals = getResumeSignals(rawText, lowerText);
  const weakSectionData = getWeakSections(lowerText, signals);
  const weakSections = weakSectionData.weakSections;
  const notesBySection = weakSectionData.notesBySection;
  const atsIssues = getAtsIssues(rawText, lowerText, signals);
  const matchedSkills = bestRole.matches.slice(0, 6);
  const missingSkills = getTopMissingSkills(config, matchedSkills, random);

  const atsScore = limit(
    44 +
      matchedSkills.length * 5 +
      Math.min(signals.wordCount / 35, 16) +
      Math.min(signals.metricCount * 2.5, 9) +
      Math.min(signals.bulletCount, 6) -
      weakSections.length * 3 -
      atsIssues.length * 2,
    46,
    94
  );

  const readinessScore = limit(
    Math.round(bestRole.score * 0.6 + atsScore * 0.25 + Math.min(signals.experienceYears * 3, 12) + matchedSkills.length * 1.5),
    42,
    95
  );

  const strengths = [
    `Resume aligns with ${matchedSkills.length} core ${config.label} keywords, led by ${matchedSkills.slice(0, 3).join(", ") || "foundational experience"}.`,
    addDotIfMissing(
      signals.metricCount >= 2
        ? "You already have some quantified signals, which makes recruiter scanning easier"
        : "The resume has the base ingredients, but quantified proof is still thin"
    ),
    addDotIfMissing(
      signals.projectCount >= 2
        ? "Project presence gives you useful material for both ATS and interviews"
        : "One stronger project narrative could raise both relevance and confidence"
    ),
  ];

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
      strengths,
      suggestions: buildSuggestions(bestRole.role, missingSkills, signals, weakSections, random),
    },
    jobMatchAnalysis: {
      roleMatchScore: bestRole.score,
      readinessScore,
      matchedSkills,
      missingSkills,
      missingKeywords: missingSkills,
    },
    roadmap: getRoadmap(bestRole.role, missingSkills, random),
    resumeRewrite: {
      improvedSummary: `Targeting ${config.label} opportunities with a resume that now needs sharper proof of ${missingSkills[0] || "role-fit strengths"}, stronger metrics, and clearer ownership signals.`,
      bulletSuggestions: getBulletSuggestions(rawText, bestRole.role, random),
    },
    interviewPrep: getInterviewPrep(bestRole.role, matchedSkills, missingSkills),
    status: "analyzed",
    weakSectionNotes: notesBySection,
  };
};

module.exports = { generateResumeAnalysis };
