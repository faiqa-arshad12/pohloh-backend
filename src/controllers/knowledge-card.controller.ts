import {Request, Response} from "express";
import {
  createKnowledgeCard,
  deleteByCardId,
  fetchCardsbyOrg,
  findByCardId,
  updateCardById,
} from "../services/knowledge-card.service";
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const subcategories: any = await createKnowledgeCard(data);
    res.status(201).json({success: true, subcategories});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const {cardId} = req.params;
    const subcategories: any = await updateCardById(cardId, data);
    res.status(201).json({success: true, subcategories});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function fetchByOrg(req: Request, res: Response): Promise<void> {
  try {
    // const status = req.body.status;
    const {orgId} = req.params;
    const cards: any = await fetchCardsbyOrg(orgId);
    res.status(201).json({success: true, cards});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function deleteOne(req: Request, res: Response): Promise<void> {
  try {
    // const status = req.body.status;
    const {cardId} = req.params;
    const cards: any = await deleteByCardId(cardId);
    res.status(201).json({success: true, cards});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function findOne(req: Request, res: Response): Promise<void> {
  try {
    // const status = req.body.status;
    const {cardId} = req.params;
    const card: any = await findByCardId(cardId);
    res.status(201).json({success: true, card});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
// export async function findByTeam(req: Request, res: Response): Promise<void> {
//     try {
//       // const status = req.body.status;
//       const {teamId} = req.params;
//       const card: any = await findByTeamId(teamId);
//       res.status(201).json({success: true, card});
//     } catch (error: any) {
//       res.status(500).json({success: false, message: error.message});
//     }
//   }
