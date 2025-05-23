import {Request, Response} from "express";
import {
  createLearningByUser,
  createLearningPath,
  deleteOne,
  fetchLearningPathById,
  fetchLearningPathByOrg,
  fetchUserEnrolledLearningPaths,
  fetchUserLearningPath,
} from "../services/learning-path.service";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const path: any = await createLearningPath(data);
    res.status(201).json({success: true, path});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function findOne(req: Request, res: Response): Promise<void> {
  try {
    const {pathId} = req.params;
    const path: any = await fetchLearningPathById(pathId);
    res.status(201).json({success: true, path});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}

export async function fetchByOrg(req: Request, res: Response): Promise<void> {
  try {
    // const status = req.body.status;
    const {orgId} = req.params;
    const cards: any = await fetchLearningPathByOrg(orgId);
    res.status(201).json({success: true, cards});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function fetchbyLearningPath(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // const status = req.body.status;
    const {pathId} = req.params;
    const paths: any = await fetchUserLearningPath(pathId);
    res.status(201).json({success: true, paths});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function fetchEnrolledLearningPaths(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // const status = req.body.status;
    const {userId} = req.params;
    const paths: any = await fetchUserEnrolledLearningPaths(userId);
    res.status(201).json({success: true, paths});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
// export async function deleteOne(req: Request, res: Response): Promise<void> {
//   try {
//     // const status = req.body.status;
//     const {cardId} = req.params;
//     const cards: any = await deleteByCardId(cardId);
//     res.status(201).json({success: true, cards});
//   } catch (error: any) {
//     res.status(500).json({success: false, message: error.message});
//   }
// }
// export async function findOne(req: Request, res: Response): Promise<void> {
//   try {
//     // const status = req.body.status;
//     const {cardId} = req.params;
//     const card: any = await findByCardId(cardId);
//     res.status(201).json({success: true, card});
//   } catch (error: any) {
//     res.status(500).json({success: false, message: error.message});
//   }
// }
// export async function fetchUsersCard(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   try {
//     // const status = req.body.status;
//     const {cardId} = req.params;
//     const card: any = await fetchUsersByKnowledgeCard(cardId);
//     res.status(201).json({success: true, card});
//   } catch (error: any) {
//     res.status(500).json({success: false, message: error.message});
//   }
// }
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

export async function createUserLearningPath(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const data = req.body;
    const path: any = await createLearningByUser(data);
    res.status(201).json({success: true, path});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
export async function deleteById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {pathId} = req.params;
    console.log(pathId,'i')
    const path: any = await deleteOne(pathId);
    res.status(201).json({success: true, path});
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
}
