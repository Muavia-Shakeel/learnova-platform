export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class UploadValidationError extends Error {}

export function validatePhotoFile(file: File): void {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    throw new UploadValidationError("Please upload a JPG, PNG, or WEBP image.");
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    throw new UploadValidationError("Image must be under 2MB.");
  }
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Image upload is not configured yet.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed. Please try again.");
  }

  const data: { secure_url: string } = await res.json();
  return data.secure_url;
}
