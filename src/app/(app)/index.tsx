import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/components';
import { useRouter } from 'expo-router';
import * as Icons from '@/icons';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { api } from 'convex/_generated/api';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real data from Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const allUsers = useQuery(api.users.getAllUsers, { limit: 5 });

  const onRefresh = async () => {
    setRefreshing(true);
    // Add any refetch logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const user = currentUser;
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  // Stats would normally come from Convex
  const stats = [
    {
      label: 'Total Orders',
      value: '124',
      icon: Icons.Hugeicons.ShoppingBagFreeIcons,
      color: 'bg-blue-500',
    },
    {
      label: 'Completed',
      value: '98',
      icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons,
      color: 'bg-green-500',
    },
    {
      label: 'In Progress',
      value: '5',
      icon: Icons.Hugeicons.Time01FreeIcons,
      color: 'bg-orange-500',
    },
    {
      label: 'Earnings',
      value: '$1,234',
      icon: Icons.Hugeicons.DollarCircleFreeIcons,
      color: 'bg-indigo-500',
    },
  ];

  const quickActions = [
    {
      label: 'New Order',
      icon: Icons.Hugeicons.AddCircleFreeIcons,
      route: '/orders/new',
    },
    {
      label: 'Track Order',
      icon: Icons.Hugeicons.Search01FreeIcons,
      route: '/orders/track',
    },
    {
      label: 'My Profile',
      icon: Icons.Hugeicons.UserFreeIcons,
      route: '/profile',
    },
    {
      label: 'Support',
      icon: Icons.Hugeicons.CustomerSupportFreeIcons,
      route: '/support',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with gradient */}
      <View className="bg-linear-to-b from-indigo-600 to-indigo-500 px-5 pt-12 pb-8">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-medium text-indigo-100">
              Welcome back
            </Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              {userName}
            </Text>
            {userEmail && (
              <Text className="mt-0.5 text-sm text-indigo-200">
                {userEmail}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(app)/settings')}
            className="h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <Icons.Icon
                icon={Icons.Hugeicons.UserFreeIcons}
                size={28}
                strokeWidth={2}
                className="text-white"
              />
            )}
          </TouchableOpacity>
        </View>
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
        {/* Stats Cards - Overlapping header */}
        <View style={{ marginTop: -24 }}>
          <View className="flex-row flex-wrap justify-between gap-3">
            {stats.map((stat, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] rounded-2xl bg-white p-4 shadow-md"
                activeOpacity={0.7}>
                <View
                  className={`mb-3 h-11 w-11 items-center justify-center rounded-full ${stat.color}`}>
                  <Icons.Icon
                    icon={stat.icon}
                    size={22}
                    strokeWidth={2}
                    className="text-white"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </Text>
                <Text className="text-sm text-gray-500">{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Quick Actions
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm font-medium text-indigo-600">
                See all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={16}
                strokeWidth={2}
                className="ml-1 text-indigo-600"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap justify-between gap-3">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(action.route as any)}
                className="w-[23%] items-center rounded-2xl bg-white p-3 shadow-sm"
                activeOpacity={0.7}>
                <View
                  className={`mb-2 h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100`}>
                  <Icons.Icon
                    icon={action.icon}
                    size={26}
                    strokeWidth={2.5}
                    className="text-indigo-600"
                  />
                </View>
                <Text className="text-center text-xs font-semibold text-gray-700">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mt-6 mb-24">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Recent Activity
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(app)/orders')}
              className="flex-row items-center">
              <Text className="text-sm font-medium text-indigo-600">
                View all
              </Text>
              <Icons.Icon
                icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                size={16}
                strokeWidth={2}
                className="ml-1 text-indigo-600"
              />
            </TouchableOpacity>
          </View>
          <View className="space-y-3">
            {[
              {
                id: 1,
                title: 'Order #1234',
                status: 'Delivered',
                time: '2 hours ago',
                icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons,
                color: 'text-green-500',
                bgColor: 'bg-green-50',
              },
              {
                id: 2,
                title: 'Order #1233',
                status: 'In Transit',
                time: '5 hours ago',
                icon: Icons.Hugeicons.TruckDeliveryFreeIcons,
                color: 'text-orange-500',
                bgColor: 'bg-orange-50',
              },
              {
                id: 3,
                title: 'Order #1232',
                status: 'Processing',
                time: '1 day ago',
                icon: Icons.Hugeicons.ShoppingBagFreeIcons,
                color: 'text-blue-500',
                bgColor: 'bg-blue-50',
              },
            ].map(activity => (
              <TouchableOpacity
                key={activity.id}
                className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm"
                activeOpacity={0.7}>
                <View
                  className={`mr-3 h-12 w-12 items-center justify-center rounded-full ${activity.bgColor}`}>
                  <Icons.Icon
                    icon={activity.icon}
                    size={22}
                    strokeWidth={2}
                    className={activity.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {activity.title}
                  </Text>
                  <Text className="text-sm text-gray-500">{activity.time}</Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1.5 ${
                    activity.status === 'Delivered'
                      ? 'bg-green-100'
                      : activity.status === 'In Transit'
                        ? 'bg-orange-100'
                        : 'bg-blue-100'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      activity.status === 'Delivered'
                        ? 'text-green-700'
                        : activity.status === 'In Transit'
                          ? 'text-orange-700'
                          : 'text-blue-700'
                    }`}>
                    {activity.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
