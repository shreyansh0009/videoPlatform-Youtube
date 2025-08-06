import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (localPath) => {
  try {
    if (!localPath) return null;
    
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath);
    return uploadResult;
  } catch (error) {
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return null;
    // remove the locally saved file from server if upload got failed and deman user to upload again.
  }
};

export { uploadFile };
