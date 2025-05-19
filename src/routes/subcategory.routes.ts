import express from 'express';

import { create, fetchSubcategoriesByTeam, updateOne, deleteOne } from '../controllers/subcategores.controller';

const router = express.Router();

// GET all subscriptions
router.get('/teams/:teamId', fetchSubcategoriesByTeam);
router.post('/', create);

router.put('/:id', updateOne);
router.delete('/:id', deleteOne);


export default router;