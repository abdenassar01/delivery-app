import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const contact = defineTable({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  message: v.string(),
});
