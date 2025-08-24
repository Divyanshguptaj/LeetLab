import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("Hello, welcome to LeetLab");
});

// Auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
