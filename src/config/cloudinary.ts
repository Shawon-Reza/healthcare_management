

import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploader = cloudinary;


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUploader,
    params: async (req, file) => {

        const extension = file.originalname.split(".").at(-1)?.toLowerCase(); // Get the file extension

        const originalname = file.originalname.split(".").slice(0, -1).join("."); // Extract the original name without extension

        const standardizedFileName = originalname
            .replace(/\s+/g, "_")
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .toLowerCase();

        const public_id = `${standardizedFileName}_${Math.random().toString(36).slice(2, 5)}_${Date.now()}`; // Create a unique public_id using the standardized name and timestamp

        const folderName = extension === "pdf" ? "pdfs" : extension === "docx" ? "docs" : "images"; // Determine folder based on file type

        console.log("body :", req.body)
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        console.log("body :", req.body)


        console.log("From cloudinary.ts - File Upload Details:", {
            // req.body,
            file,
            extension,
            originalname,
            standardizedFileName,
            public_id,
            folderName,

        })
        console.log(
            env.CLOUDINARY_CLOUD_NAME,
            env.CLOUDINARY_API_KEY,
            env.CLOUDINARY_API_SECRET,
        )

        return {
            folder: folderName,
            public_id,
            resource_type: "auto",

        }
    }
});

export const multerUploader = multer({ storage: storage });



