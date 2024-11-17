import express from "express";
import * as organizationController from "../controllers/organizationController";
const router = express.Router();

router.route("/all").get(organizationController.getAllNames);
router.route("/:id").get(organizationController.getById);

export default router;
