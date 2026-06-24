import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import { loginUser, registerUser } from "./auth.service";



// Signup Controller 
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: "contributor" | "maintainer";
    };

    // Basic validation
    if (!name || !email || !password) {
      sendError(res, StatusCodes.BAD_REQUEST, "All fields are required");
      return;
    }

    const data = await registerUser(name, email, password, role ?? "contributor");

    sendSuccess(res, StatusCodes.CREATED, "User registered successfully", data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    sendError(res, StatusCodes.BAD_REQUEST, message);
  }
};

// Login Controller 
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      sendError(res, StatusCodes.BAD_REQUEST, "Email and password are required");
      return;
    }

    const data = await loginUser(email, password);

    sendSuccess(res, StatusCodes.OK, "Login successful", data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    sendError(res, StatusCodes.UNAUTHORIZED, message);
  }
};