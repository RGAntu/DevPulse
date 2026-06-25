import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../../utils/sendResponse";
import {
  createIssue,
  getAllIssues,
  getIssueById,
 
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

// Get All Issues
export const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query as {
      sort?: string;
      type?: string;
      status?: string;
    };

    const data = await getAllIssues(sort, type, status);
    sendSuccess(res, StatusCodes.OK, "Issues retrived successfully", data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};


// Get Single Issue 
export const getIssueByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params["id"] ?? "0"));
    const data = await getIssueById(id);

    if (!data) {
      sendError(res, StatusCodes.NOT_FOUND, "Issue not found");
      return;
    }

    sendSuccess(res, StatusCodes.OK, "Issue retrived successfully", data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch issue";
    sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
};