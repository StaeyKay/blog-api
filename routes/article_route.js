import { Router } from "express";
import {
  addArticle,
  deleteArticle,
  getArticles,
  updateArticle,
} from "../controllers/article_controller.js";
import { remoteUpload } from "../middlewares/upload.js";
import { checkAuth } from "../middlewares/auth.js";

const articleRouter = Router();

articleRouter.post(
  "/users/articles",
  checkAuth,
  remoteUpload.single("image"),
  addArticle
);

articleRouter.get("/users/articles", getArticles);

articleRouter.patch(
  "/users/articles/:id",
  remoteUpload.single("image"),
  checkAuth,
  updateArticle
);

articleRouter.delete("/users/articles/:id", checkAuth, deleteArticle);

export default articleRouter;
