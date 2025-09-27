import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axiosInstance from '../utils/axios.js'

const useSubmissionStore = create((set) => ({

  isLoading: null,
  submissions: [],
  submission: [],
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true })
      const res = await axiosInstance.get('/submission/getAllSubmissions')
      set({ submissions: res.data.submissions })
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submission of user", error);
      toast.error("Error getting all submission of user");

    } finally {
      set({ isLoading: false })
    }
  },

  getSubmissionForProblem: async (id) => {
    try {
      const res = await axiosInstance.get(`/submission/getSubmission/${id}`);
      set({ submission: res.data.submissions })
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting submissions for a problem", error);
      toast.error("Error getting submissions for a problem");
    }
  },


  getSubmissionCountForProblem: async (id) => {
    try {
      const res = await axiosInstance.get(`/submission/getSubmissionCount/${id}`)
      set({ submissionCount: res.data.count })
      toast.success(res.data.message)
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  }
}))


export default useSubmissionStore;