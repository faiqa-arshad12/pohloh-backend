import express from "express";

import {
  create,
  deleteOne,
  fetchByOrg,
  fetchUsersCard,
  findOne,
  update,
} from "../controllers/knowledge-card.controller";

const router = express.Router();

// GET all subscriptions
router.post("/", create);
router.put("/:cardId", update);
router.post("/organizations/:orgId", fetchByOrg);
router.delete("/:cardId", deleteOne);
router.get("/:cardId", findOne);
router.get("/users/:cardId", fetchUsersCard);
// router.get('/teams/:teamUD', findByTeam);

export default router;
