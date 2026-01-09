import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const orders = defineTable({
  // Order details
  orderNumber: v.string(),
  status: v.union(
    v.literal('pending'),
    v.literal('in-transit'),
    v.literal('delivered'),
    v.literal('cancelled'),
  ),

  // User relationship
  userId: v.id('users'),
  // Courier relationship (optional until assigned)
  courierId: v.optional(v.id('users')),

  // Delivery details
  item: v.string(),
  pickupAddress: v.string(),
  deliveryAddress: v.string(),

  // Pickup location coordinates
  pickupLocation: v.optional(
    v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  ),

  // Delivery location coordinates
  deliveryLocation: v.optional(
    v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  ),

  // Pricing
  totalAmount: v.number(),
  deliveryFee: v.number(),
  distance: v.optional(v.number()), // in km

  // Rating
  rating: v.optional(v.number()), // User's rating for the courier (0-5)

  // Timestamps are automatic via _creationTime
  // Optional delivery timestamp
  deliveredAt: v.optional(v.number()),
  acceptedAt: v.optional(v.number()),
})
  .index('by_userId', ['userId'])
  .index('by_courierId', ['courierId'])
  .index('by_status', ['status'])
  .searchIndex('search_orderNumber', {
    searchField: 'orderNumber',
  });
