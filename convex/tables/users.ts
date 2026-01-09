import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const users = defineTable({
  name: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  role: v.union(v.literal('user'), v.literal('admin'), v.literal('delivery')),
  balance: v.number(),
  avatar: v.optional(v.id('_storage')),
  userId: v.string(),
  isVerified: v.boolean(),
  isEnabled: v.boolean(),
  rating: v.optional(v.number()),
  ratingCount: v.optional(v.number()),
})
  .index('by_userId', ['userId'])
  .index('by_role', ['role'])
  .searchIndex('search_name', {
    searchField: 'name',
  })
  .searchIndex('search_email', {
    searchField: 'email',
  });
