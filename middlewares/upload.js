import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

export const remoteUpload = multer({
  storage: multerSaveFilesOrg({
    apiAccessToken: process.env.SAVEFILESORG_API_KEY,
    relativePath: "/merandablog/*",
  }),
  fileFilter(req, file, callback) {
    if (
      file &&
      !["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)
    ) {
      callback(new Error("image must be an image file"), false);
    } else {
      callback(null, true);
    }
  },
});
