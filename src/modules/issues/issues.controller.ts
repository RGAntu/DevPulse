import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import {
  createIssue,
 
} from "./issues.services";

// Create Issue
export const createIssueController = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body as {
      title: string;
      description: string;
      type: "bug" | "feature_request";
    };

    if (!title || !description || !type) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        "title, description, type are required",
      );
      return;
    }

    const reporter_id = req.user!.id;
    const data = await createIssue(title, description, type, reporter_id);
    sendSuccess(res, StatusCodes.CREATED, "Issue created successfully", data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create issue";
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};

