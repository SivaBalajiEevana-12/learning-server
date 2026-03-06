import { Router, Request, Response } from "express";
import upload from "../middlewares/multer";
import cloudinary from "../config/cloudinary";

const router = Router();

router.post(
  "/upload-video",
  upload.single("video"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "video",
        folder: "videos",
      });
      console.log(result.secure_url);
      return res.json({
        message: "Video uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;