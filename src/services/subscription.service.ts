import { supabase } from "../utils/supabaseHelper";
import { Subscription, SubscriptionDTO } from "../utils/types";
export const getSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*');

  if (error) throw new Error(error.message);
  return data as Subscription[];
};

export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};



export const createOrUpdateSubscription = async (
  subscriptionData: Partial<Subscription>
): Promise<Subscription> => {
  try {
    if (!subscriptionData.org_id) {
      throw new Error('Organization ID (org_id) is required');
    }

    // Check for existing subscription
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      // .eq('org_id', subscriptionData.org_id)
      .eq('customer_id', subscriptionData.customer_id)


      .maybeSingle();

    if (fetchError) {
      throw new Error(`Failed to check existing subscription: ${fetchError.message}`);
    }

    let result: Subscription;

    if (existingSubscription) {
      // Update existing subscription
      const { data: updatedSubscription, error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        // .eq('org_id', subscriptionData.org_id)
        .eq('customer_id', subscriptionData.customer_id)

        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }

      result = updatedSubscription;
    } else {
      // Create new subscription
      const { data: newSubscription, error: insertError } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create subscription: ${insertError.message}`);
      }

      result = newSubscription;
    }

    return result;

  } catch (error) {
    console.error('Subscription operation failed:', error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const updateSubscription = async (
  id: string,
  updates: Partial<SubscriptionDTO>
): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('customer_id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Subscription;
};

export const deleteSubscription = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
};
export const updateSubscriptionByCustomerId = async (customerId: string, sub_data: any): Promise<any> => {

  const { data, error } = await supabase
    .from("subscriptions")
    .update(sub_data)
    .eq("customer_id", customerId)
    .select("*")  // 👈 this fetches the updated row
    .single();
  if (error) {
    console.error('Error updating subscription:', error);
    throw new Error(error.message);
  } else {
    console.log('Subscription updated:', data);
    return data
  }
}
export const updateOrCreateSubscriptionByCustomerId = async (
  customerId: string,
  sub_data: any
): Promise<any> => {
  // First check if subscription exists
  const { data: existing, error: findError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("customer_id", customerId)
    .maybeSingle();

  if (findError) {
    console.error('Error finding subscription:', findError);
    throw new Error(findError.message);
  }

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from("subscriptions")
      .update(sub_data)
      .eq("customer_id", customerId)
      .select("*")
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      throw new Error(error.message);
    }
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({ ...sub_data, customer_id: customerId })
      .select("*")
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw new Error(error.message);
    }
    return data;
  }
};