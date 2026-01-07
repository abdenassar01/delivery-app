import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

export const updateDeliveryStatus = mutation({
  args: {
    deliveryId: v.id('delivery'),
    status: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('cancelled'),
      v.literal('rejected'),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const delivery = await ctx.db.get(args.deliveryId);

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    await ctx.db.patch(args.deliveryId, {
      status: args.status,
    });

    return { success: true };
  },
});
