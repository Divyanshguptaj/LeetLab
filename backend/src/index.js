import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './libs/db.js';
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import playlistRoutes from './routes/playlist.routes.js';
import executeRoutes from './routes/execute.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://leetlab-ten.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


// app.use(cors());  

app.get("/", (req, res) => {
  res.send("Hello, welcome to LeetLab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/execute", executeRoutes);
app.use("/api/v1/submission", submissionRoutes);

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await db.$connect();  // ✅ connect to DB
    console.log("✅ Connected to database");

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  }
}

startServer();
