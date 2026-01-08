import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc } from 'convex/_generated/dataModel';

interface AdminHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function AdminHomeScreen({ user }: AdminHomeScreenProps) {
  const router = useRouter();
  const recentOrders = useQuery(api.orders.getRecentOrders, { limit: 10 });
  const stats = useQuery(api.stats.getAdminStats);

  return (
    <RootWrapper className="px-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium capitalize text-gray-500">
            Welcome back,
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || 'Admin'}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="mb-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.TeamviewerFreeIcons}
                size={20}
                strokeWidth={2}
                className="text-secondary"
              />
            </View>
            <Text className="mt-2 text-xs font-medium text-gray-500">
              Total Users
            </Text>
            <Text className="mt-1 text-xl font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={20}
                strokeWidth={2}
                className="text-primary"
              />
            </View>
            <Text className="mt-2 text-xs font-medium text-gray-500">
              Total Orders
            </Text>
            <Text className="mt-1 text-xl font-bold text-gray-900">
              {stats?.totalOrders || 0}
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={20}
                strokeWidth={2}
                className="text-secondary"
              />
            </View>
            <Text className="mt-2 text-xs font-medium text-gray-500">
              Active Couriers
            </Text>
            <Text className="mt-1 text-xl font-bold text-gray-900">
              {stats?.activeCouriers || 0}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.DollarCircleFreeIcons}
                size={20}
                strokeWidth={2}
                className="text-primary"
              />
            </View>
            <Text className="mt-2 text-xs font-medium text-gray-500">
              Revenue
            </Text>
            <Text className="mt-1 text-xl font-bold text-gray-900">
              ${stats?.totalRevenue || 0}
            </Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              Recent Orders
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/admin/orders' as any)}
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

          {!recentOrders || recentOrders.length === 0 ? (
            <View className="mt-6 items-center justify-center rounded-2xl border border-gray-100 bg-white p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={40}
                strokeWidth={1.5}
                className="text-gray-300"
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No orders yet
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Orders will appear here
              </Text>
            </View>
          ) : (
            recentOrders.slice(0, 5).map(order => (
              <TouchableOpacity
                key={order._id}
                className="mb-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <View
                        className={`rounded-full px-2 py-0.5 ${
                          order.status === 'pending'
                            ? 'bg-primary/10'
                            : order.status === 'in-transit'
                              ? 'bg-secondary/10'
                              : 'bg-success/10'
                        }`}>
                        <Text
                          className={`text-xs font-bold capitalize ${
                            order.status === 'pending'
                              ? 'text-primary'
                              : order.status === 'in-transit'
                                ? 'text-secondary'
                                : 'text-success'
                          }`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="mt-1 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(order._creationTime), {
                        addSuffix: true,
                      })}
                    </Text>
                  </View>
                  <Text className="text-secondary text-base font-bold">
                    ${order.totalAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-bold text-gray-900">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/admin/users' as any)}
              className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.UserAdd01FreeIcons}
                  size={20}
                  strokeWidth={2}
                  className="text-primary"
                />
              </View>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                Manage Users
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin/orders' as any)}
              className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.File01FreeIcons}
                  size={20}
                  strokeWidth={2}
                  className="text-secondary"
                />
              </View>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                All Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </RootWrapper>
  );
}
