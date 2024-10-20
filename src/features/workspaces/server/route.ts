import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspacesSchema } from "@/features/workspaces/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID, Query } from "node-appwrite";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPARCES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databeses = c.get("databases");
    const user = c.get("user");

    const members = await databeses.listDocuments(DATABASE_ID!, MEMBERS_ID!, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databeses.listDocuments(
      DATABASE_ID!,
      WORKSPARCES_ID!,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const databeses = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, imageUrl } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID!,
          ID.unique(),
          imageUrl,
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID!,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      }

      const workspace = await databeses.createDocument(
        DATABASE_ID!,
        WORKSPARCES_ID!,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        },
      );

      await databeses.createDocument(DATABASE_ID!, MEMBERS_ID!, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    },
  );

export default app;
