import { Request, Response } from 'express';
import { createOrganization, getOrganizationById, getOrganizations, updateOrganizations } from '../services/organization.service';
export async function handleCreateOrganization(req: Request, res: Response): Promise<void> {
  try {
    const organization: any = await createOrganization(req.body);
    res.status(201).json({ success: true, organization });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetOrganizations(req: Request, res: Response): Promise<void> {
  try {
    const organizations = await getOrganizations();
    res.status(200).json({ success: true, organizations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetOrganizationsbyID(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id
    const organizations = await getOrganizationById(id);
    res.status(200).json({ success: true, organizations });
  } catch (error: any) { // Type error explicitly
    res.status(500).json({ success: false, message: error.message });
  }
}

// Example route handler for updates
export async function handleUpdateOrganization(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || !updates) {
      res.status(400).json({ success: false, message: 'Invalid update request' });
      return;
    }

    const updatedOrganization = await updateOrganizations(id, updates);
    res.status(200).json({ success: true, data: updatedOrganization });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
}