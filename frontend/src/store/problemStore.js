import { create } from "zustand";
import axiosInstance from "../utils/axios.js";
import toast from "react-hot-toast";


const useProblemStore = create((set)=>({

    problems : [],
    problem :null,
    isProblemsLoading:false,
    isProblemLoading : false,
    solvedProblems: [],

    getAllProblems : async ()=>{
        try {
            set({isProblemsLoading:true})
            const res = await axiosInstance.get('/problems/get-all-problems')
            set({problems:res.data.problems})
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error getting all Problems",error);
            toast.error("Error getting all Problems");
            
        }finally{
     set({isProblemsLoading:false})
        }
    },

    getProblemById : async (id)=>{
        try {
            set({isProblemLoading:true})
            const res = await axiosInstance.get(`/problems/get-problem/${id}`)
            set({problem:res.data.problem})
            toast.success(res.data.message)
        } catch (error) {
            console.log("Error loading problemById",error);
            toast.error("Error loading problemById");
            
        }finally{
      set({isProblemLoading:false})
        }
    },

    getSolvedProblemByUser: async () => {

    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      set({ solvedProblems: res.data.problems });
    } catch (error) { 
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },

}))

export default useProblemStore