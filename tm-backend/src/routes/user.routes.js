import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  getDetails,
  getAllUsers,
  logout
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/registerUser").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

//secured routes
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/get-details").get(verifyJWT, getDetails);
router.route("/get-all").get(verifyJWT, getAllUsers);
router.route("/logout").post(verifyJWT, logout);

export default router;
