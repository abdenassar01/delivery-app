import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootWrapper, Text } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';
import { Id } from 'convex/_generated/dataModel';

type UserRole = 'all' | 'user' | 'admin' | 'delivery';

export default function AdminUsersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<UserRole>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters: { key: UserRole; label: string; icon: any }[] = [
    { key: 'all', label: 'All', icon: Icons.Hugeicons.SquareFreeIcons },
    { key: 'user', label: 'Users', icon: Icons.Hugeicons.UserFreeIcons },
    {
      key: 'admin',
      label: 'Admins',
      icon: Icons.Hugeicons.Shield01FreeIcons,
    },
    {
      key: 'delivery',
      label: 'Couriers',
      icon: Icons.Hugeicons.TruckDeliveryFreeIcons,
    },
  ];

  const allUsers = useQuery(api.users.getAllUsers, { limit: 100 });
  const updateUserRole = useMutation(api.users.updateUserRole);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRoleChange = async (
    userId: Id<'users'>,
    newRole: 'user' | 'admin' | 'delivery',
  ) => {
    try {
      await updateUserRole({ id: userId, role: newRole });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-error/10 text-error border-error/20';
      case 'delivery':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Icons.Hugeicons.Shield01FreeIcons;
      case 'delivery':
        return Icons.Hugeicons.TruckDeliveryFreeIcons;
      default:
        return Icons.Hugeicons.UserFreeIcons;
    }
  };

  const filteredUsers =
    allUsers?.filter(user => {
      if (selectedFilter === 'all') return true;
      return user.role === selectedFilter;
    }) || [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 shadow-sm">
        <View className="mb-4">
          <HeaderWithGoBack />
        </View>
        <Text className="text-2xl font-bold text-gray-900">Manage Users</Text>
        <Text className="text-sm text-gray-500">
          {filteredUsers.length} users total
        </Text>
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

      {/* Users List */}
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
        {!allUsers || allUsers.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.UserFreeIcons}
                size={36}
                strokeWidth={1.5}
                className="text-gray-400"
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No users found
            </Text>
            <Text className="text-center text-gray-500">
              Users will appear here
            </Text>
          </View>
        ) : (
          filteredUsers.map(user => (
            <TouchableOpacity
              key={user._id}
              className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {/* User Header */}
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                    <Text className="text-lg font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-gray-900">{user.name}</Text>
                    <Text className="text-sm text-gray-500">{user.email}</Text>
                  </View>
                </View>
                <View
                  className={cn(
                    'flex-row items-center gap-1 rounded-full border px-3 py-1',
                    getRoleBadgeColor(user.role),
                  )}>
                  <Icons.Icon
                    icon={getRoleIcon(user.role)}
                    size={12}
                    strokeWidth={2.5}
                    className={cn(
                      user.role === 'admin'
                        ? 'text-error'
                        : user.role === 'delivery'
                          ? 'text-secondary'
                          : 'text-primary',
                    )}
                  />
                  <Text className="text-xs font-bold capitalize">
                    {user.role}
                  </Text>
                </View>
              </View>

              {/* User Details */}
              <View className="mb-3 flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Icons.Icon
                    icon={Icons.Hugeicons.Wallet03FreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="text-gray-400"
                  />
                  <Text className="text-sm text-gray-600">
                    Balance: ${user.balance?.toFixed(2) || '0.00'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icons.Icon
                    icon={user.isEnabled
                      ? Icons.Hugeicons.CheckmarkBadgeFreeIcons
                      : Icons.Hugeicons.Cancel01FreeIcons}
                    size={14}
                    strokeWidth={2}
                    className={user.isEnabled ? 'text-success' : 'text-error'}
                  />
                  <Text className="text-sm text-gray-600">
                    {user.isEnabled ? 'Active' : 'Disabled'}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2 border-t border-gray-100 pt-3">
                <TouchableOpacity
                  onPress={() =>
                    handleRoleChange(
                      user._id,
                      user.role === 'user' ? 'delivery' : 'user',
                    )
                  }
                  className="flex-1 flex-row items-center justify-center rounded-xl bg-primary/10 px-3 py-2">
                  <Text className="text-xs font-bold text-primary">
                    {user.role === 'user' ? 'Make Courier' : 'Make User'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleRoleChange(
                      user._id,
                      user.role === 'admin' ? 'user' : 'admin',
                    )
                  }
                  className="flex-1 flex-row items-center justify-center rounded-xl bg-secondary/10 px-3 py-2">
                  <Icons.Icon
                    icon={Icons.Hugeicons.Shield01FreeIcons}
                    size={14}
                    strokeWidth={2}
                    className="mr-1 text-secondary"
                  />
                  <Text className="text-xs font-bold text-secondary">
                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
