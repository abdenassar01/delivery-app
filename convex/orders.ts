import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

async function createNotification(
  ctx: any,
  userId: any,
  type: any,
  title: string,
  message: string,
  metadata?: any,
) {
  await ctx.db.insert('notifications', {
    userId,
    type,
    title,
    message,
    read: false,
    metadata,
  });
}

// Generate a unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Create a new order
export const createOrder = mutation({
  args: {
    userId: v.id('users'),
    item: v.string(),
    pickupAddress: v.string(),
    deliveryAddress: v.string(),
    pickupLocation: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
    deliveryLocation: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
    totalAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    // Use provided price or calculate default pricing
    const totalAmount = args.totalAmount ?? 5.0; // Default to $5 if not provided
    const deliveryFee = totalAmount;

    const orderId = await ctx.db.insert('orders', {
      orderNumber: generateOrderNumber(),
      status: 'pending',
      userId: args.userId,
      item: args.item,
      pickupAddress: args.pickupAddress,
      deliveryAddress: args.deliveryAddress,
      pickupLocation: args.pickupLocation,
      deliveryLocation: args.deliveryLocation,
      totalAmount,
      deliveryFee,
    });

    const couriers = await ctx.db
      .query('users')
      .withIndex('by_role', q => q.eq('role', 'delivery'))
      .collect();

    for (const courier of couriers) {
      if (courier.isEnabled) {
        await createNotification(
          ctx,
          courier._id,
          'order_created',
          'New Delivery Order Available',
          `A new order for ${args.item} is available for delivery.`,
          { orderId },
        );
      }
    }

    // Notify user that order was created
    await createNotification(
      ctx,
      args.userId,
      'order_created',
      'Order Created Successfully',
      `Your order for ${args.item} has been created and is waiting for a courier.`,
      { orderId },
    );

    return orderId;
  },
});

// Accept an order (for couriers)
export const acceptOrder = mutation({
  args: {
    orderId: v.id('orders'),
    courierId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (user.role !== 'delivery') {
      throw new Error('Only couriers can accept orders');
    }

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error('Order is no longer available');
    }

    await ctx.db.patch(args.orderId, {
      status: 'in-transit',
      courierId: args.courierId,
      acceptedAt: Date.now(),
    });

    await createNotification(
      ctx,
      order.userId,
      'courier_accepted',
      'Courier Assigned',
      `A courier has accepted your order for ${order.item}.`,
      { orderId: order._id, courierId: args.courierId },
    );

    const allNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_type', q => q.eq('type', 'order_created'))
      .collect();

    for (const notification of allNotifications) {
      if (
        notification.metadata?.orderId === args.orderId &&
        notification.userId !== args.courierId
      ) {
        await ctx.db.delete(notification._id);
      }
    }

    return { success: true };
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.union(
      v.literal('pending'),
      v.literal('in-transit'),
      v.literal('delivered'),
      v.literal('cancelled'),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const updateData: any = { status: args.status };

    if (args.status === 'delivered') {
      updateData.deliveredAt = Date.now();
    }

    await ctx.db.patch(args.orderId, updateData);

    return { success: true };
  },
});

// Get order by ID
export const getOrderById = query({
  args: {
    orderId: v.id('orders'),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);

    if (!order) {
      return null;
    }

    return order;
  },
});

// Get recent orders (for admin)
export const getRecentOrders = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query('orders').order('desc').take(args.limit);

    return orders;
  },
});

// Get available orders (for couriers)
export const getAvailableOrders = query({
  args: {},
  handler: async ctx => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_status', q => q.eq('status', 'pending'))
      .order('desc')
      .take(50);

    return orders;
  },
});

// Get user's orders
export const getUserOrders = query({
  args: {
    userId: v.optional(v.id('users')),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }

    const userId = args.userId; // Type narrowing
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_userId', q => q.eq('userId', userId))
      .order('desc')
      .take(args.limit);

    return orders;
  },
});

