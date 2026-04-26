import { createHash } from "node:crypto";

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getCloudinaryUploadUrl() {
  const { cloudName } = getCloudinaryEnv();
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}

export function buildCloudinarySignature(params: Record<string, string | number>) {
  const { apiSecret } = getCloudinaryEnv();

  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

export function getCloudinaryUploadAuth() {
  const { apiKey } = getCloudinaryEnv();
  return { apiKey };
}
