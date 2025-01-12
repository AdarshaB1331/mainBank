import express, { Express } from "express";

import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import activityRoutes from "./routes/activityLog.route";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();
declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
  }
}
const app: Express = express();
const PORT: number = 5000;
type CorsConfig = {
  origin: string;
  credentials: boolean;
};
type requestLimit = {
  limit: string;
};

type UrlEncodedOptions = requestLimit & {
  extended: boolean;
};

const corsOptions: CorsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};
const urlencodedOptions: UrlEncodedOptions = { limit: "10mb", extended: true };

const jsonLimit: requestLimit = { limit: "10mb" };
app.use(cors(corsOptions));
app.use(express.json(jsonLimit));
app.use(express.urlencoded(urlencodedOptions));
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/activityLog", activityRoutes);

const connectDB = async (): Promise<void> => {
  try {
    if (process.env.MONGO_URI === undefined) {
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error(`An unknown error occurred`);
    }
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
