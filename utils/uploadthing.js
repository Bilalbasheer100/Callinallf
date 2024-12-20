import { createUploadthing } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Example fake authentication function (replace with actual logic)
const auth = async (req) => {
  return { id: "fakeId" }; // Replace with proper authentication
};

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB" }, // Allow only images up to 4MB
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded by:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),
};
