import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc, Id } from 'convex/_generated/dataModel';

interface UserHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function UserHomeScreen({ user }: UserHomeScreenProps) {
  const router = useRouter();
  const [whatToDeliver, setWhatToDeliver] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const myOrders = useQuery(api.orders.getUserOrders, {
    userId: user?._id,
    limit: 5,
  });
  const createOrder = useMutation(api.orders.createOrder);

  const handleSubmitDelivery = async () => {
    if (!whatToDeliver || !fromLocation || !toLocation) {
      return;
    }

    try {
      await createOrder({
        userId: user?._id,
        item: whatToDeliver,
        pickupAddress: fromLocation,
        deliveryAddress: toLocation,
      });
      // Reset form
      setWhatToDeliver('');
      setFromLocation('');
      setToLocation('');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <RootWrapper className="px-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-gray-500 capitalize">
            Welcome back,
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || 'User'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/app/notifications' as any)}
          className="bg-primary/10 rounded-xl p-2">
          <Icons.Icon
            icon={Icons.Hugeicons.NotificationFreeIcons}
            size={20}
            strokeWidth={1.5}
            className="text-primary"
          />
        </TouchableOpacity>
      </View>

      {/* Promo Banner */}
      <TouchableOpacity
        onPress={() => router.push('/app/orders' as any)}
        className="from-primary to-secondary mb-4 rounded-2xl bg-linear-to-r p-4 shadow-md">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">Fast Delivery</Text>
            <Text className="text-sm text-white/80">
              Get your items delivered quickly
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Icons.Icon
              icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
              size={24}
              strokeWidth={2}
              className="text-white"
            />
          </View>
        </View>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Create Delivery Request Form */}
        <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-base font-bold text-gray-900">
            Request Delivery
          </Text>

          {/* What to Deliver */}
          <View className="mb-3">
            <Text className="mb-1 text-xs font-medium text-gray-500">
              What to deliver
            </Text>
            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <Icons.Icon
                icon={Icons.Hugeicons.PackageFreeIcons}
                size={18}
                strokeWidth={2}
                className="mr-2 text-gray-400"
              />
              <TextInput
                className="flex-1 text-sm text-gray-900"
                placeholder="Describe your item/package"
                placeholderTextColor="#9ca3af"
                value={whatToDeliver}
                onChangeText={setWhatToDeliver}
              />
            </View>
          </View>

          {/* From Location */}
          <View className="mb-3">
            <Text className="mb-1 text-xs font-medium text-gray-500">
              Pickup location
            </Text>
            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <Icons.Icon
                icon={Icons.Hugeicons.MapPinFreeIcons}
                size={18}
                strokeWidth={2}
                className="mr-2 text-gray-400"
              />
              <TextInput
                className="flex-1 text-sm text-gray-900"
                placeholder="Enter pickup address"
                placeholderTextColor="#9ca3af"
                value={fromLocation}
                onChangeText={setFromLocation}
              />
            </View>
          </View>

          {/* To Location */}
          <View className="mb-3">
            <Text className="mb-1 text-xs font-medium text-gray-500">
              Delivery location
            </Text>
            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <Icons.Icon
                icon={Icons.Hugeicons.NavigationFreeIcons}
                size={18}
                strokeWidth={2}
                className="mr-2 text-gray-400"
              />
              <TextInput
                className="flex-1 text-sm text-gray-900"
                placeholder="Enter delivery address"
                placeholderTextColor="#9ca3af"
                value={toLocation}
                onChangeText={setToLocation}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitDelivery}
            className="bg-primary mt-2 rounded-xl px-4 py-3">
            <Text className="text-center text-sm font-bold text-white">
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>

        {/* My Orders */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">My Orders</Text>
            <TouchableOpacity
              onPress={() => router.push('/app/orders' as any)}
              className="flex-row items-center">
              <Text className="text-secondary text-sm font-medium">
                View all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={14}
                strokeWidth={2}
                className="text-secondary ml-1"
              />
            </TouchableOpacity>
          </View>

          {!myOrders || myOrders.length === 0 ? (
            <View className="mt-6 items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={40}
                strokeWidth={1.5}
                className="text-gray-300"
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No orders yet
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Create your first delivery request above
              </Text>
            </View>
          ) : (
            myOrders.map(order => (
              <TouchableOpacity
                key={order._id}
                className="mb-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <View
                        className={`rounded-full px-2 py-0.5 ${
                          order.status === 'pending'
                            ? 'bg-primary/10'
                            : order.status === 'in-transit'
                              ? 'bg-secondary/10'
                              : 'bg-success/10'
                        }`}>
                        <Text
                          className={`text-xs font-bold capitalize ${
                            order.status === 'pending'
                              ? 'text-primary'
                              : order.status === 'in-transit'
                                ? 'text-secondary'
                                : 'text-success'
                          }`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="mt-1 text-xs text-gray-500">
                      {order.pickupAddress} → {order.deliveryAddress}
                    </Text>
                    <Text className="mt-0.5 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(order._creationTime), {
                        addSuffix: true,
                      })}
                    </Text>
                  </View>
                  <Text className="text-secondary text-base font-bold">
                    ${order.totalAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-bold text-gray-900">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/app/history' as any)}
              className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.RotateLeftFreeIcons}
                  size={20}
                  strokeWidth={2}
                  className="text-primary"
                />
              </View>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/app/settings' as any)}
              className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.UserFreeIcons}
                  size={20}
                  strokeWidth={2}
                  className="text-secondary"
                />
              </View>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </RootWrapper>
  );
}
