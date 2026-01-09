import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, RootWrapper, Text, RatingModal } from '@/components';
import { useCSSVariable } from 'uniwind';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered';

const filters: { key: OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] =
    React.useState<OrderStatus>('all');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-primary bg-primary/10';
      case 'in-transit':
        return 'text-secondary bg-secondary/10';
      case 'delivered':
        return 'text-success bg-success/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const filteredOrders = (allOrders || []).filter(order => {
    return selectedFilter === 'all' || order.status === selectedFilter;
  });

  const renderFilter = (filter: { key: OrderStatus; label: string }) => (
    <TouchableOpacity
      key={filter.key}
      onPress={() => setSelectedFilter(filter.key)}
      className={cn(
        'rounded-full border px-4 py-1',
        selectedFilter === filter.key
          ? 'border-primary bg-primary'
          : 'border-secondary/10 bg-background-secondary',
      )}>
      <Text
        className={cn(
          'text-sm font-medium',
          selectedFilter === filter.key ? 'text-white' : 'text-gray-700',
        )}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RootWrapper className="px-4">
      <Header />

      {/* Filters */}
      <View className="mt-3">
        <View className="flex-row flex-wrap gap-1">
          {filters.map(renderFilter)}
        </View>
      </View>

      {/* Orders List */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">
            Orders ({filteredOrders.length})
          </Text>
        </View>

        {filteredOrders.length === 0 ? (
          <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
            <Icons.Icon
              icon={Icons.Hugeicons.Search01FreeIcons}
              size={40}
              strokeWidth={1.5}
              color={secondary}
            />
            <Text className="mt-3 text-center font-semibold text-gray-900">
              No orders found
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              No orders match this filter
            </Text>
          </View>
        ) : (
          <View className="mt-2">
            {filteredOrders.map(order => (
              <View
                key={order._id}
                className="border-secondary/10 mb-2 rounded-2xl border bg-white p-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                      <View
                        className={`rounded-full px-2 py-0.5 ${getStatusColor(order.status)}`}>
                        <Text
                          className={`text-xs font-bold capitalize ${getStatusColor(order.status).split(' ')[0]}`}>
                          {order.status}
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

                    {/* Show rating if already delivered */}
                    {order.status === 'delivered' && order.rating && (
                      <View className="mt-2 flex-row items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icons.Icon
                            key={i}
                            icon={Icons.Hugeicons.StarFreeIcons}
                            size={14}
                            strokeWidth={0}
                            fill={i < order.rating! ? primary : '#d1d5db'}
                            color={i < order.rating! ? primary : '#d1d5db'}
                          />
                        ))}
                        <Text className="ml-1 text-xs text-gray-600">
                          ({order.rating}/5)
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="items-end gap-2">
                    <Text className="text-secondary text-base font-bold">
                      {order.totalAmount} DH
                    </Text>

                    {/* Show rating button for in-transit orders (user only) */}
                    {user?.role !== 'delivery' &&
                      order.status === 'in-transit' && (
                        <RatingModal orderId={order._id} />
                      )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </RootWrapper>
  );
}
