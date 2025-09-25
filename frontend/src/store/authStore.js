import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axios.js';

const useAuthStore = create((set) => ({
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  authUser: null,

  signUp: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", data);
  
      const { user, token, message } = res.data;
  
      // ✅ Save token to localStorage
      // localStorage.setItem("token", token);
  
      // ✅ Save user in Zustand state
      set({ authUser: user });
  
      toast.success(message || "Signed up successfully!");
    } catch (error) {
      console.log("Error while signing up:", error);
      toast.error(error.response?.data?.message || "Error while signing up");
    } finally {
      set({ isSigningUp: false });
    }
  },  

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);

      const { user, token } = res.data;
      console.log(user, token);
      console.log(document.cookie);
      
      // localStorage.setItem("token", token); // ✅ save token
      set({ authUser: user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error Logging User", error);
      toast.error("Error Logging User");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.delete("/auth/logout"); 
      set({ authUser: null });
      // localStorage.removeItem("token"); // ✅ remove token
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
  
  check: async () => {
    try {
      // console.log(localStorage.getItem(token));
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get("/auth/check");
      console.log("here i am inside check");
      console.log(res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      // localStorage.removeItem("token"); // invalid/expired
      console.log("User not logged in — expected.");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

}))

export default useAuthStore;
