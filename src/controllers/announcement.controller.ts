import { Request, Response } from 'express';
import { createOne, getAnnouncementsByOrganizations, getAnnouncementsByTeam } from '../services/announcement.service';
export async function create(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body
        const announcement: any = await createOne(data);
        res.status(201).json({ success: true, announcement });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function fetchByTeam(req: Request, res: Response): Promise<void> {
    try {
        const { teamId } = req.params
        const announcement: any = await getAnnouncementsByTeam(teamId);
        res.status(201).json({ success: true, announcement });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function fetchByOrganizations(req: Request, res: Response): Promise<void> {
    try {
        const { orgId } = req.params
        const announcement: any = await getAnnouncementsByOrganizations(orgId);
        res.status(201).json({ success: true, announcement });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}