import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

// Create a new notification
export const createNotification = mutation({
  args: {
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
    actionUrl: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        orderId: v.optional(v.id('delivery')),
        courierId: v.optional(v.id('couriers')),
        amount: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      read: false,
      actionUrl: args.actionUrl,
      metadata: args.metadata,
    });
    return notificationId;
  },
});

// Get all notifications for the current user
export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      return [];
    }

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .order('desc')
      .take(args.limit ?? 50);

    return notifications;
  },
});

// Get unread notifications count
export const getUnreadCount = query({
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      return 0;
    }

    const unreadCount = await ctx.db
      .query('notifications')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .filter(q => q.eq('read', 'false'))
      .collect();

    return unreadCount;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.notificationId, {
      read: true,
    });

    return { success: true };
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('User not found');
    }

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .filter(q => q.eq('read', 'false'))
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        read: true,
      });
    }

    return { success: true, marked: notifications.length };
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.notificationId);

    return { success: true };
  },
});