// Get courier's orders
export const getCourierOrders = query({
  args: {
    courierId: v.optional(v.id('users')),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.courierId) {
      return [];
    }

    const orders = await ctx.db
      .query('orders')
      .withIndex('by_courierId', q => q.eq('courierId', args.courierId))
      .order('desc')
      .take(args.limit);

    return orders;
  },
});

// Get all orders (with optional filters)
export const getAllOrders = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in-transit'),
        v.literal('delivered'),
        v.literal('cancelled'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // When status is provided, filter by it
    if (args.status) {
      const status = args.status; // Capture to narrow type
      return await ctx.db
        .query('orders')
        .withIndex('by_status', q => q.eq('status', status))
        .order('desc')
        .take(args.limit || 100);
    }

    // Otherwise, return all orders
    return await ctx.db
      .query('orders')
      .order('desc')
      .take(args.limit || 100);
  },
});

// Search orders by order number
export const searchOrders = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withSearchIndex('search_orderNumber', q =>
        q.search('orderNumber', args.searchTerm),
      )
      .take(20);

    return orders;
  },
});

// Cancel order
export const cancelOrder = mutation({
  args: {
    orderId: v.id('orders'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== user._id && user.role !== 'admin') {
      throw new Error('Not authorized to cancel this order');
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new Error('Cannot cancel this order');
    }

    await ctx.db.patch(args.orderId, {
      status: 'cancelled',
    });

    // Notify courier if order was assigned
    if (order.courierId) {
      await createNotification(
        ctx,
        order.courierId,
        'order_cancelled',
        'Order Cancelled',
        `The order for ${order.item} has been cancelled by the user.`,
        { orderId: order._id },
      );
    }

    // Remove pending notifications for this order
    const allNotifications = await ctx.db.query('notifications').collect();

    for (const notification of allNotifications) {
      if (notification.metadata?.orderId === args.orderId) {
        await ctx.db.delete(notification._id);
      }
    }

    return { success: true };
  },
});

// Mark order as delivered and rate the courier (for users)
export const markDeliveredAndRate = mutation({
  args: {
    orderId: v.id('orders'),
    rating: v.number(), // Rating from 1 to 5
    reviewMessage: v.optional(v.string()), // Optional review message
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const order = await ctx.db.get(args.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Only the order owner can mark as delivered and rate
    if (order.userId !== user._id) {
      throw new Error('Not authorized to rate this order');
    }

    // Order must be in transit
    if (order.status !== 'in-transit') {
      throw new Error('Order must be in transit to be marked as delivered');
    }

    // Update order status and rating
    await ctx.db.patch(args.orderId, {
      status: 'delivered',
      rating: args.rating,
      reviewMessage: args.reviewMessage,
      deliveredAt: Date.now(),
    });

    // Update courier's average rating
    if (order.courierId) {
      const courier = await ctx.db.get(order.courierId);

      if (courier) {
        const currentRating = courier.rating || 0;
        const currentCount = courier.ratingCount || 0;

        // Calculate new average
        const newRatingCount = currentCount + 1;
        const newRating =
          (currentRating * currentCount + args.rating) / newRatingCount;

        await ctx.db.patch(order.courierId, {
          rating: newRating,
          ratingCount: newRatingCount,
        });

        // Build notification message with optional review
        let notificationMessage = `Great job! The delivery for ${order.item} has been completed. You received a ${args.rating}/5 rating.`;
        if (args.reviewMessage && args.reviewMessage.trim()) {
          notificationMessage += `\n\nReview: "${args.reviewMessage}"`;
        }

        // Notify courier about delivery completion and rating
        await createNotification(
          ctx,
          order.courierId,
          'order_completed',
          'Delivery Completed',
          notificationMessage,
          { orderId: order._id, amount: args.rating },
        );
      }
    }

    await createNotification(
      ctx,
      order.userId,
      'order_completed',
      'Delivery Completed',
      `Your order for ${order.item} has been delivered successfully!`,
      { orderId: order._id },
    );

    return { success: true };
  },
});
