import express from "express";
import * as attackerController from "../controllers/attackerController";
import { attackerMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/attacks").get(attackerMiddleware, attackerController.getAll);
router.route("/attack").post(attackerMiddleware, attackerController.attack);

export default router;
