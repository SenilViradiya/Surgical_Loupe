"use client";

import Image from "next/image";

import {
  UploadDropzone,
} from "@uploadthing/react";

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
  return (
    <div className="space-y-4">
      {value && (
        <div className="relative h-40 w-40 overflow-hidden rounded-xl border">
          <Image
            src={value}
            alt="Upload"

            fill

            className="object-cover"
          />
        </div>
      )}

      <UploadDropzone
        endpoint="imageUploader"
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