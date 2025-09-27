import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissionsforaUser,getallSubmissionForProblembyUser,getTheSubmissionsCountForProblem} from "../controllers/submission.controller.js";
import express from "express";

const submissionRoutes= express.Router();

submissionRoutes.get("/getAllSubmissions",authMiddleware,getAllSubmissionsforaUser); // replaced getAllSubmissions
submissionRoutes.get("/getSubmission/:problemId",authMiddleware,getallSubmissionForProblembyUser) //replaced getSubmissionsForProblem 
submissionRoutes.get("/getSubmissionCount/:problemId",authMiddleware, getTheSubmissionsCountForProblem) //replaced with getAllTheSubmissionsForProblem 

export default submissionRoutes;