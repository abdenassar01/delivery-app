import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components';
import * as Icons from '@/icons';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered';

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus>('all');

  const filters: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const orders = [
    {
      id: 'ORD-1234',
      customer: 'Alice Johnson',
      address: '123 Main St, City',
      items: 3,
      amount: '$45.00',
      status: 'in-transit',
      time: '2 hours ago',
    },
    {
      id: 'ORD-1233',
      customer: 'Bob Smith',
      address: '456 Oak Ave, Town',
      items: 1,
      amount: '$12.50',
      status: 'pending',
      time: '4 hours ago',
    },
    {
      id: 'ORD-1232',
      customer: 'Carol White',
      address: '789 Pine Rd, Village',
      items: 5,
      amount: '$78.25',
      status: 'delivered',
      time: '1 day ago',
    },
    {
      id: 'ORD-1231',
      customer: 'David Brown',
      address: '321 Elm St, Metro',
      items: 2,
      amount: '$34.00',
      status: 'in-transit',
      time: '1 day ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'in-transit':
        return 'bg-blue-100 text-blue-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const filteredOrders = orders.filter(order =>
    selectedFilter === 'all' || order.status === selectedFilter
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-4 pt-12 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Orders</Text>
        <Text className="text-sm text-gray-500">Manage your deliveries</Text>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white border-b border-gray-200 px-5 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={`rounded-full px-4 py-2 ${
                  selectedFilter === filter.key
                    ? 'bg-indigo-600'
                    : 'bg-gray-100'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selectedFilter === filter.key
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <Icons.Icon
              icon={Icons.Hugeicons.ShoppingBagFreeIcons}
              size={64}
              strokeWidth={1.5}
              className="text-gray-300"
            />
            <Text className="mt-4 text-center text-gray-500">No orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} className="mb-4 bg-white rounded-2xl p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icons.Icon
                    icon={getStatusIcon(order.status)}
                    size={18}
                    strokeWidth={2}
                    className="text-gray-600"
                  />
                  <Text className="font-semibold text-gray-900">{order.id}</Text>
                </View>
                <View className={`rounded-full px-3 py-1 ${getStatusColor(order.status)}`}>
                  <Text className="text-xs font-semibold capitalize">
                    {order.status.replace('-', ' ')}
                  </Text>
                </View>
              </View>

              <View className="mb-3 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.UserFreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-gray-700">{order.customer}</Text>
              </View>

              <View className="mb-3 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-gray-700">{order.address}</Text>
              </View>

              <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                <View className="flex-row items-center gap-2">
                  <Icons.Icon
                    icon={Icons.Hugeicons.PackageFreeIcons}
                    size={16}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="text-sm text-gray-500">{order.items} items</Text>
                </View>
                <Text className="text-lg font-bold text-indigo-600">{order.amount}</Text>
              </View>

              <View className="mt-3 flex-row gap-2">
                <TouchableOpacity className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5">
                  <Text className="text-center text-sm font-semibold text-white">
                    View Details
                  </Text>
                </TouchableOpacity>
                {order.status !== 'delivered' && (
                  <TouchableOpacity className="rounded-xl border border-gray-300 px-4 py-2.5">
                    <Text className="text-center text-sm font-semibold text-gray-700">
                      Track
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
