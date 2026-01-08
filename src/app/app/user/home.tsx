import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { CreateDeliveryModal, RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc, Id } from 'convex/_generated/dataModel';
import { MaterialIcons } from '@expo/vector-icons';
import { useCSSVariable } from 'uniwind';

interface UserHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function UserHomeScreen({ user }: UserHomeScreenProps) {
  const router = useRouter();
  const primary = useCSSVariable('--color-primary') as string;
  const [refreshKey, setRefreshKey] = useState(0);

  const myOrders = useQuery(api.orders.getUserOrders, {
    userId: user?._id,
    limit: 5,
  });

  const handleSuccess = () => {
    // Trigger refresh of orders
    setRefreshKey(prev => prev + 1);
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

      {/* Quick Actions */}
      <View className="mb-4">
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
            onPress={() => router.push('/app/profile' as any)}
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

      <ScrollView showsVerticalScrollIndicator={false} key={refreshKey}>
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
                Tap "New Delivery" to create your first order
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

        {/* Additional padding for the floating button */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating New Delivery Button */}
      <View className="absolute right-4 bottom-6">
        <CreateDeliveryModal userId={user?._id} onSuccess={handleSuccess} />
      </View>
    </RootWrapper>
  );
}
