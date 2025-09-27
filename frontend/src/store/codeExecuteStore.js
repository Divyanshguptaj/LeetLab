import {create} from 'zustand'
import {toast} from 'react-hot-toast'
import axiosInstance from '../utils/axios.js'

const useExecuteCode = create((set, get) => ({
    isCodeExecuting: false,
    isCodeSubmitting: false,
    submission: null,
    
    executeCodeFun: async (source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({ isCodeExecuting: true, submission: null });
            const res = await axiosInstance.post('/execute', {
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            });
            set({ submission: res.data.submission });
            toast.success(res.data.message || 'Code executed successfully!');
        } catch (error) {
            console.log("Error while executing code", error);
            const errorMessage = error.response?.data?.error || "Error while executing code";
            toast.error(errorMessage);
        } finally {
            set({ isCodeExecuting: false });
        }
    },

    submitCodeFun: async (source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({ isCodeSubmitting: true, submission: null });
            const res = await axiosInstance.post('/execute/submitCode', {
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            });
            set({ submission: res.data.submission });
            
            // Show different messages based on submission status
            const status = res.data.submission?.status;
            if (status === 'Accepted') {
                toast.success('🎉 Code submitted successfully! All test cases passed!');
            } else {
                toast.success('Code submitted successfully! Check results for details.');
            }
        } catch (error) {
            console.log("Error while submitting code", error);
            const errorMessage = error.response?.data?.error || "Error while submitting code";
            toast.error(errorMessage);
        } finally {
            set({ isCodeSubmitting: false });
        }
    },

    // Clear submission results
    clearSubmission: () => {
        set({ submission: null });
    },

    // Reset all states
    resetStore: () => {
        set({
            isCodeExecuting: false,
            isCodeSubmitting: false,
            submission: null
        });
    }
}));

export default useExecuteCode;