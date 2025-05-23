import { Request, Response } from 'express';
import { createOne, deleteById, fetchTeamById, fetchTeamsByOrgId, fetchTeamsCategByOrgId, updateById, updateTeam } from '../services/team.service';
export async function getTeamByOrgId(req: Request, res: Response): Promise<void> {
    try {
        const { orgId } = req.params;
        const teams: any = await fetchTeamsByOrgId(orgId);
        res.status(201).json({ success: true, teams });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
} export async function getTeamById(req: Request, res: Response): Promise<void> {
    try {
        const { teamId } = req.params;
        const teams: any = await fetchTeamById(teamId);
        res.status(201).json({ success: true, teams });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function updateTeamById(req: Request, res: Response): Promise<void> {
    try {
        const { teamId } = req.params;
        const paylaod = req.body;
        const teams: any = await updateTeam(teamId, paylaod);
        res.status(201).json({ success: true, teams });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function fetchTeamsCategoryByOrgId(req: Request, res: Response): Promise<void> {
    try {
        const { orgId } = req.params;
        const {role, userId} = req.body
        const teams: any = await fetchTeamsCategByOrgId(orgId,userId, role);
        res.status(201).json({ success: true, teams });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function create(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body
        const team: any = await createOne(data);
        res.status(201).json({ success: true, team });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function updateOne(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body
        const {teamId} = req.params
        const team: any = await updateById(teamId,data);
        res.status(201).json({ success: true, team });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function deleteOne(req: Request, res: Response): Promise<void> {
    try {
        const {teamId} = req.params
        const team: any = await deleteById(teamId);
        res.status(201).json({ success: true, team });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}