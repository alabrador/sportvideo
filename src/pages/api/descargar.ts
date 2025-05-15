import type { APIRoute } from "astro";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get("token");
  if (!token) return new Response("Token requerido", { status: 400 });

  try {
    const { videoPath } = jwt.verify(token, import.meta.env.JWT_SECRET) as { videoPath: string };
    const filePath = path.join(import.meta.env.VIDEO_FOLDER_PATH, videoPath);

    if (!fs.existsSync(filePath)) {
      return new Response("Video no encontrado", { status: 404 });
    }

    const stream = fs.createReadStream(filePath);
    return new Response(stream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${path.basename(videoPath)}"`,
      },
    });
  } catch (err) {
    return new Response("Token inválido o expirado", { status: 403 });
  }
};
