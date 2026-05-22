"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState(value);

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

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handlePickFile = async (
    file: File | undefined
  ) => {
    if (!file) return;

    await startUpload([file]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="border-dashed bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="space-y-1 border-b">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
          Product Image
        </CardTitle>
        <CardDescription>
          Upload a clean, high-resolution image. PNG, JPG, and WEBP are supported.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div
          className={cn(
            "grid gap-4 rounded-xl border border-dashed bg-background/80 p-4 transition hover:border-primary/50 hover:bg-muted/30 md:grid-cols-[180px_1fr]",
            preview ? "items-start" : "items-center"
          )}
        >
          <div className="relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
            {preview ? (
              <Image
                src={preview}
                alt="Uploaded preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <span>No image uploaded yet</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Choose image file</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop is not required here. Select a file and UploadThing will handle the rest.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : preview ? "Replace image" : "Upload image"}
              </Button>

              {preview ? (
                <Button type="button" variant="ghost" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">
              Recommended: square or wide image with a clean background for better previews.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={async (e) => {
            await handlePickFile(e.target.files?.[0]);
          }}
        />
      </CardContent>
    </Card>
  );
}