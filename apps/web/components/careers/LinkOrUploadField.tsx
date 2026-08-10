"use client";

import { useState } from "react";
import {
  uploadDocumentToCloudinary,
  validateDocumentFile,
  validateVideoFile,
  UploadValidationError,
} from "../../lib/upload/uploadToCloudinary";

interface LinkOrUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: "document" | "video";
  required?: boolean;
  linkPlaceholder: string;
}

export function LinkOrUploadField({
  label,
  value,
  onChange,
  kind,
  required,
  linkPlaceholder,
}: LinkOrUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = kind === "document" ? "application/pdf,image/jpeg,image/png" : "video/mp4,video/quicktime,video/webm";

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      if (kind === "document") validateDocumentFile(file);
      else validateVideoFile(file);
    } catch (err) {
      setError(err instanceof UploadValidationError ? err.message : "Invalid file");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const url = await uploadDocumentToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-deep-blue">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          required={required}
          placeholder={linkPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-soft-blue px-4 py-2 font-normal"
        />
        <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-deep-blue px-4 py-2 text-sm font-medium text-deep-blue">
          {uploading ? "Uploading..." : "Upload file"}
          <input type="file" accept={accept} onChange={onFileSelected} disabled={uploading} className="hidden" />
        </label>
      </div>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="text-xs text-sage-green underline">
          View current file
        </a>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
