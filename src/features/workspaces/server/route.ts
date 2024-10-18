import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspacesSchema } from "@/features/workspaces/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";
import { DATABASE_ID, WORKSPARCES_ID } from "@/config";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspacesSchema),
  sessionMiddleware,
  async (c) => {
    const databeses = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await databeses.createDocument(
      DATABASE_ID!,
      WORKSPARCES_ID!,
      ID.unique(),
      {
        name,
        userId: user.$id,
      },
    );

    return c.json({ data: workspace });
  },
);

export default app;
