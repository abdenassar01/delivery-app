import { type MutationCtx, type QueryCtx } from '../_generated/server';
import { authComponent } from '../auth';

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
  try {
    const authUser = await authComponent.getAuthUser(ctx);

    if (!authUser?._id) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', q => q.eq('userId', authUser._id))
      .unique();

    return user;
  } catch (error) {
    console.log('[Debug | auth:getAuthenticatedUser()]: ', error);
    return null;
  }
};

export const requireAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const user = await getAuthenticatedUser(ctx);

  // Check if user has ADMIN role in Better Auth
  // The role might be in additionalFields or as a direct property
  if (user?.role !== 'admin') {
    throw new Error('Not authorized');
  }

  return user;
};
