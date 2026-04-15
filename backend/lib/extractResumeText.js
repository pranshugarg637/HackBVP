const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(file) {
  if (!file) {
    return "";
  }

  const name = (file.originalname || "").toLowerCase();

  if (name.endsWith(".pdf")) {
    const data = await pdfParse(file.buffer);
    return (data.text || "").trim();
  }

  if (name.endsWith(".docx")) {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return (data.value || "").trim();
  }

  if (name.endsWith(".txt")) {
    return file.buffer.toString("utf-8").trim();
  }

  throw new Error("Only PDF, DOCX, and TXT files are supported");
}

module.exports = { extractResumeText };
