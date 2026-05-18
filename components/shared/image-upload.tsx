"use client";

import Image from "next/image";

import { useState } from "react";

import {
  useUploadThing,
} from "@/utils/uploadthing";

interface Props {
  value?: string;

  onChange: (
    url: string
  ) => void;
}

export function ImageUpload({
  value,
  onChange,
}: Props) {
  const [preview, setPreview] =
    useState(value);

  const { startUpload, isUploading } =
    useUploadThing(
      "imageUploader",
      {
        onClientUploadComplete:
          (res) => {
            console.log(res);

            if (!res?.[0]) return;

            const uploadedUrl =
              res[0].url;

            setPreview(
              uploadedUrl
            );

            onChange(
              uploadedUrl
            );
          },

        onUploadError: (
          error
        ) => {
          console.log(error);

          alert(error.message);
        },
      }
    );

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative h-40 w-40 overflow-hidden rounded-xl border">
          <Image
            src={preview}
            alt="Upload"
            fill
            className="object-cover"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={async (e) => {
          const file =
            e.target.files?.[0];

          if (!file) return;

          await startUpload([
            file,
          ]);
        }}
      />
    </div>
  );
}