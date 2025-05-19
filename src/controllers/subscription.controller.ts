import { Request, Response } from 'express';
import {
  getSubscriptions as getSubscriptionsService,
  getSubscriptionById as getSubscriptionByIdService,
  createOrUpdateSubscription as createSubscriptionService,
  updateSubscription as updateSubscriptionService,
  deleteSubscription as deleteSubscriptionService
} from '../services/subscription.service';
import { updateUserStatus } from '../services/users.service';

export async function getSubscriptions(req: Request, res: Response): Promise<void> {
  try {
    const subscriptions = await getSubscriptionsService();
    res.json(subscriptions);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function getSubscriptionById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id

    const subscription = await getSubscriptionByIdService(id);
    if (!subscription) {
      res.status(500).json({ error: 'Subscription not found' });
      return;
    }

    res.json(subscription);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

export async function createSubscription(req: Request, res: Response): Promise<void> {
  try {
    const newSubscription = await createSubscriptionService(req.body);
    res.status(201).json(newSubscription);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
}

export async function updateSubscription(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id
    const { subscriptionData, user_status } = req.body;
    const updatedSubscription = await updateSubscriptionService(id, subscriptionData);
    if (user_status) {
      await updateUserStatus(id, user_status);
    }
    if (!updatedSubscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.json(updatedSubscription);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
}

export async function deleteSubscription(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id

    const result = await deleteSubscriptionService(id);
    if (!result) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.status(204).send();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}