import express from "express";
import * as defenderController from "../controllers/defenderController";
import { defenderMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/attacks").get(defenderMiddleware, defenderController.getAll);
router.route("/defend").post(defenderMiddleware, defenderController.defend);

export default router;
