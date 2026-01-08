import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  CreateDeliveryModal,
  HomeTopSection,
  RootWrapper,
  Text,
} from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc } from 'convex/_generated/dataModel';
import { useCSSVariable } from 'uniwind';

interface UserHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function UserHomeScreen({ user }: UserHomeScreenProps) {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [refreshKey, setRefreshKey] = useState(0);
  const secondary = useCSSVariable('--color-secondary') as string;
  const primary = useCSSVariable('--color-primary') as string;
  const myOrders = useQuery(api.orders.getUserOrders, {
    userId: user?._id,
    limit: 5,
  });

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <RootWrapper className="android:pt-0 ios:pt-0 pt-0!">
      <HomeTopSection />
      <View className="mt-3 px-4">
        <Text className="text-lg font-medium">Quick Actions</Text>
        <View className="mt-2 flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.push('/app/history' as any)}
            className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
              <Icons.Icon
                icon={Icons.Hugeicons.RotateLeftFreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="mt-2 text-sm font-semibold text-gray-900">
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/app/profile' as any)}
            className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
              <Icons.Icon
                icon={Icons.Hugeicons.UserFreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="mt-2 text-sm font-semibold text-gray-900">
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: height - 350 }} className="mt-3 px-4">
        <ScrollView
          contentContainerClassName=""
          showsVerticalScrollIndicator={false}
          key={refreshKey}>
          <View className="">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-medium">My Orders</Text>
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
                  color={secondary}
                />
              </TouchableOpacity>
            </View>

            {!myOrders || myOrders.length === 0 ? (
              <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
                <Icons.Icon
                  icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                  size={40}
                  strokeWidth={1.5}
                  color={secondary}
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
                  className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
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
        </ScrollView>
        <CreateDeliveryModal userId={user?._id} onSuccess={handleSuccess} />
      </View>
    </RootWrapper>
  );
}
