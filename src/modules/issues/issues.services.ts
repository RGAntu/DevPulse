import { pool } from "../../db/db";

// Create Issue
export const createIssue = async (
  title: string,
  description: string,
  type: "bug" | "feature_request",
  reporter_id: number,
) => {
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

// Get All Issues
export const getAllIssues = async (
  sort: string = "newest",
  type?: string,
  status?: string,
) => {
  const conditions: string[] = [];
  const values: string[] = [];
  let index = 1;

  if (type) {
    conditions.push(`i.type = $${index}`);
    values.push(type);
    index++;
  }

  if (status) {
    conditions.push(`i.status = $${index}`);
    values.push(status);
    index++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderClause =
    sort === "oldest"
      ? "ORDER BY i.created_at ASC"
      : "ORDER BY i.created_at DESC";

  const issuesResult = await pool.query(
    `SELECT * FROM issues i ${whereClause} ${orderClause}`,
    values,
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const reporters = reportersResult.rows;

  return issues.map((issue) => {
    const { reporter_id, ...rest } = issue;
    const reporter = reporters.find((r) => r.id === reporter_id);
    return { ...rest, reporter };
  });
};

// Get Single Issue
export const getIssueById = async (id: number) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);

  const issue = issueResult.rows[0];
  if (!issue) return null;

  const reporterResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [issue.reporter_id],
  );

  const { reporter_id, ...rest } = issue;
  return { ...rest, reporter: reporterResult.rows[0] };
};

//  Update Issue
export const updateIssue = async (
  id: number,
  fields: {
    title?: string | undefined;
    description?: string | undefined;
    type?: string | undefined;
  },
) => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (fields.title) {
    updates.push(`title = $${index}`);
    values.push(fields.title);
    index++;
  }

  if (fields.description) {
    updates.push(`description = $${index}`);
    values.push(fields.description);
    index++;
  }

  if (fields.type) {
    updates.push(`type = $${index}`);
    values.push(fields.type);
    index++;
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE issues SET ${updates.join(", ")}
     WHERE id = $${index}
     RETURNING *`,
    values,
  );

  return result.rows[0];
};

// Delete Issue
export const deleteIssue = async (id: number) => {
  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};
