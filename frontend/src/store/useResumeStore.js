import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const useResumeStore = create((set) => ({
  latestResume: null,
  recentResumes: [],
  weakSectionNotes: {},
  metrics: {
    totalResumes: 0,
    averageAtsScore: 0,
    latestReadiness: 0,
    totalSkillGaps: 0,
  },
  isDashboardLoading: false,
  isAnalyzing: false,

  fetchDashboard: async () => {
    set({ isDashboardLoading: true });

    try {
      const res = await axiosInstance.get("/resumes/dashboard");
      set({
        latestResume: res.data.latestResume,
        recentResumes: res.data.recentResumes,
        metrics: res.data.metrics,
        weakSectionNotes: res.data.latestResume?.weakSectionNotes || {},
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load dashboard"));
    } finally {
      set({ isDashboardLoading: false });
    }
  },

  analyzeResume: async (payload) => {
    set({ isAnalyzing: true });

    try {
      const res = await axiosInstance.post("/resumes/analyze", payload);
      const createdResume = res.data.resume;

      set((state) => ({
        latestResume: createdResume,
        weakSectionNotes: res.data.weakSectionNotes || {},
        recentResumes: [createdResume, ...state.recentResumes].slice(0, 5),
        metrics: {
          totalResumes: state.metrics.totalResumes + 1,
          averageAtsScore:
            state.metrics.totalResumes === 0
              ? createdResume.atsAnalysis.score
              : Math.round(
                  (state.metrics.averageAtsScore * state.metrics.totalResumes +
                    createdResume.atsAnalysis.score) /
                    (state.metrics.totalResumes + 1)
                ),
          latestReadiness: createdResume.jobMatchAnalysis.readinessScore,
          totalSkillGaps: createdResume.jobMatchAnalysis.missingSkills.length,
        },
      }));

      toast.success("Mock resume analysis is ready");
      return createdResume;
    } catch (error) {
      toast.error(getErrorMessage(error, "Analysis failed"));
      return null;
    } finally {
      set({ isAnalyzing: false });
    }
  },

  selectResume: (resume) => {
    set({ latestResume: resume, weakSectionNotes: resume?.weakSectionNotes || {} });
  },
}));