import { create } from "zustand";

import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isPasswordReset: false,
  resetSuccessfully: false,
  isChangingRole: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check", { withCredentials: true });
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data, {
        withCredentials: true,
      });

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });
      set({ authUser: res.data.user });      
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {
        withCredentials: true,
      });
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
  forgotPassword: async (data) => {
    try {
      set({ isPasswordReset: true });
      const res = await axiosInstance.post("/auth/forgot-password", data,{
        withCredentials: true,
      });
      
      toast.success(res.data.message);
      set({ resetSuccessfully: true });
    } catch (error) {
      console.log("Error forgot password", error);
      toast.error("Error forgot password");
    } finally {
      set({ isPasswordReset: false });
    }
  },
  changeRoleProfile: async (data) => {
    try {
      set({ isChangingRole: true });
      const res = await axiosInstance.post("/auth/change-role",data,{
        withCredentials: true,
      });
      
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error switching roles", error);
      toast.error("Error switching roles");
    } finally {
      set({ isChangingRole: false });
    }
  },
}));