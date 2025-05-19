
// controllers/users.controller.ts
import { Request, Response } from 'express';
import { createUser, getUsers, getUserById, updateUser, updateUserStatus, getUserOnboarding, getUsersByOrgId, fetchUsersByTeam } from '../services/users.service';
import { getUserCountByOrgId } from '../services/users.service';

// Create user
export async function CreateUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get all users
export async function GetUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await getUsers();
    res.status(200).json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get user by ID
export async function GetUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const user = await getUserById(id);  // User or null
    if (!user) {
      // Sending response when user is not found
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    // Sending response with the found user
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    // Sending error response if something goes wrong
    res.status(500).json({ success: false, message: error.message });
  }
}

// Update user details
export async function UpdateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await updateUser(id, userData);
    res.status(200).json({ success: true, updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function updateUserstatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedUser = await updateUserStatus(id, status);
    res.status(200).json({ success: true, updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getUserByOrg(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  try {
    const data = await getUserCountByOrgId(orgId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getUserOnboardingData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  try {
    const data = await getUserOnboarding(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getUsersByOrganization(req: Request, res: Response): Promise<void> {
  const { orgId } = req.params;
  try {
    const data = await getUsersByOrgId(orgId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function getUsersByTeam(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;
  const orgId = req?.query?.orgId as string;
  try {
    console.log(teamId, 'o' ,orgId)
    const data = await fetchUsersByTeam(orgId, teamId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}