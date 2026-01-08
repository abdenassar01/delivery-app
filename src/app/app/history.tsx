import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState<TimeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const user = useQuery(api.users.getCurrentUser);

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  // Get orders based on user role
  const allOrders =
    user?.role === 'delivery'
      ? useQuery(api.orders.getCourierOrders, {
          courierId: user._id,
          limit: 50,
        })
      : useQuery(api.orders.getUserOrders, {
          userId: user?._id,
          limit: 50,
        });

  // Calculate stats
  const deliveredOrders = (allOrders || []).filter(
    order => order.status === 'delivered',
  );
  const totalEarnings = deliveredOrders
    .reduce((sum, order) => sum + order.totalAmount, 0)
    .toFixed(2);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-6 shadow-sm">
        <View className="mb-4">
          <HeaderWithGoBack />
        </View>
        <Text className="text-2xl font-bold text-gray-900">History</Text>
        <Text className="text-sm text-gray-500">
          Your delivery history & earnings
        </Text>
      </View>

      {/* Summary Cards */}
      <View className="mt-4 px-5">
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <Icons.Icon
                  icon={Icons.Hugeicons.DollarCircleFreeIcons}
                  size={22}
                  strokeWidth={2}
                  className="text-secondary"
                />
              </View>
            </View>
            <Text className="text-xs font-medium text-gray-500">
              TOTAL EARNINGS
            </Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">
              ${totalEarnings}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icons.Icon
                  icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                  size={22}
                  strokeWidth={2}
                  className="text-primary"
                />
              </View>
            </View>
            <Text className="text-xs font-medium text-gray-500">
              DELIVERIES
            </Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">
              {deliveredOrders.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Time Filter */}
      <View className="mt-4 px-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {timeFilters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedTimeFilter(filter.key)}
                className={cn(
                  'rounded-full border-2 px-4 py-2',
                  selectedTimeFilter === filter.key
                    ? 'border-secondary bg-secondary'
                    : 'border-gray-200 bg-white',
                )}>
                <Text
                  className={cn(
                    'text-sm font-bold',
                    selectedTimeFilter === filter.key
                      ? 'text-white'
                      : 'text-gray-700',
                  )}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#da910e"
          />
        }>
        {/* Recent Deliveries */}
        <View className="mt-4 mb-24">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Recent Deliveries
            </Text>
          </View>
          {deliveredOrders.length === 0 ? (
            <View className="mt-6 items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={40}
                strokeWidth={1.5}
                className="text-gray-300"
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No deliveries yet
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Your completed deliveries will appear here
              </Text>
            </View>
          ) : (
            deliveredOrders.map(order => (
              <TouchableOpacity
                key={order._id}
                className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <View className="h-1.5 w-1.5 rounded-full bg-success" />
                      <Text className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(order._creationTime), {
                          addSuffix: true,
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold text-secondary">
                    ${order.totalAmount}
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                    <Icons.Icon
                      icon={Icons.Hugeicons.PackageFreeIcons}
                      size={14}
                      strokeWidth={2}
                      className="text-gray-500"
                    />
                  </View>
                  <Text className="flex-1 text-sm font-medium text-gray-700">
                    {order.item}
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center gap-2">
                  <Icons.Icon
                    icon={Icons.Hugeicons.MapPinFreeIcons}
                    size={16}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="flex-1 text-sm text-gray-600">
                    {order.pickupAddress}
                  </Text>
                  <Icons.Icon
                    icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                    size={16}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="flex-1 text-sm text-gray-600">
                    {order.deliveryAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
