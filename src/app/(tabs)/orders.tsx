import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native';
import { Text } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { formatDistanceToNow } from 'date-fns';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered';

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const user = useQuery(api.users.getCurrentUser);

  const filters: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Icons.Hugeicons.SquareFreeIcons },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-transit':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Icons.Hugeicons.Time01FreeIcons;
      case 'in-transit':
        return Icons.Hugeicons.TruckDeliveryFreeIcons;
      case 'delivered':
        return Icons.Hugeicons.CheckmarkBadgeFreeIcons;
      default:
        return Icons.Hugeicons.ShoppingBagFreeIcons;
    }
  };

  const filteredOrders = (allOrders || []).filter(order => {
    const matchesFilter =
      selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 shadow-sm">
        <View className="mb-4">
          <HeaderWithGoBack />
        </View>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Orders</Text>
            <Text className="text-sm text-gray-500">
              {filteredOrders.length}{' '}
              {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Icons.Icon
              icon={Icons.Hugeicons.FilterEditFreeIcons}
              size={20}
              strokeWidth={2}
              className="text-primary"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4">
          <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Icons.Icon
              icon={Icons.Hugeicons.Search01FreeIcons}
              size={20}
              strokeWidth={2}
              className="mr-3 text-gray-400"
            />
            <TextInput
              className="flex-1 text-base text-gray-900"
              placeholder="Search orders..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icons.Icon
                  icon={Icons.Hugeicons.Cancel01FreeIcons}
                  size={18}
                  strokeWidth={2}
                  className="text-gray-400"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="border-b border-gray-100 bg-white px-5 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={cn(
                  'flex-row items-center rounded-full border-2 px-4 py-2',
                  selectedFilter === filter.key
                    ? 'border-primary bg-primary'
                    : 'border-gray-200 bg-white',
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
                    'text-sm font-bold',
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
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#da910e"
          />
        }>
        {filteredOrders.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.Search01FreeIcons}
                size={36}
                strokeWidth={1.5}
                className="text-gray-400"
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No orders found
            </Text>
            <Text className="text-center text-gray-500">
              {searchQuery
                ? 'Try a different search term'
                : 'No orders match this filter'}
            </Text>
          </View>
        ) : (
          filteredOrders.map(order => (
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
                          : 'bg-success/10',
                    )}>
                    <Icons.Icon
                      icon={getStatusIcon(order.status)}
                      size={16}
                      strokeWidth={2.5}
                      className={
                        order.status === 'pending'
                          ? 'text-primary'
                          : order.status === 'in-transit'
                            ? 'text-secondary'
                            : 'text-success'
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

              {/* Item Info */}
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Icons.Icon
                    icon={Icons.Hugeicons.PackageFreeIcons}
                    size={16}
                    strokeWidth={2}
                    className="text-gray-500"
                  />
                </View>
                <Text className="flex-1 font-medium text-gray-800">
                  {order.item}
                </Text>
              </View>

              {/* Address */}
              <View className="mb-3 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={18}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-sm text-gray-600">
                  {order.pickupAddress} → {order.deliveryAddress}
                </Text>
              </View>

              {/* Order Details */}
              <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1.5">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Route01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      className="text-gray-400"
                    />
                    <Text className="text-sm text-gray-500">
                      {order.distance ? `${order.distance} km` : 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl font-bold text-secondary">
                  ${order.totalAmount}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="mt-4 flex-row gap-2">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-xl bg-primary px-4 py-3">
                  <Icons.Icon
                    icon={Icons.Hugeicons.EyeFreeIcons}
                    size={18}
                    strokeWidth={2}
                    className="mr-2 text-white"
                  />
                  <Text className="text-center text-sm font-bold text-white">
                    Details
                  </Text>
                </TouchableOpacity>
                {order.status !== 'delivered' && (
                  <TouchableOpacity className="flex-row items-center justify-center rounded-xl border-2 border-primary/20 px-4 py-3">
                    <Icons.Icon
                      icon={Icons.Hugeicons.NavigationFreeIcons}
                      size={18}
                      strokeWidth={2}
                      className="mr-2 text-primary"
                    />
                    <Text className="text-center text-sm font-bold text-primary">
                      Navigate
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
