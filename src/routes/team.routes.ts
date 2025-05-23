import { Router } from "express";
import { create, deleteOne, fetchTeamsCategoryByOrgId, getTeamById, getTeamByOrgId, updateOne, updateTeamById } from "../controllers/team.controller";

const router = Router();
// Create a user
router.post('/organizations/categories/:orgId', fetchTeamsCategoryByOrgId);
router.get('/organizations/:orgId', getTeamByOrgId);

router.get('/:teamId', getTeamById);
router.put('/update/:teamId', updateOne);
router.delete('/:teamId', deleteOne);


router.post('/', create);



router.put('/:teamId', updateTeamById);


export default router;
