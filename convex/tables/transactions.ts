import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const transactions = defineTable({
  userId: v.id('users'),
  type: v.union(
    v.literal('deposit'),
    v.literal('withdrawal'),
    v.literal('payment'),
    v.literal('refund'),
    v.literal('earning'),
  ),
  amount: v.number(),
  status: v.union(
    v.literal('pending'),
    v.literal('approved'),
    v.literal('rejected'),
  ),
  proofUrl: v.optional(v.id('_storage')), // Image/PDF proof of bank transfer
  description: v.string(),
  valid: v.boolean(),
  metadata: v.optional(
    v.object({
      orderId: v.optional(v.id('orders')),
      relatedOrderId: v.optional(v.id('orders')),
    }),
  ),
})
  .index('by_userId', ['userId'])
  .index('by_status', ['status'])
  .index('by_type', ['type']);
