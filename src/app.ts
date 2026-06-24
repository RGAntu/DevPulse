import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse API",
    author: "Redoy Ghosh Antu",
  });
});

// Routes
app.use("/api/auth", authRouter);


export default app;