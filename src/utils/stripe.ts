import Stripe from "stripe";
import { updateOrCreateSubscriptionByCustomerId, updateSubscriptionByCustomerId } from "../services/subscription.service";
import { supabase } from "./supabaseHelper";
import { Clerk } from '@clerk/clerk-sdk-node';
import { subscription } from "./constants";

const clerkClient = Clerk({
    secretKey: process.env.CLERK_SECRET_KEY || '',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-04-30.basil'
});




export const updateUserMetaDataInClerk = async (is_subscribed: boolean, orgId: string) => {
    // Step 1: Fetch all users in the org from Supabase
    const { data: users, error } = await supabase
        .from("users") // Or your table name for users
        .select("user_id")
        .eq("org_id", orgId);

    if (error || !users) {
        console.error("Failed to fetch users for org:", error);
        return;
    }

    // Step 2: Update Clerk metadata for each user
    for (const user of users) {
        if (!user.user_id) continue;

        try {
            const clerkUser = await clerkClient.users.getUser(user.user_id);
            const existingMetadata = clerkUser.unsafeMetadata || {};

            await clerkClient.users.updateUser(user.user_id, {
                unsafeMetadata: {
                    ...existingMetadata,
                    is_subscribed,
                },
            });

            console.log(`Updated Clerk metadata for user: ${user.user_id}`);
        } catch (err) {
            console.error(`Failed to update user ${user.user_id}:`, err);
        }
    }
}

export const handlePaymentSuccess = async (paymentIntent: any) => {
    const updated = await updateSubscriptionByCustomerId(paymentIntent.customer, { is_subscribed: true })
    await updateUserMetaDataInClerk(true, updated.org_id)
    console.log('Payment succeeded:', paymentIntent);
};
export const handleSubscriptionCreated = async (subscription: any) => {
    const product = await stripe.products.retrieve(subscription?.plan.product)
    const plan_type = `${product.name}_${subscription?.plan.interval}`.toLowerCase()

    let is_subscribed = subscription.status === 'active' ? true : false
    const updated = await updateOrCreateSubscriptionByCustomerId(subscription.customer, { subscription_id: subscription.id, is_subscribed, plan_type })
    await updateUserMetaDataInClerk(is_subscribed, updated.org_id)
};
export const handleSubscriptionDeleted = async (subscription: any) => {
    const updated = await updateSubscriptionByCustomerId(subscription.customer, { subscription_id: null, is_subscribed: false, plan_type: null, })
    await updateUserMetaDataInClerk(false, updated.org_id)


};
export const handleSubscriptionUpdate = async (subscription: any) => {
    console.log('Subscription updated:', subscription);
    const product = await stripe.products.retrieve(subscription?.plan.product);
    const plan_type = `${product.name}_${subscription?.plan.interval}`.toLowerCase()
    let is_subscribed = false;
    if (subscription.status === 'active') {
        is_subscribed = true
    }
    const updated = await updateSubscriptionByCustomerId(subscription.customer, { subscription_id: subscription.id, is_subscribed, plan_type, })
    await updateUserMetaDataInClerk(is_subscribed, updated.org_id)

};
export const handlePaymentFailure = async (invoice: Stripe.Invoice) => {
    console.log('Payment failed for invoice:', invoice.id);
};
export const handleSetupFailure = async (setupIntent: Stripe.SetupIntent) => {
    console.log('Setup failed:', setupIntent.id);
    if (setupIntent.customer) {
        const subscriptions = await stripe.subscriptions.list({
            customer: setupIntent.customer as string,
            status: 'trialing'
        });
        for (const sub of subscriptions.data) {
            await stripe.subscriptions.cancel(sub.id);
        }
    }
};
export const handleCustomerCreated = async (customer: Stripe.Customer) => {
    console.log('Customer created:', customer.id);
};
export const handleCustomerDeleted = async (customer: Stripe.Customer) => {
    console.log('Customer deleted:', customer.id);
};
