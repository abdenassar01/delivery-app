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
import { useCSSVariable } from 'uniwind';

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;

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
          icon: <Icons.Icon icon={Icons.Hugeicons.TruckFreeIcons} />,
          color: 'bg-primary/10 text-primary',
        };
      case 'order_completed':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.CheckmarkBadgeFreeIcons} />,
          color: 'bg-success/10 text-success',
        };
      case 'order_cancelled':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.Cancel01FreeIcons} />,
          color: 'bg-error/10 text-error',
        };
      case 'payment_received':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.DollarCircleFreeIcons} />,
          color: 'bg-secondary/10 text-secondary',
        };
      case 'courier_accepted':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.UserCheckFreeIcons} />,
          color: 'bg-primary/10 text-primary',
        };
      case 'courier_rejected':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.UserBlockFreeIcons} />,
          color: 'bg-error/10 text-error',
        };
      case 'profile_verified':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.Shield01FreeIcons} />,
          color: 'bg-success/10 text-success',
        };
      case 'profile_rejected':
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.Shield01FreeIcons} />,
          color: 'bg-error/10 text-error',
        };
      default:
        return {
          icon: <Icons.Icon icon={Icons.Hugeicons.Notification01FreeIcons} />,
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

      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Notifications</Text>
          {unreadCount && unreadCount.length > 0 ? (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              className="bg-primary/10 rounded-full px-3 py-1">
              <Text className="text-primary text-xs font-semibold">
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primary}
          />
        }>
        {!notifications || notifications.length === 0 ? (
          <View className="border-secondary/10 bg-background-secondary mt-4 items-center justify-center rounded-2xl border p-8">
            <View className="bg-secondary/10 mb-3 h-16 w-16 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.Notification01FreeIcons}
                size={32}
                strokeWidth={1.5}
                color={secondary}
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No notifications
            </Text>
            <Text className="text-center text-sm text-gray-500">
              You're all caught up!
            </Text>
          </View>
        ) : (
          <View className="mt-3 space-y-3">
            {notifications.map(notification => {
              const iconInfo = getNotificationIcon(notification.type);
              return (
                <TouchableOpacity
                  key={notification._id}
                  onPress={() =>
                    !notification.read && handleMarkAsRead(notification._id)
                  }
                  className={cn(
                    'border-secondary/10 bg-background-secondary rounded-2xl border p-4',
                    !notification.read && 'border-primary/30 bg-primary/5',
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
                      {iconInfo.icon}
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-4">
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
                        <View className="flex-row items-center gap-2">
                          {!notification.read && (
                            <TouchableOpacity
                              onPress={() => handleMarkAsRead(notification._id)}
                              className="bg-primary/10 rounded-full px-2.5 py-1">
                              <Text className="text-primary text-xs font-semibold">
                                Mark as read
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => handleDelete(notification._id)}
                            className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <Icons.Icon
                              icon={Icons.Hugeicons.Delete02FreeIcons}
                              size={16}
                              strokeWidth={2}
                              className="text-gray-500"
                            />
                          </TouchableOpacity>
                        </View>
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
