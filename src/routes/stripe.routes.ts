import express from 'express';

import { handleStripeWebhook } from '../controllers/stripe.controller';

const router = express.Router();

// GET all subscriptions
router.post('/webhook', handleStripeWebhook);


export default router;