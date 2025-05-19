import { Request, Response } from 'express';
import { handleCustomerCreated, handleCustomerDeleted, handlePaymentFailure, handlePaymentSuccess, handleSetupFailure, handleSubscriptionCreated, handleSubscriptionDeleted, handleSubscriptionUpdate } from '../utils/stripe';
export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const event = req.body;
    console.log('Received event type:', event.type);

    try {
        await processStripeEvent(event);
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook handler failed:', error);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
};

const processStripeEvent = async (event: any) => {
    const eventHandlers: Record<string, (data: any) => Promise<void>> = {
        'payment_intent.succeeded': handlePaymentSuccess,
        'customer.subscription.deleted': handleSubscriptionDeleted,
        'customer.subscription.created': handleSubscriptionCreated,

        'customer.subscription.updated': handleSubscriptionUpdate,
        'customer.subscription.canceled': handleSubscriptionUpdate,


        // 'customer.subscription.created': handleSubscriptionCreated,
        'invoice.payment_failed': handlePaymentFailure,
        'invoice.payment_succeeded': handlePaymentSuccess,
        'setup_intent.setup_failed': handleSetupFailure,
        'customer.created': handleCustomerCreated,
        'customer.updated': handleCustomerCreated,
        'customer.deleted': handleCustomerDeleted
    };

    const handler = eventHandlers[event.type];
    if (handler) {
        await handler(event.data.object);
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }
};

