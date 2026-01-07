import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native';
import { Text, Input } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered';

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filters: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Icons.Hugeicons.SquareFreeIcons },
    { key: 'pending', label: 'Pending', icon: Icons.Hugeicons.Time01FreeIcons },
    { key: 'in-transit', label: 'In Transit', icon: Icons.Hugeicons.TruckDeliveryFreeIcons },
    { key: 'delivered', label: 'Delivered', icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons },
  ];

  const orders = [
    {
      id: 'ORD-1234',
      customer: 'Alice Johnson',
      address: '123 Main St, City',
      items: 3,
      amount: '$45.00',
      status: 'in-transit' as const,
      time: '2 hours ago',
      distance: '2.3 km',
    },
    {
      id: 'ORD-1233',
      customer: 'Bob Smith',
      address: '456 Oak Ave, Town',
      items: 1,
      amount: '$12.50',
      status: 'pending' as const,
      time: '4 hours ago',
      distance: '1.5 km',
    },
    {
      id: 'ORD-1232',
      customer: 'Carol White',
      address: '789 Pine Rd, Village',
      items: 5,
      amount: '$78.25',
      status: 'delivered' as const,
      time: '1 day ago',
      distance: '3.8 km',
    },
    {
      id: 'ORD-1231',
      customer: 'David Brown',
      address: '321 Elm St, Metro',
      items: 2,
      amount: '$34.00',
      status: 'in-transit' as const,
      time: '1 day ago',
      distance: '4.2 km',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-transit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
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

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-4 pt-12 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Orders</Text>
            <Text className="text-sm text-gray-500">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
            <Icons.Icon
              icon={Icons.Hugeicons.FilterNewFreeIcons}
              size={20}
              strokeWidth={2}
              className="text-indigo-600"
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
              className="text-gray-400 mr-3"
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
      <View className="bg-white border-b border-gray-100 px-5 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={cn(
                  'flex-row items-center rounded-full px-4 py-2 border-2',
                  selectedFilter === filter.key
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-200 bg-white',
                )}>
                <Icons.Icon
                  icon={filter.icon}
                  size={16}
                  strokeWidth={2.5}
                  className={cn(
                    selectedFilter === filter.key ? 'text-white' : 'text-gray-500',
                    selectedFilter !== filter.key && 'mr-1.5',
                  )}
                />
                <Text
                  className={cn(
                    'text-sm font-bold',
                    selectedFilter === filter.key ? 'text-white' : 'text-gray-700',
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
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
              {searchQuery ? 'Try a different search term' : 'No orders match this filter'}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              activeOpacity={0.7}>
              {/* Order Header */}
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View
                    className={cn(
                      'h-8 w-8 items-center justify-center rounded-full',
                      order.status === 'pending'
                        ? 'bg-orange-50'
                        : order.status === 'in-transit'
                          ? 'bg-blue-50'
                          : 'bg-green-50',
                    )}>
                    <Icons.Icon
                      icon={getStatusIcon(order.status)}
                      size={16}
                      strokeWidth={2.5}
                      className={
                        order.status === 'pending'
                          ? 'text-orange-600'
                          : order.status === 'in-transit'
                            ? 'text-blue-600'
                            : 'text-green-600'
                      }
                    />
                  </View>
                  <Text className="font-bold text-gray-900">{order.id}</Text>
                </View>
                <View
                  className={cn(
                    'rounded-full border px-3 py-1',
                    getStatusColor(order.status),
                  )}>
                  <Text className="text-xs font-bold capitalize">
                    {order.status.replace('-', ' ')}
                  </Text>
                </View>
              </View>

              {/* Customer Info */}
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Icons.Icon
                    icon={Icons.Hugeicons.UserFreeIcons}
                    size={16}
                    strokeWidth={2}
                    className="text-gray-500"
                  />
                </View>
                <Text className="flex-1 font-medium text-gray-800">{order.customer}</Text>
              </View>

              {/* Address */}
              <View className="mb-3 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={18}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-sm text-gray-600">{order.address}</Text>
              </View>

              {/* Order Details */}
              <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1.5">
                    <Icons.Icon
                      icon={Icons.Hugeicons.PackageFreeIcons}
                      size={16}
                      strokeWidth={2}
                      className="text-gray-400"
                    />
                    <Text className="text-sm text-gray-500">{order.items} items</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Routing01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      className="text-gray-400"
                    />
                    <Text className="text-sm text-gray-500">{order.distance}</Text>
                  </View>
                </View>
                <Text className="text-xl font-bold text-indigo-600">{order.amount}</Text>
              </View>

              {/* Action Buttons */}
              <View className="mt-4 flex-row gap-2">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-xl bg-indigo-600 px-4 py-3">
                  <Icons.Icon
                    icon={Icons.Hugeicons.EyeFreeIcons}
                    size={18}
                    strokeWidth={2}
                    className="text-white mr-2"
                  />
                  <Text className="text-center text-sm font-bold text-white">Details</Text>
                </TouchableOpacity>
                {order.status !== 'delivered' && (
                  <TouchableOpacity className="flex-row items-center justify-center rounded-xl border-2 border-indigo-200 px-4 py-3">
                    <Icons.Icon
                      icon={Icons.Hugeicons.NavigationFreeIcons}
                      size={18}
                      strokeWidth={2}
                      className="text-indigo-600 mr-2"
                    />
                    <Text className="text-center text-sm font-bold text-indigo-600">Navigate</Text>
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
