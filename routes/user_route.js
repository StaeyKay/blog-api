import { Router } from "express";
import {
  createUser,
  getLoggedInUser,
  getUsers,
  login,
  profile,
  signup,
  updateUser,
} from "../controllers/user_controller.js";
import { checkAuth, hasPermission } from "../middlewares/auth.js";

const userRouter = Router();

// Define routes
userRouter.post("/users/auth/register", signup);
userRouter.post("/users/auth/login", login);
userRouter.get("/users/auth/loggedInUser", checkAuth, getLoggedInUser);
userRouter.get("/users/auth/profile", checkAuth, profile);
userRouter.get("/users/auth", checkAuth, hasPermission("read_users"), getUsers);
userRouter.post(
  "/users/auth",
  checkAuth,
  hasPermission("create_user"),
  createUser
);
userRouter.patch(
  "/users/auth/:id",
  checkAuth,
  hasPermission("update_user"),
  updateUser
);

export default userRouter;
