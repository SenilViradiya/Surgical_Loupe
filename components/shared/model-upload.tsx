"use client";

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

export function ModelUpload({
  value,
  onChange,
}: Props) {
  const [uploaded, setUploaded] =
    useState(!!value);

  const { startUpload, isUploading } =
    useUploadThing(
      "modelUploader",
      {
        onClientUploadComplete:
          (res) => {
            console.log(res);

            if (!res?.[0]) return;

            setUploaded(true);

            onChange(
              res[0].url
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
      {uploaded && (
        <div className="rounded-xl border p-4 text-sm">
          Model uploaded
        </div>
      )}

      <input
        type="file"
        accept=".glb"
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