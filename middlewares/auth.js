import jwt from "jsonwebtoken";
import { UserModel } from "../models/user_model.js";
import { roles } from "../config/roles.js";

export const checkAuth = async (req, res, next) => {
  try {
    if (req.session?.user) {
      const user = await UserModel.findById(req.session.user.id);
      if (!user) {
        return res.status(401).json({ message: "User Does Not Exist!" });
      }
      req.user = user;
      next();
    } else if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: "User Does Not Exist!" });
        }
        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({ message: "Invalid Token!" });
      }
    } else {
      return res.status(401).json({ message: "Not Authenticated!" });
    }
  } catch (error) {
    next(error);
  }
};

export const hasPermission = (permission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User not logged in" });
      }

      const userRole = roles.find((role) => role.role === user.role);
      if (userRole && userRole.permissions.includes(permission)) {
        next();
      } else {
        return res.status(403).json({ message: "Not Authorized!" });
      }
    } catch (error) {
      next(error);
    }
  };
};
