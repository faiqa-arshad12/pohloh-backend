import express from "express";

import {
  create,
  deleteOne,
  fetchByOrg,
  findOne,
  update,
} from "../controllers/knowledge-card.controller";

const router = express.Router();

// GET all subscriptions
router.post("/", create);
router.put("/:cardId", update);
router.get("/organizations/:orgId", fetchByOrg);
router.delete("/:cardId", deleteOne);
router.get("/:cardId", findOne);
// router.get('/teams/:teamUD', findByTeam);

export default router;
