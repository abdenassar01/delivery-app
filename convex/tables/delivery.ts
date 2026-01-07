import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const couriers = defineTable({
  name: v.string(),
  userId: v.id('users'),
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
})
  .index('by_status', ['status'])
  .index('by_rating', ['rating'])
  .index('by_userId', ['userId'])
  .searchIndex('search_name', {
    searchField: 'name',
  });

export const category = defineTable({
  name: v.string(),
  image: v.id('_storage'),
})
  .index('by_name', ['name'])
  .searchIndex('search_name', {
    searchField: 'name',
  });

export const delivery = defineTable({
  category: v.id('category'),
  status: v.union(
    v.literal('pending'),
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('cancelled'),
    v.literal('rejected'),
  ),
  currentLocation: v.optional(
    v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  ),
  productName: v.string(),
  productTotalPrice: v.number(),
  deliveryToAddressStr: v.string(),
  deliveryFromAddressStr: v.string(),
  deliveryToAddress: v.object({
    latitude: v.number(),
    longitude: v.number(),
  }),
  deliveryFromAddress: v.object({
    latitude: v.number(),
    longitude: v.number(),
  }),
});
