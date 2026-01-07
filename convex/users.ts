import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

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
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

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
    id: v.id('users'),
    role: v.union(v.literal('user'), v.literal('admin'), v.literal('delivery')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    await ctx.db.patch(args.id, {
      role: args.role,
    });

    return { success: true };
  },
});

export const getAllUsers = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    return users;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    return getAuthenticatedUser(ctx);
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
