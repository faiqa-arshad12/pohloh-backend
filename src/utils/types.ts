
export interface Subscription {
  id: number;
  created_at?: Date;
  subscription_id: string;
  customer_id: string;
  plan_type: string;
  is_subscribed?: boolean,
  org_id: string;
}
export type SubscriptionDTO = Omit<Subscription, 'id' | 'created_at'>;