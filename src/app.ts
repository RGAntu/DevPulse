import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse",
    author: "Redoy Ghosh Antu",
  });
});

export default app;
