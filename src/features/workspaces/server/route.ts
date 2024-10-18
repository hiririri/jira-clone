import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspacesSchema } from "@/features/workspaces/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ID } from "node-appwrite";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPARCES_ID } from "@/config";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspacesSchema),
  sessionMiddleware,
  async (c) => {
    const databeses = c.get("databases");
    const user = c.get("user");
    const storage = c.get("storage");

    const { name, imageUrl } = c.req.valid("json");

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
      },
    );

    return c.json({ data: workspace });
  },
);

export default app;
