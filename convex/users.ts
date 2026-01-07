import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  handler: async ctx => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Update user avatar with storage ID
export const updateUserAvatar = mutation({
  args: {
    storageId: v.id('_storage'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const user = users.find(u => u.email === args.email);

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      avatar: args.storageId,
    });

    return { success: true, storageId: args.storageId };
  },
});

export const updateUserRole = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('delivery')),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const user = users.find(u => u.email === args.email);

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      role: args.role,
    });

    return { success: true };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const users = await ctx.db.query('users').collect();
    const user = users.find(u => u.email === identity.email);

    return user;
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const user = users.find(u => u.email === args.email);

    return user || null;
  },
});
