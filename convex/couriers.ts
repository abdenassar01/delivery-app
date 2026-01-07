import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';
import { getAuthenticatedCourier } from './helpers/couriers';

export const updateCourierStatus = mutation({
  args: {
    courierId: v.id('couriers'),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('rejected'),
    ),
  },
  handler: async (ctx, args) => {
    const courier = await ctx.db.get(args.courierId);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.patch(args.courierId, {
      status: args.status,
    });

    return { success: true };
  },
});

export const getCurrentAuthenticatedCourier = query({
  handler: async ctx => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('User not found');
    }

    const courier = await ctx.db
      .query('couriers')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .unique();

    return courier;
  },
});

export const createCourier = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    cinCode: v.optional(v.string()),
    cin: v.optional(v.id('_storage')),
    avatar: v.optional(v.id('_storage')),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('rejected'),
    ),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    vehicleImages: v.optional(v.array(v.id('_storage'))),
    rating: v.optional(v.number()),
    totalDeliveries: v.number(),
    currentLocation: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      role: 'delivery',
    });

    const courier = await ctx.db.insert('couriers', {
      name: args.name,
      phone: args.phone,
      userId: user._id,
      address: args.address,
      cinCode: args.cinCode,
      cin: args.cin,
      avatar: args.avatar,
      status: args.status,
      vehicleType: args.vehicleType,
      vehicleNumber: args.vehicleNumber,
      vehicleImages: args.vehicleImages,
      rating: args.rating,
      totalDeliveries: args.totalDeliveries,
      currentLocation: args.currentLocation,
    });

    return courier;
  },
});

export const updateCourier = mutation({
  args: {
    courierId: v.id('couriers'),
    name: v.string(),
    phone: v.string(),
    address: v.optional(v.string()),
    cin: v.optional(v.id('_storage')),
    avatar: v.optional(v.id('_storage')),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('rejected'),
    ),
    vehicleType: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    vehicleImages: v.optional(v.array(v.id('_storage'))),
    rating: v.optional(v.number()),
    totalDeliveries: v.number(),
    currentLocation: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const courier = await ctx.db.get(args.courierId);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.patch(args.courierId, {
      name: args.name,
      phone: args.phone,
      address: args.address,
      cin: args.cin,
      avatar: args.avatar,
      status: args.status,
      vehicleType: args.vehicleType,
      vehicleNumber: args.vehicleNumber,
      vehicleImages: args.vehicleImages,
      rating: args.rating,
      totalDeliveries: args.totalDeliveries,
      currentLocation: args.currentLocation,
    });

    return { success: true };
  },
});

export const deleteCourier = mutation({
  args: {
    courierId: v.id('couriers'),
  },
  handler: async (ctx, args) => {
    const courier = await ctx.db.get(args.courierId);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.delete(args.courierId);

    return { success: true };
  },
});

export const updateAvatar = mutation({
  args: {
    avatar: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const courier = await getAuthenticatedCourier(ctx);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.patch(courier._id, {
      avatar: args.avatar,
    });

    await ctx.db.patch(courier.userId, {
      avatar: args.avatar,
    });

    return { success: true };
  },
});

export const updateMyLocation = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const courier = await getAuthenticatedCourier(ctx);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.patch(courier._id, {
      currentLocation: {
        latitude: args.latitude,
        longitude: args.longitude,
      },
    });

    return { success: true };
  },
});

export const uploadCin = mutation({
  args: {
    cin: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const courier = await getAuthenticatedCourier(ctx);

    if (!courier) {
      throw new Error('Courier not found');
    }

    await ctx.db.patch(courier._id, {
      cin: args.cin,
    });

    return { success: true };
  },
});
