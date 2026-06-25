import { Router } from "express";

import {
  createIssueController,
  getAllIssuesController,
  getIssueByIdController,
  updateIssueController,
  deleteIssueController,
} from "./issues.controller.js";
import { authenticate, authorizeRole } from "../../middleware/auth.middleware";

const issuesRouter = Router();

// Public routes
issuesRouter.get("/", getAllIssuesController);
issuesRouter.get("/:id", getIssueByIdController);

// Authenticated routes
issuesRouter.post("/", authenticate, createIssueController);
issuesRouter.patch("/:id", authenticate, updateIssueController);

// Maintainer only
issuesRouter.delete(
  "/:id",
  authenticate,
  authorizeRole("maintainer"),
  deleteIssueController,
);

export default issuesRouter;
