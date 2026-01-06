import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
