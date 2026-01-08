import { v } from 'convex/values';
import { query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

// Get admin stats
export const getAdminStats = query({
  args: {},
  handler: async ctx => {
    // Get total users
    const allUsers = await ctx.db.query('users').collect();
    const totalUsers = allUsers.length;

    // Get total orders
    const allOrders = await ctx.db.query('orders').collect();
    const totalOrders = allOrders.length;

    // Get active couriers (users with role 'delivery')
    const activeCouriers = allUsers.filter(
      user => user.role === 'delivery',
    ).length;

    // Calculate total revenue
    const completedOrders = allOrders.filter(
      order => order.status === 'delivered',
    );
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    // Get pending orders count
    const pendingOrders = allOrders.filter(
      order => order.status === 'pending',
    ).length;

    // Get in-transit orders count
    const inTransitOrders = allOrders.filter(
      order => order.status === 'in-transit',
    ).length;

    return {
      totalUsers,
      totalOrders,
      activeCouriers,
      totalRevenue: totalRevenue.toFixed(2),
      pendingOrders,
      inTransitOrders,
      completedOrders: completedOrders.length,
    };
  },
});

// Get courier stats
export const getCourierStats = query({
  args: {
    courierId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    if (!args.courierId) {
      return {
        todayEarnings: '0.00',
        todayDeliveries: 0,
        rating: '0.0',
        totalDeliveries: 0,
        totalEarnings: '0.00',
        activeOrders: 0,
      };
    }

    // Get all orders for this courier
    const courierOrders = await ctx.db
      .query('orders')
      .withIndex('by_courierId', q => q.eq('courierId', args.courierId))
      .collect();

    // Get today's start timestamp
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    // Filter today's orders
    const todayOrders = courierOrders.filter(
      order => order._creationTime >= todayStart,
    );

    // Calculate today's earnings (only completed orders)
    const todayCompletedOrders = todayOrders.filter(
      order => order.status === 'delivered',
    );
    const todayEarnings = todayCompletedOrders
      .reduce((sum, order) => sum + order.deliveryFee, 0)
      .toFixed(2);

    // Count today's deliveries
    const todayDeliveries = todayCompletedOrders.length;

    // Calculate rating (simple average based on completed deliveries)
    // This is a placeholder - in a real app, you'd have actual ratings in the order
    const rating = '4.8'; // Placeholder

    // Get total deliveries
    const totalDeliveries = courierOrders.filter(
      order => order.status === 'delivered',
    ).length;

    // Get total earnings
    const totalEarnings = courierOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.deliveryFee, 0)
      .toFixed(2);

    // Get active orders
    const activeOrders = courierOrders.filter(
      order => order.status === 'in-transit',
    ).length;

    return {
      todayEarnings,
      todayDeliveries,
      rating,
      totalDeliveries,
      totalEarnings,
      activeOrders,
    };
  },
});

// Get user stats
export const getUserStats = query({
  args: {
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        inTransitOrders: 0,
        deliveredOrders: 0,
        totalSpent: '0.00',
      };
    }

    const userId = args.userId; // Type narrowing
    // Get all orders for this user
    const userOrders = await ctx.db
      .query('orders')
      .withIndex('by_userId', q => q.eq('userId', userId))
      .collect();

    // Get total orders
    const totalOrders = userOrders.length;

    // Get pending orders
    const pendingOrders = userOrders.filter(
      order => order.status === 'pending',
    ).length;

    // Get in-transit orders
    const inTransitOrders = userOrders.filter(
      order => order.status === 'in-transit',
    ).length;

    // Get delivered orders
    const deliveredOrders = userOrders.filter(
      order => order.status === 'delivered',
    ).length;

    // Calculate total spent
    const totalSpent = userOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0)
      .toFixed(2);

    return {
      totalOrders,
      pendingOrders,
      inTransitOrders,
      deliveredOrders,
      totalSpent,
    };
  },
});

// Get general app stats
export const getAppStats = query({
  args: {},
  handler: async ctx => {
    const allOrders = await ctx.db.query('orders').collect();
    const allUsers = await ctx.db.query('users').collect();

    return {
      totalOrders: allOrders.length,
      totalUsers: allUsers.length,
      pendingOrders: allOrders.filter(o => o.status === 'pending').length,
      inTransitOrders: allOrders.filter(
        o => o.status === 'in-transit',
      ).length,
      completedOrders: allOrders.filter(o => o.status === 'delivered').length,
    };
  },
});
