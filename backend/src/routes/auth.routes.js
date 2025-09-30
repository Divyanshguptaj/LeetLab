import express from 'express'
const authRoutes = express.Router();
import { register, login, logout, check } from '../controllers/auth.controller.js';
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.delete("/logout", logout);
authRoutes.get("/check", check);

export default authRoutes