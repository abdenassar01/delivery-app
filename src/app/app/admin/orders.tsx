import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered' | 'cancelled';

export default function AdminOrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>('all');

  const filters: { key: OrderStatus; label: string; icon: any }[] = [
    {
      key: 'all',
      label: 'All',
      icon: Icons.Hugeicons.DeliveryTruck01FreeIcons,
    },
    { key: 'pending', label: 'Pending', icon: Icons.Hugeicons.Time01FreeIcons },
    {
      key: 'in-transit',
      label: 'In Transit',
      icon: Icons.Hugeicons.TruckDeliveryFreeIcons,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      icon: Icons.Hugeicons.Cancel01FreeIcons,
    },
  ];

  const allOrders = useQuery(api.orders.getAllOrders, {
    limit: 100,
    status: selectedFilter === 'all' ? undefined : selectedFilter,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-transit':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="pt-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-1">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={cn(
                  'flex-row items-center gap-2 rounded-xl border p-2 px-4 py-1.5',
                  selectedFilter === filter.key
                    ? 'border-secondary bg-secondary'
                    : 'border-secondary/10 bg-background-secondary',
                )}>
                <Icons.Icon
                  icon={filter.icon}
                  size={16}
                  strokeWidth={2.5}
                  className={cn(
                    selectedFilter === filter.key
                      ? 'text-white'
                      : 'text-gray-500',
                    selectedFilter !== filter.key && 'mr-1.5',
                  )}
                />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    selectedFilter === filter.key
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

      {/* Orders List */}
      <ScrollView className="pt-3" showsVerticalScrollIndicator={false}>
        {!allOrders || allOrders.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={36}
                strokeWidth={1.5}
                className="text-gray-400"
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No orders found
            </Text>
            <Text className="text-center text-gray-500">
              {selectedFilter !== 'all'
                ? 'No orders match this filter'
                : 'No orders yet'}
            </Text>
          </View>
        ) : (
          allOrders.map(order => (
            <TouchableOpacity
              key={order._id}
              className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {/* Order Header */}
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View
                    className={cn(
                      'h-8 w-8 items-center justify-center rounded-full',
                      order.status === 'pending'
                        ? 'bg-primary/10'
                        : order.status === 'in-transit'
                          ? 'bg-secondary/10'
                          : order.status === 'delivered'
                            ? 'bg-success/10'
                            : 'bg-error/10',
                    )}>
                    <Icons.Icon
                      icon={
                        order.status === 'pending'
                          ? Icons.Hugeicons.Time01FreeIcons
                          : order.status === 'in-transit'
                            ? Icons.Hugeicons.TruckDeliveryFreeIcons
                            : order.status === 'delivered'
                              ? Icons.Hugeicons.CheckmarkBadgeFreeIcons
                              : Icons.Hugeicons.Cancel01FreeIcons
                      }
                      size={16}
                      strokeWidth={2.5}
                      className={
                        order.status === 'pending'
                          ? 'text-primary'
                          : order.status === 'in-transit'
                            ? 'text-secondary'
                            : order.status === 'delivered'
                              ? 'text-success'
                              : 'text-error'
                      }
                    />
                  </View>
                  <Text className="font-bold text-gray-900">
                    {order.orderNumber}
                  </Text>
                </View>
                <View
                  className={cn(
                    'rounded-full border px-3 py-1',
                    getStatusColor(order.status),
                  )}>
                  <Text className="text-xs font-bold capitalize">
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Order Details */}
              <View className="mb-2 flex-row items-center gap-2">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                  <Icons.Icon
                    icon={Icons.Hugeicons.PackageFreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="text-gray-500"
                  />
                </View>
                <Text className="text-sm font-medium text-gray-700">
                  {order.item}
                </Text>
              </View>

              {/* Route */}
              <View className="mb-2 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="text-sm text-gray-600">
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

              {/* Bottom Row */}
              <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                <Text className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(order._creationTime), {
                    addSuffix: true,
                  })}
                </Text>
                <Text className="text-secondary text-xl font-bold">
                  ${order.totalAmount}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </RootWrapper>
  );
}
