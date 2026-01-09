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
  // Courier rating fields
  rating: v.optional(v.number()), // Average rating (0-5)
  ratingCount: v.optional(v.number()), // Number of ratings received
})
  .index('by_userId', ['userId'])
  .searchIndex('search_name', {
    searchField: 'name',
  })
  .searchIndex('search_email', {
    searchField: 'email',
  });
