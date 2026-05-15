"use client";

import {
  UploadDropzone,
} from "@uploadthing/react";

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
  return (
    <div className="space-y-4">
      {value && (
        <div className="rounded-xl border p-4 text-sm">
          Model uploaded
        </div>
      )}

      <UploadDropzone
        endpoint="modelUploader"
        appearance={{
          container:
            "border-dashed border-muted-foreground/25",

          label:
            "text-sm text-muted-foreground",
        }}
        onClientUploadComplete={(
          res
        ) => {
          if (!res?.[0]) {
            return;
          }

          onChange(
            res[0].ufsUrl
          );
        }}
        onUploadError={(
          error: Error
        ) => {
          console.log(error);
        }}
      />
    </div>
  );
}