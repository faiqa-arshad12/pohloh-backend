import express from 'express';
import { handleCreateOrganization, handleGetOrganizations, handleGetOrganizationsbyID, handleUpdateOrganization } from '../controllers/organization.controller';


const router = express.Router();

// Route to create a new organization
router.post('/', handleCreateOrganization);

// Route to get all organizations
router.get('/', handleGetOrganizations);

router.get('/:id', handleGetOrganizationsbyID);

//update the organization
router.put('/:id', handleUpdateOrganization);

export default router;
