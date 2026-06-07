"use client";

import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";

import { Box, FileUp, Loader2, Trash2, UploadCloud } from "lucide-react";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CanvasLoader } from "@/components/3d/canvas-loader";
import { Model } from "@/components/3d/model";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploaded, setUploaded] = useState(Boolean(getSafeModelUrl(value)));
  const [fileName, setFileName] = useState(value ? getFileName(value) : "");

  const safeModelUrl = getSafeModelUrl(value);

  const { startUpload, isUploading } =
    useUploadThing(
      "modelUploader",
      {
        onClientUploadComplete: (res) => {


          if (!res?.[0]) return;

          const uploadedUrl = getSafeModelUrl(res[0].url) ?? res[0].url;

          setUploaded(true);
          setFileName(getFileName(res[0].name ?? res[0].url));
          onChange(uploadedUrl);
        },

        onUploadError: (error) => {


          alert(error.message);
        },
      }
    );

  useEffect(() => {
    const nextSafeUrl = getSafeModelUrl(value);

    setUploaded(Boolean(nextSafeUrl));
    setFileName(value ? getFileName(value) : "");
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
    setUploaded(false);
    setFileName("");
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="border-dashed bg-linear-to-br from-background to-muted/20">
      <CardHeader className="space-y-1 border-b">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Box className="h-4 w-4 text-muted-foreground" />
          3D Model (GLB)
        </CardTitle>
        <CardDescription>
          Upload a .glb file for the interactive 3D preview.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div
          className={cn(
            "grid gap-4 rounded-xl border border-dashed bg-background/80 p-4 transition hover:border-primary/50 hover:bg-muted/30 md:grid-cols-[180px_1fr]",
            uploaded ? "items-start" : "items-center"
          )}
        >
          <div className="relative min-h-55 overflow-hidden rounded-lg border bg-muted/40">
            {safeModelUrl ? (
              <Canvas
                shadows
                camera={{ position: [0, 0.8, 3.5] }}
                className="absolute inset-0"
              >
                <ambientLight intensity={1.6} />
                <directionalLight position={[2, 4, 3]} intensity={2} castShadow />
                <Suspense fallback={<CanvasLoader />}>
                  <Model url={safeModelUrl} scale={1.5} position={[0, -0.7, 0]} />
                  <Environment preset="city" />
                </Suspense>
                <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
              </Canvas>
            ) : (
              <div className="flex h-full min-h-55 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                  <FileUp className="h-5 w-5" />
                </div>
                <p className="font-medium text-foreground">No model uploaded</p>
                <p className="text-xs text-muted-foreground">Select a .glb file to preview it here.</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Choose GLB file</p>
              <p className="text-sm text-muted-foreground">
                Upload a single binary model file. Keep it optimized for fast loading.
              </p>
            </div>

            {fileName ? (
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                Current file: <span className="font-medium text-foreground">{fileName}</span>
              </div>
            ) : null}

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
                {isUploading ? "Uploading..." : uploaded ? "Replace model" : "Upload GLB"}
              </Button>

              {uploaded ? (
                <Button type="button" variant="ghost" onClick={handleClear}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">
              Best results: keep the model compressed and under the recommended size for smooth interaction.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".glb"
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

function getFileName(value: string) {
  try {
    const cleanValue = value.split("?")[0];
    return cleanValue.split("/").pop() ?? "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

function getSafeModelUrl(url?: string) {
  if (!url) return undefined;

  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}
