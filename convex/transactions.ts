import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthenticatedUser } from './helpers/auth';

export const requestDeposit = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    proofUrl: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (args.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const transactionId = await ctx.db.insert('transactions', {
      userId: user._id,
      type: 'deposit',
      amount: args.amount,
      status: 'pending',
      proofUrl: args.proofUrl,
      description: args.description,
    });

    return transactionId;
  },
});

// Get user's transactions
export const getUserTransactions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      return [];
    }

    const transactions = await ctx.db
      .query('transactions')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .order('desc')
      .take(args.limit ?? 50);

    // Fetch proof URLs for transactions
    const transactionsWithUrls = await Promise.all(
      transactions.map(async transaction => {
        let proofUrl = '';
        if (transaction.proofUrl) {
          proofUrl = (await ctx.storage.getUrl(transaction.proofUrl)) || '';
        }
        return { ...transaction, proofUrl };
      }),
    );

    return transactionsWithUrls;
  },
});

// Get pending transactions (for admin)
export const getPendingTransactions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (user.role !== 'admin') {
      throw new Error('Only admins can view pending transactions');
    }

    const transactions = await ctx.db
      .query('transactions')
      .withIndex('by_status', q => q.eq('status', 'pending'))
      .order('desc')
      .take(args.limit ?? 100);

    // Fetch user details and proof URLs
    const transactionsWithDetails = await Promise.all(
      transactions.map(async transaction => {
        const user = await ctx.db.get(transaction.userId);
        let proofUrl = '';
        if (transaction.proofUrl) {
          proofUrl = (await ctx.storage.getUrl(transaction.proofUrl)) || '';
        }
        return {
          ...transaction,
          proofUrl,
          userName: user?.name || '',
          userEmail: user?.email || '',
        };
      }),
    );

    return transactionsWithDetails;
  },
});

// Approve deposit (admin)
export const approveDeposit = mutation({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (user.role !== 'admin') {
      throw new Error('Only admins can approve deposits');
    }

    const transaction = await ctx.db.get(args.transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction is not pending');
    }

    if (transaction.type !== 'deposit') {
      throw new Error('Can only approve deposits');
    }

    // Update transaction status
    await ctx.db.patch(args.transactionId, {
      status: 'approved',
    });

    // Update user balance
    await ctx.db.patch(transaction.userId, {
      balance: (user?.balance || 0) + transaction.amount,
    });

    // Create notification for user
    await ctx.db.insert('notifications', {
      userId: transaction.userId,
      type: 'payment_received',
      title: 'Deposit Approved',
      message: `Your deposit of ${transaction.amount} DH has been approved and added to your wallet.`,
      read: false,
      metadata: {
        amount: transaction.amount,
      },
    });

    return { success: true };
  },
});

// Reject deposit (admin)
export const rejectDeposit = mutation({
  args: {
    transactionId: v.id('transactions'),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) {
      throw new Error('Unauthenticated');
    }

    if (user.role !== 'admin') {
      throw new Error('Only admins can reject deposits');
    }

    const transaction = await ctx.db.get(args.transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction is not pending');
    }

    if (transaction.type !== 'deposit') {
      throw new Error('Can only reject deposits');
    }

    // Update transaction status
    await ctx.db.patch(args.transactionId, {
      status: 'rejected',
    });

    // Create notification for user
    await ctx.db.insert('notifications', {
      userId: transaction.userId,
      type: 'general',
      title: 'Deposit Rejected',
      message: `Your deposit of ${transaction.amount} DH has been rejected. Please contact support for more information.`,
      read: false,
    });

    return { success: true };
  },
});
