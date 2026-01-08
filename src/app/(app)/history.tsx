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

type TimeFilter = 'all' | 'week' | 'month' | 'year';

export default function HistoryScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState<TimeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

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
      trend: 'up',
      percentChange: '+12%',
    },
    {
      period: 'December 2025',
      deliveries: 52,
      earnings: 1456.78,
      rating: 4.9,
      trend: 'up',
      percentChange: '+8%',
    },
    {
      period: 'November 2025',
      deliveries: 38,
      earnings: 987.45,
      rating: 4.7,
      trend: 'down',
      percentChange: '-3%',
    },
    {
      period: 'October 2025',
      deliveries: 41,
      earnings: 1123.9,
      rating: 4.8,
      trend: 'up',
      percentChange: '+5%',
    },
  ];

  const recentDeliveries = [
    {
      id: 'ORD-1234',
      date: 'Jan 15, 2026',
      time: '2:30 PM',
      customer: 'Alice Johnson',
      from: '123 Main St',
      to: '456 Oak Ave',
      amount: '$15.00',
      rating: 5,
      distance: '2.3 km',
      duration: '15 min',
    },
    {
      id: 'ORD-1233',
      date: 'Jan 14, 2026',
      time: '11:45 AM',
      customer: 'Bob Smith',
      from: '789 Pine Rd',
      to: '321 Elm St',
      amount: '$22.50',
      rating: 4,
      distance: '3.1 km',
      duration: '22 min',
    },
    {
      id: 'ORD-1232',
      date: 'Jan 13, 2026',
      time: '4:15 PM',
      customer: 'Carol White',
      from: '555 Maple Dr',
      to: '777 Cedar Ln',
      amount: '$18.00',
      rating: 5,
      distance: '1.8 km',
      duration: '12 min',
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map(star => (
          <Icons.Icon
            key={star}
            icon={Icons.Hugeicons.StarFreeIcons}
            size={14}
            strokeWidth={2}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </View>
    );
  };

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
              <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Icons.Icon
                  icon={Icons.Hugeicons.DollarCircleFreeIcons}
                  size={22}
                  strokeWidth={2}
                  className="text-green-600"
                />
              </View>
              <View className="flex-row items-center rounded-full bg-green-50 px-2 py-1">
                <Icons.Icon
                  icon={Icons.Hugeicons.ArrowUp01FreeIcons}
                  size={12}
                  strokeWidth={2.5}
                  className="mr-1 text-green-600"
                />
                <Text className="text-xs font-bold text-green-600">12%</Text>
              </View>
            </View>
            <Text className="text-xs font-medium text-gray-500">
              TOTAL EARNINGS
            </Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">
              $4,802.69
            </Text>
          </View>

          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <Icons.Icon
                  icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                  size={22}
                  strokeWidth={2}
                  className="text-indigo-600"
                />
              </View>
              <View className="flex-row items-center rounded-full bg-blue-50 px-2 py-1">
                <Icons.Icon
                  icon={Icons.Hugeicons.ArrowUp01FreeIcons}
                  size={12}
                  strokeWidth={2.5}
                  className="mr-1 text-blue-600"
                />
                <Text className="text-xs font-bold text-blue-600">8%</Text>
              </View>
            </View>
            <Text className="text-xs font-medium text-gray-500">
              DELIVERIES
            </Text>
            <Text className="mt-1 text-2xl font-bold text-gray-900">176</Text>
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
                    ? 'border-green-600 bg-green-600'
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
            tintColor="#6366f1"
          />
        }>
        {/* Monthly Summary */}
        <View className="mt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Monthly Summary
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm font-medium text-green-600">
                View all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={14}
                strokeWidth={2}
                className="ml-1 text-green-600"
              />
            </TouchableOpacity>
          </View>
          {historyData.map((month, index) => (
            <TouchableOpacity
              key={index}
              className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              activeOpacity={0.7}>
              <View className="mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    {month.period}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Icons.Icon
                      icon={
                        month.trend === 'up'
                          ? Icons.Hugeicons.ArrowUp01FreeIcons
                          : Icons.Hugeicons.ArrowDown01FreeIcons
                      }
                      size={14}
                      strokeWidth={2.5}
                      className={
                        month.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }
                    />
                    <Text
                      className={cn(
                        'text-xs font-bold',
                        month.trend === 'up'
                          ? 'text-green-600'
                          : 'text-red-600',
                      )}>
                      {month.percentChange}
                    </Text>
                    <Text className="ml-1 text-xs text-gray-400">
                      vs last month
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  {renderStars(month.rating)}
                  <Text className="mt-1 text-xs text-gray-500">
                    {month.rating}/5.0
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between border-t border-gray-100 pt-3">
                <View className="flex-1">
                  <Text className="text-xs font-medium text-gray-500">
                    DELIVERIES
                  </Text>
                  <Text className="mt-1 text-xl font-bold text-gray-900">
                    {month.deliveries}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-xs font-medium text-gray-500">
                    EARNINGS
                  </Text>
                  <Text className="mt-1 text-xl font-bold text-green-600">
                    ${month.earnings.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Deliveries */}
        <View className="mt-6 mb-24">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Recent Deliveries
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm font-medium text-green-600">
                See all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={14}
                strokeWidth={2}
                className="ml-1 text-green-600"
              />
            </TouchableOpacity>
          </View>
          {recentDeliveries.map(delivery => (
            <TouchableOpacity
              key={delivery.id}
              className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              activeOpacity={0.7}>
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-bold text-gray-900">
                      {delivery.id}
                    </Text>
                    <View className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <Text className="text-sm text-gray-500">
                      {delivery.time}
                    </Text>
                  </View>
                  <Text className="mt-0.5 text-xs text-gray-400">
                    {delivery.date}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-green-600">
                  {delivery.amount}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center gap-2">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                  <Icons.Icon
                    icon={Icons.Hugeicons.UserFreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="text-gray-500"
                  />
                </View>
                <Text className="flex-1 text-sm font-medium text-gray-700">
                  {delivery.customer}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center gap-2">
                <Icons.Icon
                  icon={Icons.Hugeicons.MapPinFreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text
                  className="flex-1 text-sm text-gray-600"
                  numberOfLines={1}>
                  {delivery.from}
                </Text>
                <Icons.Icon
                  icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                  size={16}
                  strokeWidth={2}
                  className="text-gray-400"
                />
                <Text
                  className="flex-1 text-sm text-gray-600"
                  numberOfLines={1}>
                  {delivery.to}
                </Text>
              </View>

              <View className="mb-3 flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Icons.Icon
                    icon={Icons.Hugeicons.Route01FreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="text-xs text-gray-500">
                    {delivery.distance}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Icons.Icon
                    icon={Icons.Hugeicons.ClockFreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="text-xs text-gray-500">
                    {delivery.duration}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                <View>
                  <Text className="text-xs text-gray-500">CUSTOMER RATING</Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    {renderStars(delivery.rating)}
                    <Text className="ml-1 text-xs font-semibold text-gray-700">
                      {delivery.rating}.0
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="rounded-lg bg-green-50 px-3 py-2">
                  <Text className="text-xs font-bold text-green-700">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
