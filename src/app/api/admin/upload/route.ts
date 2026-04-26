import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  buildCloudinarySignature,
  getCloudinaryUploadAuth,
  getCloudinaryUploadUrl,
  hasCloudinaryConfig,
} from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = ((formData.get("folder") as string) || "ksl-project").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File is too large. Max size is 10MB." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const { apiKey } = getCloudinaryUploadAuth();
    const signature = buildCloudinarySignature({ folder, timestamp });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", dataUri);
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", String(timestamp));
    cloudinaryForm.append("signature", signature);
    cloudinaryForm.append("folder", folder);

    const response = await fetch(getCloudinaryUploadUrl(), {
      method: "POST",
      body: cloudinaryForm,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result?.error?.message || "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
