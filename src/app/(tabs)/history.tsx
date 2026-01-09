import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, HeaderWithGoBack, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

const timeFilters: { key: TimeFilter; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
];

export default function HistoryScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] =
    React.useState<TimeFilter>('all');
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;

  const user = useQuery(api.users.getCurrentUser);

  const allOrders =
    user?.role === 'delivery'
      ? useQuery(api.orders.getCourierOrders, {
          courierId: user._id,
          limit: 50,
        })
      : useQuery(api.orders.getUserOrders, {
          userId: user?._id,
          limit: 50,
        });

  const deliveredOrders = (allOrders || []).filter(
    order => order.status === 'delivered',
  );
  const totalEarnings = deliveredOrders
    .reduce((sum, order) => sum + order.totalAmount, 0)
    .toFixed(2);

  const renderTimeFilter = (filter: { key: TimeFilter; label: string }) => (
    <TouchableOpacity
      key={filter.key}
      onPress={() => setSelectedTimeFilter(filter.key)}
      className={cn(
        'rounded-xl border px-4 py-1',
        selectedTimeFilter === filter.key
          ? 'border-primary bg-primary'
          : 'border-secondary/10 bg-background-secondary',
      )}>
      <Text
        className={cn(
          'text-sm font-medium',
          selectedTimeFilter === filter.key ? 'text-white' : 'text-gray-700',
        )}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RootWrapper className="px-4">
      <Header />

      <View className="mt-3 flex-row gap-3">
        <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
          <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.DollarCircleFreeIcons}
              size={20}
              strokeWidth={2}
              color={secondary}
            />
          </View>
          <Text className="text-xs font-medium text-gray-500">EARNINGS</Text>
          <Text className="text-lg font-bold text-gray-900">
            ${totalEarnings}
          </Text>
        </View>

        <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
          <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
            <Icons.Icon
              icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
              size={20}
              strokeWidth={2}
              color={primary}
            />
          </View>
          <Text className="text-xs font-medium text-gray-500">DELIVERIES</Text>
          <Text className="text-lg font-bold text-gray-900">
            {deliveredOrders.length}
          </Text>
        </View>
      </View>

      {/* Time Filter */}
      <View className="mt-3">
        <View className="flex-row flex-wrap gap-1">
          {timeFilters.map(renderTimeFilter)}
        </View>
      </View>

      {/* Recent Deliveries */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Recent Deliveries</Text>
        </View>

        {deliveredOrders.length === 0 ? (
          <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
            <Icons.Icon
              icon={Icons.Hugeicons.TruckDeliveryFreeIcons}
              size={40}
              strokeWidth={1.5}
              color={secondary}
            />
            <Text className="mt-3 text-center font-semibold text-gray-900">
              No deliveries yet
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              Your completed deliveries will appear here
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            {deliveredOrders.map(order => (
              <TouchableOpacity
                key={order._id}
                className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <View className="bg-success/10 rounded-full px-2 py-0.5">
                        <Text className="text-success text-xs font-bold capitalize">
                          Delivered
                        </Text>
                      </View>
                    </View>
                    <View className="mt-1 flex-row items-center gap-1">
                      <Icons.Icon
                        icon={Icons.Hugeicons.Package01FreeIcons}
                        size={14}
                        strokeWidth={2}
                        color="#6b7280"
                      />
                      <Text className="text-sm font-medium text-gray-700">
                        {order.item}
                      </Text>
                    </View>
                    <View className="mt-1 flex-row items-center gap-1">
                      <Icons.Icon
                        icon={Icons.Hugeicons.Location01FreeIcons}
                        size={14}
                        strokeWidth={2}
                        color="#9ca3af"
                      />
                      <Text className="flex-1 text-xs text-gray-600">
                        {order.pickupAddress}
                      </Text>
                      <Icons.Icon
                        icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                        size={14}
                        strokeWidth={2}
                        color="#9ca3af"
                      />
                      <Text className="flex-1 text-xs text-gray-600">
                        {order.deliveryAddress}
                      </Text>
                    </View>
                    <Text className="mt-1 text-xs text-gray-400">
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
    </RootWrapper>
  );
}
