import React, { ReactNode, useState } from 'react';
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
import { useCSSVariable } from 'uniwind';

type UserRole = 'all' | 'user' | 'admin' | 'delivery';

const filterOptions: { key: UserRole; label: string; icon: ReactNode }[] = [
  {
    key: 'all',
    label: 'All',
    icon: (
      <Icons.Icon
        icon={Icons.Hugeicons.UserGroupFreeIcons}
        size={16}
        strokeWidth={2.5}
      />
    ),
  },
  {
    key: 'user',
    label: 'Users',
    icon: (
      <Icons.Icon
        icon={Icons.Hugeicons.UserCircleFreeIcons}
        size={16}
        strokeWidth={2.5}
      />
    ),
  },
  {
    key: 'admin',
    label: 'Admins',
    icon: (
      <Icons.Icon
        icon={Icons.Hugeicons.Shield01FreeIcons}
        size={16}
        strokeWidth={2.5}
      />
    ),
  },
  {
    key: 'delivery',
    label: 'Couriers',
    icon: (
      <Icons.Icon
        icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
        size={16}
        strokeWidth={2.5}
      />
    ),
  },
];

export default function AdminUsersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<UserRole>('all');
  const secondary = useCSSVariable('--color-secondary') as string;

  const allUsers = useQuery(api.users.getAllUsers, { limit: 100 });
  const updateUserRole = useMutation(api.users.updateUserRole);

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
    <RootWrapper className="flex-1 px-4">
      <HeaderWithGoBack />
      <View className="my-3">
        <Text className="text-2xl font-medium text-gray-900">Manage Users</Text>
        <Text className="text-sm text-gray-500">
          {filteredUsers.length} users total
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="mb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-1">
            {filterOptions.map(filter => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={cn(
                  'flex-row items-center gap-1 rounded-xl border px-4 py-1',
                  selectedFilter === filter.key
                    ? 'border-primary bg-primary'
                    : 'border-secondary/10 bg-background-secondary',
                )}>
                {filter.icon}
                <Text
                  className={cn(
                    'text-sm font-medium',
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

      {!allUsers || allUsers.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="bg-primary/10 mb-4 h-20 w-20 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.UserFreeIcons}
              size={36}
              strokeWidth={1.5}
              className="text-primary"
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
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4">
          <View className="gap-3">
            {filteredUsers.map(user => (
              <View
                key={user._id}
                className="border-secondary/10 bg-background-secondary rounded-2xl border p-2">
                {/* User Header */}
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-secondary h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br">
                      <Text className="text-lg font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-bold text-gray-900">
                        {user.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {user.email}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={cn(
                      'flex-row items-center gap-1 rounded-xl border px-3 py-1',
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
                      color={secondary}
                    />
                    <Text className="text-sm text-gray-600">
                      Balance: ${user.balance?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icons.Icon
                      icon={
                        user.isEnabled
                          ? Icons.Hugeicons.CheckmarkBadgeFreeIcons
                          : Icons.Hugeicons.Cancel01FreeIcons
                      }
                      size={14}
                      strokeWidth={2}
                      color={user.isEnabled ? '#22c55e' : '#ef4444'}
                    />
                    <Text className="text-sm text-gray-600">
                      {user.isEnabled ? 'Active' : 'Disabled'}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="border-secondary/10 flex-row gap-2 border-t pt-3">
                  <TouchableOpacity
                    onPress={() =>
                      handleRoleChange(
                        user._id,
                        user.role === 'user' ? 'delivery' : 'user',
                      )
                    }
                    className="bg-primary/10 flex-1 flex-row items-center justify-center rounded-xl px-3 py-2">
                    <Text className="text-primary text-xs font-bold">
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
                    className="bg-secondary/10 flex-1 flex-row items-center justify-center rounded-xl px-3 py-2">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Shield01FreeIcons}
                      size={14}
                      strokeWidth={2}
                      color={secondary}
                    />
                    <Text className="text-secondary ml-1 text-xs font-bold">
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </RootWrapper>
  );
}
