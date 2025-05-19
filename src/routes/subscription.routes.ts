import express from 'express';
import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription
} from '../controllers/subscription.controller';

const router = express.Router();

// GET all subscriptions
router.get('/', getSubscriptions);

// GET single subscription by ID
router.get('/:id', getSubscriptionById);

// CREATE new subscription
router.post('/', createSubscription);

// UPDATE existing subscription
router.put('/:id', updateSubscription);

// DELETE subscription by ID
router.delete('/:id', deleteSubscription);

export default router;