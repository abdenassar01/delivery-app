import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';
import { authComponent, createAuth } from './auth';

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

export const updateMyPassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.changePassword({
      body: {
        newPassword: args.newPassword,
        currentPassword: args.currentPassword,
      },
      headers,
    });

    return { success: true };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    let avatarUrl = '';

    if (user.avatar) {
      avatarUrl = (await ctx.storage.getUrl(user.avatar)) || '';
    }

    return {
      ...user,
      avatarUrl,
    };
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

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    const updateData: Record<string, any> = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.email !== undefined) updateData.email = args.email;
    if (args.phone !== undefined) updateData.phone = args.phone;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No fields to update');
    }

    await ctx.db.patch(user._id, updateData);

    return { success: true };
  },
});
