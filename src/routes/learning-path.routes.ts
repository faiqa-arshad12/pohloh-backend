import express from "express";
import {
  create,
  createUserLearningPath,
  deleteById,
  fetchbyLearningPath,
  fetchByOrg,
  fetchEnrolledLearningPaths,
  findOne,
} from "../controllers/learning-path.controller";

const router = express.Router();

// GET all subscriptions
router.post("/", create);
router.get("/organizations/:orgId", fetchByOrg);
router.post("/users", createUserLearningPath);

router.get("/users/:pathId", fetchbyLearningPath);
router.get("/enrolled-paths/:userId", fetchEnrolledLearningPaths);
router.get("/:pathId", findOne);
router.delete("/:pathId", deleteById);


export default router;
