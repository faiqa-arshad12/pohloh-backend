import { Router } from "express";
import {
  CreateUser,
  GetUsers,
  GetUserById,
  UpdateUser,
  updateUserstatus,
  getUserByOrg,
  getUserOnboardingData,
  getUsersByOrganization,
  getUsersByTeam,
} from "../controllers/users.controller";
import { users } from "../utils/constants";

const router = Router();

// Create a user
router.post('/', CreateUser);

// Get all users
router.get('/', GetUsers);

// Get a user by ID
router.get('/:id', GetUserById);

// Update user details
router.put(`/:id`, UpdateUser);

//update the status
router.put('/status/:id', updateUserstatus)
router.get('/count/:orgId', getUserByOrg)
router.get('/onboarding-data/:userId', getUserOnboardingData)
router.get('/organizations/:orgId', getUsersByOrganization)
router.get('/organizations/teams/:teamId', getUsersByTeam)




export default router;
