import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  isProblemsLoading: null,
  isProblemLoading: null,
  solvedProblems: null,
  totalSolvedProblems: null,
  isDeletingProblem: null,
  isUpdatingProblem: null,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
           const res = await axiosInstance.get("/problems/get-all-problems", {
             withCredentials: true,
           });

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },
  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get(`/problems/get-problem/${id}`, {
        withCredentials: true,
      });     
      set({ problem: res.data.problem });
   
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },
  getSolvedProblemByUser: async () => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get("/problems/get-solved-problems", {
        withCredentials: true,
      });
      set({
        solvedProblems: res.data.problems,
      });
      set({
        totalSolvedProblems: res.data.problems.length,
      });
    } catch (error) {
      console.log("error getting all solved problems", error);
      toast.error("Error in getting solved problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },
  addCompanyTag: async (problemsids, companyTags) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.post(
        "/problems/add-to-company-tags",
        {
          problemsids,
          companyTags,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
    } catch (error) {
      console.log("error adding company tag", error);
      toast.error("Error in adding company tag");
    } finally {
      set({ isProblemLoading: false });
    }
  },
  deleteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
     const res = await axiosInstance.delete(`/problems/delete-problem/${id}`, {
       withCredentials: true,
     });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error("Error deleting problem");
      
    }
    finally{
      set({ isDeletingProblem: false });
    }
  },
  updateProblem: async (id, data) => {
    try {
      set({ isUpdatingProblem: true });
     const res = await axiosInstance.put(
       `/problems/update-problem/${id}`,
       data,
       {
         withCredentials: true,
       }
     );
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error updating problem", error);
      toast.error("Error updating problem");
      
    }
    finally{
      set({ isUpdatingProblem: false });
    }
  }
}));