import { Request, Response } from 'express';
import { createOne, deleteById, fetchSubCategories, updateById } from '../services/subcategories.service';
export async function fetchSubcategoriesByTeam(req: Request, res: Response): Promise<void> {
    try {
        const { teamId } = req.params;
        const subcategories: any = await fetchSubCategories(teamId);
        res.status(201).json({ success: true, subcategories });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function create(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body
        const subcategories: any = await createOne(data);
        res.status(201).json({ success: true, subcategories });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function updateOne(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body
        const {id} = req.params
        const team: any = await updateById(id,data);
        res.status(201).json({ success: true, team });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export async function deleteOne(req: Request, res: Response): Promise<void> {
    try {
        const {id} = req.params
        const team: any = await deleteById(id);
        res.status(201).json({ success: true, team });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}