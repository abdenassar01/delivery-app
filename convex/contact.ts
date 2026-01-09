import { query } from './_generated/server';
import { requireAdmin } from './helpers/auth';

export const getContacts = query(async ctx => {
  requireAdmin(ctx);

  const contacts = await ctx.db.query('contact').collect();
  return contacts;
});
