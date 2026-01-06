import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const couriers = defineTable({
  name: v.string(),
  userId: v.id('users'),
  phone: v.string(),
  address: v.string(),
  cin: v.id('storage'),
  status: v.union(
    v.literal('pending'),
    v.literal('accepted'),
    v.literal('rejected'),
  ),
  vehicleType: v.string(),
  vehicleNumber: v.string(),
  vehicleImage: v.id('storage'),
  rating: v.optional(v.number()),
  totalDeliveries: v.number(),
  currentLocation: v.optional(
    v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  ),
  avatar: v.id('storage'),
})
  .index('by_status', ['status'])
  .index('by_rating', ['rating'])
  .searchIndex('search_name', {
    searchField: 'name',
  });

export const category = defineTable({
  name: v.string(),
  image: v.id('storage'),
})
  .index('by_name', ['name'])
  .searchIndex('search_name', {
    searchField: 'name',
  });

export const delivery = defineTable({
  category: v.id('category'),
  status: v.union(
    v.literal('pending'),
    v.literal('accepted'),
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
