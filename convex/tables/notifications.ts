import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const notifications = defineTable({
  userId: v.id('users'),
  type: v.union(
    v.literal('order_created'),
    v.literal('order_assigned'),
    v.literal('order_completed'),
    v.literal('order_cancelled'),
    v.literal('payment_received'),
    v.literal('courier_accepted'),
    v.literal('courier_rejected'),
    v.literal('profile_verified'),
    v.literal('profile_rejected'),
    v.literal('general'),
    v.literal('deposit_request'),
  ),
  title: v.string(),
  message: v.string(),
  read: v.boolean(),
  actionUrl: v.optional(v.string()),
  metadata: v.optional(
    v.object({
      orderId: v.optional(v.id('orders')),
      courierId: v.optional(v.id('users')),
      amount: v.optional(v.number()),
      transactionId: v.optional(v.id('transactions')),
    }),
  ),
})
  .index('by_userId', ['userId'])
  .index('by_read', ['read'])
  .index('by_type', ['type']);
