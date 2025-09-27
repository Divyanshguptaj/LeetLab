import {create} from 'zustand'
import {toast} from 'react-hot-toast'
import axiosInstance from '../utils/axios.js'

const useExecuteCode = create((set)=>({
 
    isCodeExecuting : false,
    submission : null,
    

     executeCodeFun : async(source_code,language_id,stdin,expected_outputs,problemId)=>{
        try {
            set({isCodeExecuting:true})
            const res = await axiosInstance.post('/execute',{source_code,language_id,stdin,expected_outputs,problemId});
            set({submission:res.data.submission})
            
            toast.success(res.data.message)
        } catch (error) {
            // console.log("Error while executing code",error);
            toast.error("Error while executing code");
        }finally{
            set({isCodeExecuting:false})
        }
     }

}))


export default useExecuteCode;