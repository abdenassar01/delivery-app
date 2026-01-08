import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const notifications = defineTable({
  userId: v.id('users'),
  type: v.union(
    v.literal('order_assigned'),
    v.literal('order_completed'),
    v.literal('order_cancelled'),
    v.literal('payment_received'),
    v.literal('courier_accepted'),
    v.literal('courier_rejected'),
    v.literal('profile_verified'),
    v.literal('profile_rejected'),
    v.literal('general'),
  ),
  title: v.string(),
  message: v.string(),
  read: v.boolean(),
  actionUrl: v.optional(v.string()),
  metadata: v.optional(
    v.object({
      orderId: v.optional(v.id('delivery')),
      courierId: v.optional(v.id('couriers')),
      amount: v.optional(v.number()),
    }),
  ),
})
  .index('by_userId', ['userId'])
  .index('by_read', ['read'])
  .index('by_type', ['type']);
