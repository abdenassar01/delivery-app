import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc, Id } from 'convex/_generated/dataModel';
import { useCSSVariable } from 'uniwind';

interface CourierHomeScreenProps {
  user: (Doc<'users'> & { avatarUrl: string }) | null | undefined;
}

export function CourierHomeScreen({ user }: CourierHomeScreenProps) {
  const router = useRouter();
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;

  const availableOrders = useQuery(api.orders.getAvailableOrders);
  const myOrders = useQuery(api.orders.getCourierOrders, {
    courierId: user?._id,
    limit: 5,
  });
  const acceptOrder = useMutation(api.orders.acceptOrder);
  const stats = useQuery(api.stats.getCourierStats, {
    courierId: user?._id,
  });

  const handleAcceptOrder = async (orderId: Id<'orders'>) => {
    try {
      await acceptOrder({
        orderId,
        courierId: user?._id,
      });
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  return (
    <RootWrapper className="px-4">
      <View className="mt-3 flex-row items-center gap-2">
        <Image
          source={{ uri: user.avatarUrl }}
          className="h-12 w-12 rounded-xl border"
        />
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-500">
            Courier Dashboard
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || 'Courier'}
          </Text>
        </View>
      </View>

      <View className="border-secondary/10 bg-background-secondary mb-4 rounded-2xl border p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.Wallet03FreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Today's Earnings
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              ${stats?.todayEarnings || '0.00'}
            </Text>
          </View>
          <View className="flex-1">
            <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={20}
                strokeWidth={2}
                color={primary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Deliveries
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              {stats?.todayDeliveries || 0}
            </Text>
          </View>
        </View>
        <View className="mt-3 flex-row gap-4">
          <View>
            <Text className="text-xs text-gray-500">Rating</Text>
            <Text className="text-sm font-bold text-gray-900">
              {stats?.rating || '0.0'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-medium">Available Orders</Text>
            <TouchableOpacity
              onPress={() => router.push('/orders')}
              className="flex-row items-center">
              <Text className="text-secondary text-sm font-medium">
                View all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={14}
                strokeWidth={2}
                color={secondary}
              />
            </TouchableOpacity>
          </View>

          {!availableOrders || availableOrders.length === 0 ? (
            <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.Search01FreeIcons}
                size={40}
                strokeWidth={1.5}
                color={secondary}
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No available orders
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Check back later for new orders
              </Text>
            </View>
          ) : (
            <View className="mt-2">
              {availableOrders.slice(0, 3).map(order => (
                <TouchableOpacity
                  key={order._id}
                  className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <View className="bg-primary/10 h-6 w-6 items-center justify-center rounded-full">
                          <Icons.Icon
                            icon={Icons.Hugeicons.PackageFreeIcons}
                            size={12}
                            strokeWidth={2}
                            color={primary}
                          />
                        </View>
                        <Text className="text-sm font-bold text-gray-900">
                          {order.orderNumber}
                        </Text>
                      </View>
                      <Text className="mt-1 text-xs text-gray-500">
                        {order.pickupAddress} → {order.deliveryAddress}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleAcceptOrder(order._id)}
                      className="bg-primary rounded-lg px-3 py-2">
                      <Text className="text-xs font-bold text-white">
                        Accept
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* My Active Deliveries */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-medium">My Deliveries</Text>
            <TouchableOpacity
              onPress={() => router.push('/history' as any)}
              className="flex-row items-center">
              <Text className="text-secondary text-sm font-medium">
                History
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={14}
                strokeWidth={2}
                color={secondary}
              />
            </TouchableOpacity>
          </View>

          {!myOrders || myOrders.length === 0 ? (
            <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={40}
                strokeWidth={1.5}
                color={secondary}
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No active deliveries
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Accept an order to get started
              </Text>
            </View>
          ) : (
            <View className="mt-2">
              {myOrders.map(order => (
                <TouchableOpacity
                  key={order._id}
                  className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <Text className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(order._creationTime), {
                          addSuffix: true,
                        })}
                      </Text>
                    </View>
                    <View className="bg-secondary/10 rounded-full px-2 py-1">
                      <Text className="text-secondary text-xs font-bold">
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </RootWrapper>
  );
}
