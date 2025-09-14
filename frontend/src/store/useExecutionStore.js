import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  isSubmitting: false,
  submission: null,
  detailedResults: null,

  // Reset execution results when switching problems
  resetExecutionResults: () => {
    set({ detailedResults: null, submission: null });
  },

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isExecuting: true, detailedResults: null }); // Reset before execution
      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });
      set({ detailedResults: res.data.detailedResults });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },

  submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({ isSubmitting: true, detailedResults: null }); // Reset before submission
      const res = await axiosInstance.post("/execute-code/submit-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      },{
        withCredentials: true,
      });
      set({ submission: res.data.submission });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error submitting code", error);
      toast.error("Error submitting code");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));    