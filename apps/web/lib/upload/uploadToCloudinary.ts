export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export class UploadValidationError extends Error {}

export function validatePhotoFile(file: File): void {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    throw new UploadValidationError("Please upload a JPG, PNG, or WEBP image.");
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new UploadValidationError("Image must be under 2MB.");
  }
}

export function validateDocumentFile(file: File): void {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    throw new UploadValidationError("Please upload a PDF, JPG, or PNG.");
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    throw new UploadValidationError("File must be under 10MB.");
  }
}

export function validateVideoFile(file: File): void {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    throw new UploadValidationError("Please upload an MP4, MOV, or WEBM video.");
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new UploadValidationError("Video must be under 50MB.");
  }
}

async function uploadWithResourceType(file: File, resourceType: "image" | "auto"): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("File upload is not configured yet.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  const data: { secure_url: string } = await res.json();
  return data.secure_url;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  return uploadWithResourceType(file, "image");
}

/** Handles PDFs, images, and video alike — Cloudinary detects the actual resource type. */
export async function uploadDocumentToCloudinary(file: File): Promise<string> {
  return uploadWithResourceType(file, "auto");
}
