import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import type { Doc } from 'convex/_generated/dataModel';
import { useCSSVariable } from 'uniwind';

interface AdminHomeScreenProps {
  user: Doc<'users'> | null | undefined;
}

export function AdminHomeScreen({ user }: AdminHomeScreenProps) {
  const router = useRouter();
  const recentOrders = useQuery(api.orders.getRecentOrders, { limit: 10 });
  const stats = useQuery(api.stats.getAdminStats);
  const secondary = useCSSVariable('--color-secondary') as string;
  const primary = useCSSVariable('--color-primary') as string;

  return (
    <RootWrapper className="px-4">
      {/* Header */}
      <View className="mt-3 mb-4">
        <Text className="text-sm font-medium text-gray-500">Welcome back,</Text>
        <Text className="text-2xl font-bold text-gray-900">
          {user?.name || 'Admin'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="mb-4 flex-row gap-3">
          <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.TeamviewerFreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Total Users
            </Text>
            <Text className="mt-1 text-lg font-bold text-gray-900">
              {stats?.totalUsers || 0}
            </Text>
          </View>

          <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={20}
                strokeWidth={2}
                color={primary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Total Orders
            </Text>
            <Text className="mt-1 text-lg font-bold text-gray-900">
              {stats?.totalOrders || 0}
            </Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-3">
          <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Active Couriers
            </Text>
            <Text className="mt-1 text-lg font-bold text-gray-900">
              {stats?.activeCouriers || 0}
            </Text>
          </View>

          <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
            <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.DollarCircleFreeIcons}
                size={20}
                strokeWidth={2}
                color={primary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">Revenue</Text>
            <Text className="mt-1 text-lg font-bold text-gray-900">
              ${stats?.totalRevenue || 0}
            </Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-medium">Recent Orders</Text>
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
                color={secondary}
              />
            </TouchableOpacity>
          </View>

          {!recentOrders || recentOrders.length === 0 ? (
            <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
              <Icons.Icon
                icon={Icons.Hugeicons.ShoppingBagFreeIcons}
                size={40}
                strokeWidth={1.5}
                color={secondary}
              />
              <Text className="mt-3 text-center font-semibold text-gray-900">
                No orders yet
              </Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Orders will appear here
              </Text>
            </View>
          ) : (
            <View className="mt-2">
              {recentOrders.slice(0, 5).map(order => (
                <TouchableOpacity
                  key={order._id}
                  className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
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
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-medium">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/app/admin/users' as any)}
              className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
              <View className="bg-primary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.UserAdd01FreeIcons}
                  size={20}
                  strokeWidth={2}
                  color={primary}
                />
              </View>
              <Text className="mt-2 text-sm font-semibold text-gray-900">
                Manage Users
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin/orders' as any)}
              className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
              <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.File01FreeIcons}
                  size={20}
                  strokeWidth={2}
                  color={secondary}
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
