import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (localPath) => {
  try {
    if (!localPath) {
      console.log("No local file path!");
    }
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    console.log("File uploaded on cloud successfully!", uploadResult.url);
    return uploadResult;
  } catch (error) {
    fs.unlink(localPath); // remove the locally saved file from server if upload got failed and deman user to upload again.
  }
};

export { uploadFile };
