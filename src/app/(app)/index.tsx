import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components';
import { useRouter } from 'expo-router';
import * as Icons from '@/icons';

export default function HomeScreen() {
  const router = useRouter();

  const stats = [
    { label: 'Total Orders', value: '124', icon: Icons.Hugeicons.ShoppingBagFreeIcons, color: 'bg-blue-500' },
    { label: 'Completed', value: '98', icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons, color: 'bg-green-500' },
    { label: 'In Progress', value: '5', icon: Icons.Hugeicons.Time01FreeIcons, color: 'bg-orange-500' },
    { label: 'Earnings', value: '$1,234', icon: Icons.Hugeicons.DollarCircleFreeIcons, color: 'bg-indigo-500' },
  ];

  const quickActions = [
    { label: 'New Order', icon: Icons.Hugeicons.AddCircleFreeIcons, route: '/orders/new' },
    { label: 'Track Order', icon: Icons.Hugeicons.Search01FreeIcons, route: '/orders/track' },
    { label: 'My Profile', icon: Icons.Hugeicons.UserFreeIcons, route: '/profile' },
    { label: 'Support', icon: Icons.Hugeicons.CustomerSupportFreeIcons, route: '/support' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-4 pt-12 shadow-sm">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-500">Welcome back</Text>
            <Text className="text-2xl font-bold text-gray-900">John Doe</Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Icons.Icon
              icon={Icons.Hugeicons.UserFreeIcons}
              size={24}
              strokeWidth={2}
              className="text-gray-600"
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="mt-6">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Overview</Text>
          <View className="flex-row flex-wrap justify-between gap-3">
            {stats.map((stat, index) => (
              <View key={index} className="bg-white w-[48%] rounded-2xl p-4 shadow-sm">
                <View className={`mb-2 h-10 w-10 items-center justify-center rounded-full ${stat.color}`}>
                  <Icons.Icon
                    icon={stat.icon}
                    size={20}
                    strokeWidth={2}
                    className="text-white"
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
                <Text className="text-sm text-gray-500">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-6">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between gap-3">
            {quickActions.map((action, index) => (
              <View key={index} className="bg-white w-[23%] items-center rounded-2xl p-3 shadow-sm">
                <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                  <Icons.Icon
                    icon={action.icon}
                    size={24}
                    strokeWidth={2}
                    className="text-indigo-600"
                  />
                </View>
                <Text className="text-center text-xs font-medium text-gray-700">{action.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-24 mt-6">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Recent Activity</Text>
          <View className="space-y-3">
            {[
              { id: 1, title: 'Order #1234', status: 'Delivered', time: '2 hours ago', icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons, color: 'text-green-500' },
              { id: 2, title: 'Order #1233', status: 'In Transit', time: '5 hours ago', icon: Icons.Hugeicons.Time01FreeIcons, color: 'text-orange-500' },
              { id: 3, title: 'Order #1232', status: 'Processing', time: '1 day ago', icon: Icons.Hugeicons.ShoppingBagFreeIcons, color: 'text-blue-500' },
            ].map((activity) => (
              <View key={activity.id} className="bg-white flex-row items-center rounded-2xl p-4 shadow-sm">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Icons.Icon
                    icon={activity.icon}
                    size={20}
                    strokeWidth={2}
                    className={activity.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{activity.title}</Text>
                  <Text className="text-sm text-gray-500">{activity.time}</Text>
                </View>
                <View className={`rounded-full px-3 py-1 ${
                  activity.status === 'Delivered' ? 'bg-green-100' :
                  activity.status === 'In Transit' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <Text className={`text-xs font-semibold ${
                    activity.status === 'Delivered' ? 'text-green-700' :
                    activity.status === 'In Transit' ? 'text-orange-700' :
                    'text-blue-700'
                  }`}>{activity.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
