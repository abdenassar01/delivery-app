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
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';
import { Id } from 'convex/_generated/dataModel';

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const notifications = useQuery(api.notifications.getNotifications, {
    limit: 50,
  });
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_assigned':
        return {
          icon: Icons.Hugeicons.ShoppingBagFreeIcons,
          color: 'bg-blue-100 text-blue-600',
        };
      case 'order_completed':
        return {
          icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons,
          color: 'bg-green-100 text-green-600',
        };
      case 'order_cancelled':
        return {
          icon: Icons.Hugeicons.Cancel01FreeIcons,
          color: 'bg-red-100 text-red-600',
        };
      case 'payment_received':
        return {
          icon: Icons.Hugeicons.DollarCircleFreeIcons,
          color: 'bg-emerald-100 text-emerald-600',
        };
      case 'courier_accepted':
        return {
          icon: Icons.Hugeicons.UserCheckFreeIcons,
          color: 'bg-indigo-100 text-indigo-600',
        };
      case 'courier_rejected':
        return {
          icon: Icons.Hugeicons.UserBlockFreeIcons,
          color: 'bg-orange-100 text-orange-600',
        };
      case 'profile_verified':
        return {
          icon: Icons.Hugeicons.Shield01FreeIcons,
          color: 'bg-teal-100 text-teal-600',
        };
      case 'profile_rejected':
        return {
          icon: Icons.Hugeicons.Shield01FreeIcons,
          color: 'bg-red-100 text-red-600',
        };
      default:
        return {
          icon: Icons.Hugeicons.Notification01FreeIcons,
          color: 'bg-gray-100 text-gray-600',
        };
    }
  };

  const handleMarkAsRead = async (notificationId: Id<'notifications'>) => {
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: Id<'notifications'>) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }>
        {!notifications || notifications.length === 0 ? (
          <View className="mt-20 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.Notification01FreeIcons}
                size={36}
                strokeWidth={1.5}
                className="text-gray-400"
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No notifications
            </Text>
            <Text className="text-center text-gray-500">
              You're all caught up!
            </Text>
          </View>
        ) : (
          <View className="mb-24 space-y-3">
            {notifications.map(notification => {
              const iconInfo = getNotificationIcon(notification.type);
              return (
                <TouchableOpacity
                  key={notification._id}
                  onPress={() =>
                    !notification.read && handleMarkAsRead(notification._id)
                  }
                  className={cn(
                    'relative rounded-2xl border bg-white p-4 shadow-sm',
                    !notification.read
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-gray-100',
                  )}
                  activeOpacity={0.7}>
                  {/* Unread indicator */}
                  {!notification.read && (
                    <View className="bg-primary absolute top-2 right-2 h-2.5 w-2.5 rounded-full" />
                  )}

                  <View className="flex-row">
                    <View
                      className={cn(
                        'mr-3 h-12 w-12 shrink-0 items-center justify-center rounded-full',
                        iconInfo.color,
                      )}>
                      <Icons.Icon
                        icon={iconInfo.icon}
                        size={24}
                        strokeWidth={2}
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text
                            className={cn(
                              'text-base font-semibold text-gray-900',
                              !notification.read && 'font-bold',
                            )}
                            numberOfLines={2}>
                            {notification.title}
                          </Text>
                          <Text
                            className="mt-1 text-sm text-gray-600"
                            numberOfLines={2}>
                            {notification.message}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDelete(notification._id)}
                          className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          <Icons.Icon
                            icon={Icons.Hugeicons.Delete02FreeIcons}
                            size={16}
                            strokeWidth={2}
                            className="text-gray-500"
                          />
                        </TouchableOpacity>
                      </View>

                      <View className="mt-2 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-1">
                          <Icons.Icon
                            icon={Icons.Hugeicons.ClockFreeIcons}
                            size={12}
                            strokeWidth={2}
                            className="text-gray-400"
                          />
                          <Text className="text-xs text-gray-400">
                            {formatDistanceToNow(
                              new Date(notification._creationTime),
                              {
                                addSuffix: true,
                              },
                            )}
                          </Text>
                        </View>
                        {!notification.read && (
                          <TouchableOpacity
                            onPress={() => handleMarkAsRead(notification._id)}
                            className="bg-primary/10 rounded-full px-2.5 py-1">
                            <Text className="text-primary text-xs font-semibold">
                              Mark as read
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </RootWrapper>
  );
}
