import express from "express";
import {create} from "../controllers/feedback.controller";

const router = express.Router();

router.post("/", create);
export default router;
