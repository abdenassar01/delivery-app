import { MutationCtx, QueryCtx } from '../_generated/server';
import { getAuthenticatedUser } from './auth';

export const getAuthenticatedCourier = async (ctx: QueryCtx | MutationCtx) => {
  const user = await getAuthenticatedUser(ctx);

  if (!user) {
    throw new Error('User not found');
  }

  const courier = await ctx.db
    .query('couriers')
    .withIndex('by_userId', q => q.eq('userId', user._id))
    .unique();

  return courier;
};
