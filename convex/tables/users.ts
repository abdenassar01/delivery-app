import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const users = defineTable({
  name: v.string(),
  email: v.string(),
  role: v.union(v.literal('user'), v.literal('admin'), v.literal('delivery')),
  balance: v.number(),
  avatar: v.optional(v.id('storage')),
  isVerified: v.boolean(),
  isEnabled: v.boolean(),
});
