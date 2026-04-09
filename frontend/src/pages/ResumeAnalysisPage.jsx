import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useResumeStore } from "../store/useResumeStore";

const roleLabels = {
  sde: "SDE",
  "data analyst": "Data Analyst",
  "ml engineer": "ML Engineer",
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analyzer", label: "Resume Analyzer", icon: FileText },
  { id: "skill-gap", label: "Skill Gap", icon: Target },
  { id: "roadmap", label: "Roadmap", icon: Map },
];

const buildMockResumeText = (fileName, targetRole) => {
  const roleTitle = roleLabels[targetRole] || "Data Analyst";
  const safeFileName = fileName || "candidate_resume.pdf";

  const templates = {
    sde: `Resume file: ${safeFileName}
Summary
Aspiring software developer with internship exposure to React, Node.js, Express and MongoDB.

Skills
JavaScript, React, Node.js, Express, MongoDB, Git, REST APIs

Projects
Built a MERN task tracking app for college teams and improved task visibility.
Created a portfolio website with responsive UI and deployed projects on GitHub.

Experience
Worked on team assignments and contributed frontend modules for internal dashboards.

Education
B.Tech in Computer Science
`,
    "data analyst": `Resume file: ${safeFileName}
Summary
Entry-level analyst interested in dashboards, reporting and business insights.

Skills
Excel, Python, Data Cleaning, Visualization, Pandas

Projects
Built a sales analysis dashboard using spreadsheets and charts.
Analyzed student placement data and presented trends to faculty.

Experience
Supported reporting tasks and prepared weekly summaries for academic projects.

Education
B.Tech in Information Technology
`,
    "ml engineer": `Resume file: ${safeFileName}
Summary
Machine learning enthusiast with project exposure to Python and model building.

Skills
Python, NumPy, Pandas, Scikit-learn, Data Preprocessing

Projects
Created a prediction model for student performance using structured data.
Built a simple image classifier and documented training observations.

Experience
Worked on academic machine learning assignments and experimentation workflows.

Education
B.Tech in Artificial Intelligence
`,
  };

  return templates[targetRole] || `Resume file: ${safeFileName}\nTarget role: ${roleTitle}\nSkills\nCommunication\nProjects\nAcademic project\nEducation\nBachelor degree`;
};

const getSectionStatus = (name) => {
  if (name === "Experience") return "Needs improvement";
  if (name === "Profile") return "Missing details";
  return "Good";
};

const getStatusClassName = (status) => {
  if (status === "Needs improvement") {
    return "bg-amber-100 text-amber-700 ring-1 ring-amber-300";
  }

  if (status === "Missing details") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-300";
  }

  return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300";
};

