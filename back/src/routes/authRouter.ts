import express from "express";

import * as authController from "../controllers/authController";
import {authMiddleware} from "../middleware/authMiddleware";

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/register").post(authController.register);
router.route("/validate").get(authMiddleware, authController.validate);

export default router;
