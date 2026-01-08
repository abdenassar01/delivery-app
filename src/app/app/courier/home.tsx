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

interface CourierHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function CourierHomeScreen({ user }: CourierHomeScreenProps) {
  const router = useRouter();
  const [whatToDeliver, setWhatToDeliver] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const availableOrders = useQuery(api.orders.getAvailableOrders);
  const myOrders = useQuery(api.orders.getCourierOrders, {
    courierId: user?._id,
    limit: 5,
  });
  const acceptOrder = useMutation(api.orders.acceptOrder);
  const stats = useQuery(api.stats.getCourierStats, {
    courierId: user?._id,
  });

  const handleSubmitDelivery = () => {
    console.log({ whatToDeliver, fromLocation, toLocation });
  };

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
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium capitalize text-gray-500">
            Courier Dashboard
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || 'Courier'}
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

      {/* Balance Card */}
      <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-medium text-gray-500">
              Today's Earnings
            </Text>
            <Text className="mt-1 text-2xl font-bold text-secondary">
              ${stats?.todayEarnings || '0.00'}
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
            <Icons.Icon
              icon={Icons.Hugeicons.Wallet03FreeIcons}
              size={24}
              strokeWidth={2}
              className="text-secondary"
            />
          </View>
        </View>
        <View className="mt-3 flex-row gap-4">
          <View>
            <Text className="text-xs text-gray-500">Deliveries</Text>
            <Text className="text-sm font-bold text-gray-900">
              {stats?.todayDeliveries || 0}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">Rating</Text>
            <Text className="text-sm font-bold text-gray-900">
              {stats?.rating || '0.0'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Available Orders */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Available Orders
            </Text>
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

          {!availableOrders || availableOrders.length === 0 ? (
            <View className="mt-6 items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.Search01FreeIcons}
                size={40}
                strokeWidth={1.5}
                className="text-gray-300"
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No available orders
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Check back later for new orders
              </Text>
            </View>
          ) : (
            availableOrders.slice(0, 3).map(order => (
              <TouchableOpacity
                key={order._id}
                className="mb-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Icons.Icon
                          icon={Icons.Hugeicons.PackageFreeIcons}
                          size={12}
                          strokeWidth={2}
                          className="text-primary"
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
                    className="rounded-lg bg-primary px-3 py-2">
                    <Text className="text-xs font-bold text-white">Accept</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* My Active Deliveries */}
        <View className="mb-6">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              My Deliveries
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/app/history' as any)}
              className="flex-row items-center">
              <Text className="text-secondary text-sm font-medium">
                History
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
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={40}
                strokeWidth={1.5}
                className="text-gray-300"
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No active deliveries
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Accept an order to get started
              </Text>
            </View>
          ) : (
            myOrders.map(order => (
              <TouchableOpacity
                key={order._id}
                className="mb-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
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
                  <View className="rounded-full bg-secondary/10 px-2 py-1">
                    <Text className="text-xs font-bold text-secondary">
                      {order.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </RootWrapper>
  );
}
