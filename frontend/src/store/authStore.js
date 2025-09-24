import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axios.js';

const useAuthStore = create((set) => ({
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth : false,
  authUser: null,

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post('/auth/register', data);
      
      // Assuming backend sends { user, message } in res.data
      set({ authUser: res.data.user });
      toast.success(res.data.message || 'Signed up successfully!');
      
    } catch (error) {
      console.log("Error while signing up:", error);
      toast.error(error.response?.data?.message || "Error while signing up");
    } finally {
      set({ isSigningUp: false });
    }
  },



login : async (data)=>{
    try {
        set({isLoggingIn:true})
        const res =  await axiosInstance.post("/auth/login",data);
        set({authUser:res.data.user})
        toast.success(res.data.message);
    } catch (error) {
        console.log("Error Logging User",error);
        toast.error("Error Logging User");
    }finally{
    set({isLoggingIn:false})
    }
},

logout : async ()=>{
    try {
        const res = await axiosInstance.delete('/auth/logout');
        set({authUser:null})
        toast.success(res.data.message)
    } catch (error) {
        console.log("Error logging out",error);
        toast.error("Error logging out");
        
    }
},

check : async ()=>{
    try {
        set({isCheckingAuth:true})
        const res =  await axiosInstance.get("/auth/check");
        set({authUser:res.data.user})
        // toast.success(res.data.message);
    } catch (error) {
      if(error.response && error.response.status === 401){
            // Not logged in — not a real error
            set({ authUser: null });
            console.log("User not logged in — expected.");
        } else {
            console.log("Unexpected Error Checking auth:", error);
            // toast.error("Unexpected Error Checking auth");
        }
    }finally{
    set({isCheckingAuth:false})
    }
},





}))



export default useAuthStore;
