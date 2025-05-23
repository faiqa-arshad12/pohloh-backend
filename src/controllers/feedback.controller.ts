import {Request, Response} from "express";
import {createOne} from "../services/feedback.service";
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const feedback: any = await createOne(data);
    res.status(201).json({success: true, feedback});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
