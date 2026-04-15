const OpenAI = require("openai");

const getAzureBaseUrl = () => {
  const endpoint =
    process.env.OPENAI_BASE_URL ||
    process.env.AZURE_OPENAI_ENDPOINT ||
    process.env.ENDPOINT;

  if (!endpoint) {
    return null;
  }

  const trimmedEndpoint = endpoint.replace(/\/+$/, "");
  return trimmedEndpoint.endsWith("/openai/v1")
    ? `${trimmedEndpoint}/`
    : `${trimmedEndpoint}/openai/v1/`;
};

const getApiKey = () => {
  return (
    process.env.AZURE_OPENAI_API_KEY ||
    process.env.KEY1 ||
    process.env.KEY2 ||
    process.env.OPENAI_API_KEY
  );
};

const getModelName = () => {
  return (
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    process.env.OPENAI_MODEL
  );
};

const clientConfig = {
  apiKey: getApiKey(),
};

const azureBaseUrl = getAzureBaseUrl();
if (azureBaseUrl) {
  clientConfig.baseURL = azureBaseUrl;
}

const openai = new OpenAI(clientConfig);

async function generateAIResumeAnalysis({ resumeText, targetRole, jobDescription }) {
  if (!clientConfig.apiKey) {
    throw new Error("Missing Azure/OpenAI API key in backend environment");
  }

  const modelName = getModelName();

  if (!modelName) {
    throw new Error("Missing Azure deployment name or OPENAI_MODEL in backend environment");
  }

  const prompt = `
You are an expert ATS resume reviewer and career coach.

Analyze the resume for the target role and return ONLY valid JSON.

Required JSON format:
{
  "suggestedRoles": ["string"],
  "atsAnalysis": {
    "score": 0,
    "weakSections": ["string"],
    "atsIssues": ["string"],
    "strengths": ["string"],
    "suggestions": ["string"]
  },
  "jobMatchAnalysis": {
    "roleMatchScore": 0,
    "readinessScore": 0,
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "missingKeywords": ["string"]
  },
  "roadmap": {
    "summary": "string",
    "steps": [
      {
        "week": 1,
        "title": "string",
        "topics": ["string"],
        "tasks": ["string"],
        "outcome": "string"
      }
    ]
  },
  "resumeRewrite": {
    "improvedSummary": "string",
    "bulletSuggestions": [
      {
        "original": "string",
        "improved": "string"
      }
    ]
  },
  "interviewPrep": {
    "questions": [
      {
        "category": "string",
        "question": "string",
        "answer": "string"
      }
    ]
  },
  "weakSectionNotes": {
    "Skills": ["string"],
    "Projects": ["string"],
    "Experience": ["string"],
    "Education": ["string"],
    "Profile": ["string"]
  }
}

Rules:
- Return only JSON
- Scores must be integers from 0 to 100
- Be practical and realistic
- Do not invent fake experience
- Keep roadmap to 4 weeks
`;

  const response = await openai.responses.create({
    model: modelName,
    input: `${prompt}

Target role: ${targetRole}
Job description: ${jobDescription || "Not provided"}

Resume text:
${resumeText}`,
    text: {
      format: {
        type: "json_object",
      },
    },
  });

  if (!response.output_text) {
    throw new Error("Azure/OpenAI returned an empty response");
  }

  return JSON.parse(response.output_text);
}

module.exports = { generateAIResumeAnalysis };