const EmptyState = ({ onAction }) => (
  <div className="glass-panel rounded-[28px] p-8 lg:p-10">
    <div className="max-w-2xl">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-violet-700 uppercase">
        <Sparkles size={14} />
        Mock analysis workflow
      </p>
      <h2 className="headline-serif text-3xl text-slate-900 lg:text-4xl">
        Upload your resume details and generate a grounded ATS-style review.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
        This build avoids AI integration for the hackathon MVP. The backend creates deterministic mock analysis,
        readiness scoring, weak section notes, and a 30-day roadmap after you upload a resume title and paste the
        content you want evaluated.
      </p>
      <button
        type="button"
        onClick={() => onAction("analyzer")}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
      >
        Analyze first resume
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

const ResumeAnalysisPage = () => {
  const { authUser, logout } = useAuthStore();
  const {
    latestResume,
    metrics,
    recentResumes,
    weakSectionNotes,
    isDashboardLoading,
    isAnalyzing,
    fetchDashboard,
    analyzeResume,
    selectResume,
  } = useResumeStore();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    targetRole: "data analyst",
    resumeText: "",
  });

  const shellStyle = {
    gridTemplateColumns: sidebarCollapsed ? "92px minmax(0, 1fr)" : "290px minmax(0, 1fr)",
  };

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const setMockText = () => {
      setFormData((current) => ({
        ...current,
        fileName: file.name,
        resumeText: current.resumeText.trim() || buildMockResumeText(file.name, current.targetRole),
      }));
    };

    if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileText = typeof reader.result === "string" ? reader.result : "";

        setFormData((current) => ({
          ...current,
          fileName: file.name,
          resumeText: fileText.trim() || current.resumeText.trim() || buildMockResumeText(file.name, current.targetRole),
        }));
      };
      reader.onerror = setMockText;
      reader.readAsText(file);
      return;
    }

    setMockText();
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    const sourceText =
      formData.resumeText.trim() || (formData.fileName ? buildMockResumeText(formData.fileName, formData.targetRole) : "");

    if (!sourceText) {
      return;
    }

    const result = await analyzeResume({
      fileName: formData.fileName || "candidate_resume.pdf",
      targetRole: formData.targetRole,
      resumeText: sourceText,
    });

    if (result) {
      setActiveSection("dashboard");
      setFormData((current) => ({ ...current, resumeText: sourceText }));
    }
  };

  const currentWeakNotes = latestResume?.atsAnalysis?.weakSections?.map((section) => ({
    section,
    notes: weakSectionNotes[section] || latestResume?.weakSectionNotes?.[section] || [],
  }));

  const showDashboard = activeSection === "dashboard";
  const showAnalyzer = activeSection === "analyzer";
  const showSkillGap = activeSection === "skill-gap";
  const showRoadmap = activeSection === "roadmap";
  const hasAnalysis = Boolean(latestResume);

  const ringStyle = {
    "--progress": `${(latestResume?.atsAnalysis?.score || 0) * 3.6}deg`,
  };

  return (
    <div className="min-h-screen px-4 py-4 lg:px-6">
      <div className="app-shell-grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border border-slate-200 bg-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.10)] lg:[grid-template-columns:unset]" style={shellStyle}>
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
          />
        )}
        <aside
          className={`fixed inset-y-4 left-4 z-40 w-[290px] rounded-[30px] border border-slate-200 bg-[#f8f9ff] p-5 transition duration-300 lg:static lg:inset-auto lg:w-auto lg:rounded-none lg:border-r lg:border-slate-200 lg:border-t-0 lg:border-l-0 lg:border-b-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[115%] lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-4"}`}>
                <div className="grid h-15 w-15 place-items-center rounded-[20px] bg-[linear-gradient(145deg,#6e55ff,#4c2bdb)] text-white shadow-[0_12px_30px_rgba(88,67,255,0.24)]">
                  <BrainCircuit size={28} />
                </div>
                <div className={sidebarCollapsed ? "hidden" : "block"}>
                  <h1 className="text-2xl font-semibold text-slate-900">Resumind AI</h1>
                  <p className="text-sm text-slate-500">Mock career coach workspace</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="hidden rounded-2xl bg-white p-3 text-slate-600 ring-1 ring-slate-200 lg:block"
                  onClick={() => setSidebarCollapsed((current) => !current)}
                >
                  {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <button
                  type="button"
                  className="rounded-2xl bg-slate-100 p-3 text-slate-600 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <nav className="mt-10 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeSection;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex w-full items-center rounded-[20px] px-4 py-4 text-left text-base font-medium transition ${
                      active
                        ? "bg-[linear-gradient(90deg,#5641e8,#7d48f2)] text-white shadow-[0_20px_45px_rgba(90,69,234,0.35)]"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    } ${sidebarCollapsed ? "justify-center" : "gap-4"}`}
                  >
                    <Icon size={20} />
                    <span className={sidebarCollapsed ? "hidden" : "inline"}>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {!sidebarCollapsed && (
              <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">{authUser?.fullname}</p>
                <p className="mt-1 text-slate-500">{authUser?.email}</p>
                <p className="mt-4 leading-6 text-slate-500">
                  Built as a clean hackathon MVP with MERN only, no live AI calls, and believable scoring flow.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              title={sidebarCollapsed ? "Logout" : undefined}
              className={`mt-auto flex items-center rounded-[20px] px-4 py-4 text-left text-slate-600 transition hover:bg-white hover:text-slate-900 ${
                sidebarCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <LogOut size={20} />
              <span className={sidebarCollapsed ? "hidden" : "inline"}>Logout</span>
            </button>
          </div>
        </aside>

        <main className="relative overflow-y-auto bg-[linear-gradient(180deg,#f8fbff,#eef2ff)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[10%] top-10 h-52 w-52 rounded-full bg-cyan-200/50 blur-[110px]" />
            <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-violet-200/55 blur-[130px]" />
          </div>

          <div className="relative px-5 py-5 lg:px-10 lg:py-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={20} />
                  </button>
                  <button
                    type="button"
                    className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 lg:block"
                    onClick={() => setSidebarCollapsed((current) => !current)}
                  >
                    {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                  </button>
                </div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Resume workspace</p>
                <h2 className="headline-serif mt-3 text-4xl text-slate-900 lg:text-5xl">
                  {latestResume ? "Welcome back to your analysis board" : "Build your first mock analysis"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Focus on ATS score, weak sections, and a practical roadmap. Everything here is powered by mock
                  backend logic so the demo stays fully within the MERN stack.
                </p>
              </div>

              <div className="hidden rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-right lg:block">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Target path</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {roleLabels[latestResume?.targetRole] || roleLabels[formData.targetRole]}
                </p>
              </div>
            </div>
            {!hasAnalysis && !isDashboardLoading && !showAnalyzer ? (
              <EmptyState onAction={setActiveSection} />
            ) : (
              <>
                {hasAnalysis && (showDashboard || showSkillGap || showRoadmap) && (
                  <section className="grid gap-5 xl:grid-cols-[1.2fr_1fr_1fr]">
                  <div className="glass-panel rounded-[28px] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Latest ATS Score</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                          {latestResume?.fileName || "No analysis yet"}
                        </h3>
                      </div>
                      <div
                        className="metric-ring grid h-36 w-36 place-items-center rounded-full p-3"
                        style={ringStyle}
                      >
                        <div className="grid h-full w-full place-items-center rounded-full bg-white">
                          <div className="text-center">
                            <p className="text-5xl font-semibold text-emerald-600">
                              {latestResume?.atsAnalysis?.score || 0}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">ATS score</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-[28px] p-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-[18px] bg-violet-100 text-violet-700">
                        <Target size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Readiness</p>
                        <h3 className="text-4xl font-semibold text-slate-900">{metrics.latestReadiness}%</h3>
                      </div>
                    </div>
                    <div className="mt-6 h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-[linear-gradient(90deg,#5741e8,#8c55f6)]"
                        style={{ width: `${metrics.latestReadiness}%` }}
                      />
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      {latestResume
                        ? `You are ${metrics.latestReadiness}% ready for ${roleLabels[latestResume.targetRole]}.`
                        : "Upload a resume to see readiness."}
                    </p>
                  </div>

                  <div className="glass-panel rounded-[28px] p-6">
                    <p className="text-sm text-slate-500">Overview</p>
                    <div className="mt-5 space-y-5">
                      <div>
                        <p className="text-4xl font-semibold text-slate-900">{metrics.totalResumes}</p>
                        <p className="mt-1 text-sm text-slate-500">Resumes analyzed</p>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-500">Skill gaps</span>
                        <span className="text-lg font-semibold text-slate-900">{metrics.totalSkillGaps}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-500">Average ATS</span>
                        <span className="text-lg font-semibold text-slate-900">{metrics.averageAtsScore}</span>
                      </div>
                    </div>
                  </div>
                  </section>
                )}

                {(showAnalyzer || hasAnalysis) && (showDashboard || showAnalyzer || showSkillGap) && (
                  <section className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
                  <div className="space-y-5">
                    {hasAnalysis && (showDashboard || showSkillGap) && (
                      <div className="glass-panel rounded-[28px] p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Latest analysis</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Weak sections and ATS issues</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSection("analyzer")}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                        >
                          Analyze again
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {currentWeakNotes?.map(({ section, notes }) => {
                          const status = getSectionStatus(section);

                          return (
                            <div key={section} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                              <div className="flex items-center justify-between gap-3">
                                <h4 className="text-xl font-semibold text-slate-900">{section}</h4>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(status)}`}>
                                  {status}
                                </span>
                              </div>
                              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                {notes.map((note) => (
                                  <li key={note} className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-violet-500" />
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <h4 className="text-lg font-semibold text-slate-900">ATS issues detected</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                          {latestResume?.atsAnalysis?.atsIssues?.map((issue) => (
                            <li key={issue} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      </div>
                    )}

                    {hasAnalysis && (showDashboard || showSkillGap) && (
                      <div className="glass-panel rounded-[28px] p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Skill gap</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Core missing skills</h3>
                        </div>
                        <div className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                          {metrics.latestReadiness}% ready
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-slate-600">
                        {latestResume
                          ? `You are ${metrics.latestReadiness}% ready for ${roleLabels[latestResume.targetRole]}. Focus next on the missing skills below.`
                          : "Analyze a resume to unlock this section."}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {latestResume?.jobMatchAnalysis?.missingSkills?.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    {(showAnalyzer || showDashboard) && (
                      <form onSubmit={handleAnalyze} className="glass-panel rounded-[28px] p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">New analysis</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Upload resume details</h3>
                        </div>
                        <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-cyan-100 text-cyan-700">
                          <Upload size={20} />
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm text-slate-500">Resume file</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm text-slate-500">Target role</span>
                          <select
                            value={formData.targetRole}
                            onChange={(event) =>
                              setFormData((current) => ({
                                ...current,
                                targetRole: event.target.value,
                              }))
                            }
                            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                          >
                            <option value="sde">SDE</option>
                            <option value="data analyst">Data Analyst</option>
                            <option value="ml engineer">ML Engineer</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm text-slate-500">Paste resume content</span>
                          <textarea
                            rows="10"
                            placeholder="Paste your resume text, sections, projects, tools, and experience bullets here..."
                            value={formData.resumeText}
                            onChange={(event) =>
                              setFormData((current) => ({
                                ...current,
                                resumeText: event.target.value,
                              }))
                            }
                            className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400"
                          />
                        </label>
                      </div>

                      {formData.fileName && (
                        <div className="mt-4 rounded-[18px] border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                          Selected file: <span className="font-semibold">{formData.fileName}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isAnalyzing || (!formData.resumeText.trim() && !formData.fileName)}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(90deg,#5b45eb,#17c2b6)] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isAnalyzing ? "Generating mock analysis..." : "Run analysis"}
                      </button>

                      <p className="mt-4 text-xs leading-6 text-slate-500">
                        This demo uses stored mock scoring logic after upload. No external AI service is called.
                      </p>
                      </form>
                    )}

                    {hasAnalysis && (showDashboard || showAnalyzer) && (
                      <div className="glass-panel rounded-[28px] p-6">
                      <p className="text-sm text-slate-500">Suggested roles</p>
                      <div className="mt-4 space-y-3">
                        {latestResume?.suggestedRoles?.map((role, index) => (
                          <div
                            key={role}
                            className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-slate-800">{role}</span>
                            <span className="text-sm text-slate-500">{92 - index * 11}% fit</span>
                          </div>
                        ))}
                      </div>
                      </div>
                    )}

                    {hasAnalysis && (showDashboard || showAnalyzer) && (
                      <div className="glass-panel rounded-[28px] p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Recent uploads</p>
                          <h3 className="mt-2 text-xl font-semibold text-slate-900">Saved resume runs</h3>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3">
                        {recentResumes.map((resume) => (
                          <button
                            key={resume._id}
                            type="button"
                            onClick={() => selectResume(resume)}
                            className="flex w-full items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:bg-white"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-900">{resume.fileName}</p>
                              <p className="mt-1 text-xs text-slate-500">{roleLabels[resume.targetRole]}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-emerald-600">{resume.atsAnalysis.score} ATS</p>
                              <p className="mt-1 text-xs text-slate-500">{resume.jobMatchAnalysis.readinessScore}% ready</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      </div>
                    )}
                  </div>
                  </section>
                )}

                {hasAnalysis && (showDashboard || showRoadmap) && (
                  <section className="mt-8 glass-panel rounded-[28px] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">30-day roadmap</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">Practical next steps</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("roadmap")}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      Focus roadmap
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-4">
                    {latestResume?.roadmap?.steps?.map((step) => (
                      <div key={step.week} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-700">Week {step.week}</p>
                        <h4 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                          {step.tasks.map((task) => (
                            <li key={task} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 rounded-[18px] bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                          {step.outcome}
                        </p>
                      </div>
                    ))}
                  </div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
