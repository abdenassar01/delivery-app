import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components';
import * as Icons from '@/icons';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('all');

  const timeFilters: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const historyData = [
    {
      period: 'January 2026',
      deliveries: 45,
      earnings: 1234.56,
      rating: 4.8,
    },
    {
      period: 'December 2025',
      deliveries: 52,
      earnings: 1456.78,
      rating: 4.9,
    },
    {
      period: 'November 2025',
      deliveries: 38,
      earnings: 987.45,
      rating: 4.7,
    },
    {
      period: 'October 2025',
      deliveries: 41,
      earnings: 1123.90,
      rating: 4.8,
    },
  ];

  const recentDeliveries = [
    {
      id: 'ORD-1234',
      date: 'Jan 15, 2026',
      customer: 'Alice Johnson',
      from: '123 Main St',
      to: '456 Oak Ave',
      amount: '$15.00',
      rating: 5,
    },
    {
      id: 'ORD-1233',
      date: 'Jan 14, 2026',
      customer: 'Bob Smith',
      from: '789 Pine Rd',
      to: '321 Elm St',
      amount: '$22.50',
      rating: 4,
    },
    {
      id: 'ORD-1232',
      date: 'Jan 13, 2026',
      customer: 'Carol White',
      from: '555 Maple Dr',
      to: '777 Cedar Ln',
      amount: '$18.00',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icons.Icon
            key={star}
            icon={Icons.Hugeicons.StarFreeIcons}
            size={16}
            strokeWidth={2}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-4 pt-12 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">History</Text>
        <Text className="text-sm text-gray-500">Your delivery history</Text>
      </View>

      {/* Summary Cards */}
      <View className="mt-4 px-5">
        <View className="flex-row gap-3">
          <View className="bg-indigo-600 flex-1 rounded-2xl p-4 shadow-sm">
            <Icons.Icon
              icon={Icons.Hugeicons.DollarCircleFreeIcons}
              size={32}
              strokeWidth={2}
              className="text-white mb-2"
            />
            <Text className="text-white/80 text-sm">Total Earnings</Text>
            <Text className="mt-1 text-2xl font-bold text-white">$4,802.69</Text>
          </View>
          <View className="bg-white flex-1 rounded-2xl p-4 shadow-sm">
            <Icons.Icon
              icon={Icons.Hugeicons.ShoppingBagFreeIcons}
              size={32}
              strokeWidth={2}
              className="text-indigo-600 mb-2"
            />
            <Text className="text-gray-500 text-sm">Total Deliveries</Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">176</Text>
          </View>
        </View>
      </View>

      {/* Time Filter */}
      <View className="mt-4 px-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {timeFilters.map((filter) => (
              <View
                key={filter.key}
                className={`rounded-full border px-4 py-2 ${
                  selectedTimeFilter === filter.key
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300 bg-white'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selectedTimeFilter === filter.key
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}>
                  {filter.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Monthly Summary */}
        <View className="mt-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Monthly Summary</Text>
          {historyData.map((month, index) => (
            <View key={index} className="mb-3 bg-white rounded-2xl p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">{month.period}</Text>
                {renderStars(month.rating)}
              </View>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-gray-500 text-sm">Deliveries</Text>
                  <Text className="mt-1 text-xl font-bold text-gray-900">{month.deliveries}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-sm">Earnings</Text>
                  <Text className="mt-1 text-xl font-bold text-green-600">${month.earnings.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Deliveries */}
        <View className="mb-24 mt-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Recent Deliveries</Text>
          {recentDeliveries.map((delivery) => (
            <View key={delivery.id} className="mb-3 bg-white rounded-2xl p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="font-semibold text-gray-900">{delivery.id}</Text>
                  <Text className="text-sm text-gray-500">{delivery.date}</Text>
                </View>
                <Text className="text-lg font-bold text-green-600">{delivery.amount}</Text>
              </View>

              <View className="mb-2 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.UserFreeIcons}
                  size={14}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="text-sm text-gray-600">{delivery.customer}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={14}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-sm text-gray-600">{delivery.from}</Text>
                <Icons.Icon
                  icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text className="flex-1 text-sm text-gray-600">{delivery.to}</Text>
              </View>

              <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
                <Text className="text-sm text-gray-500">Rating</Text>
                {renderStars(delivery.rating)}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
