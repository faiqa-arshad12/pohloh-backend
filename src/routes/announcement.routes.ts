import express from 'express';

import { create, fetchByOrganizations, fetchByTeam } from '../controllers/announcement.controller';

const router = express.Router();

router.post('/', create);
router.get('/teams/:teamId', fetchByTeam);
router.get('/organizations/:orgId', fetchByOrganizations);








export default router;