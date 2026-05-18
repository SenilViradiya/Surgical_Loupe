import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }, {
    awaitServerData: false,
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete", file.url);

    return {
      url: file.url,
    };
  }),

  modelUploader: f({
    blob: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  }, {
    awaitServerData: false,
  }).onUploadComplete(async ({ file }) => {
    console.log("Model uploaded", file.url);

    return {
      url: file.url,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter =
  typeof ourFileRouter;