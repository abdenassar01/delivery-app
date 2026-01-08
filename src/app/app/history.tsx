import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, Map, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { formatDistanceToNow } from 'date-fns';

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

  const user = useQuery(api.users.getCurrentUser);

  // Get orders based on user role
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

  // Calculate stats
  const deliveredOrders = (allOrders || []).filter(
    order => order.status === 'delivered',
  );
  const totalEarnings = deliveredOrders
    .reduce((sum, order) => sum + order.totalAmount, 0)
    .toFixed(2);

  // Render time filter
  const renderTimeFilter = (filter: { key: TimeFilter; label: string }) => (
    <TouchableOpacity
      key={filter.key}
      onPress={() => setSelectedTimeFilter(filter.key)}
      className={`rounded-full border-2 px-4 py-2 ${
        selectedTimeFilter === filter.key
          ? 'border-primary bg-primary'
          : 'border-gray-200 bg-white'
      }`}>
      <Text
        className={`text-sm font-bold ${
          selectedTimeFilter === filter.key ? 'text-white' : 'text-gray-700'
        }`}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RootWrapper className="px-4">
      <Header />

      {/* Summary Cards */}
      <View className="my-3 flex-row gap-3">
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-3">
          <View className="mb-1 flex-row items-center gap-1">
            <MaterialIcons name="payments" size={16} color={primary} />
            <Text className="text-xs font-medium text-gray-500">
              EARNINGS
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">
            ${totalEarnings}
          </Text>
        </View>

        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-3">
          <View className="mb-1 flex-row items-center gap-1">
            <MaterialIcons name="local-shipping" size={16} color={primary} />
            <Text className="text-xs font-medium text-gray-500">
              DELIVERIES
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {deliveredOrders.length}
          </Text>
        </View>
      </View>

      {/* Time Filter */}
      <View className="my-3">
        <View className="flex-row gap-2">
          {timeFilters.map(renderTimeFilter)}
        </View>
      </View>

      {/* Recent Deliveries */}
      <View className="border-primary/30 bg-primary/10 my-3 rounded-xl border p-2">
        <Text className="mb-2 px-1 text-base font-bold text-primary">
          Recent Deliveries
        </Text>
        {deliveredOrders.length === 0 ? (
          <View className="items-center rounded-xl bg-white p-6">
            <MaterialIcons name="local-shipping" size={40} color="#9ca3af" />
            <Text className="mt-2 text-center font-semibold text-gray-900">
              No deliveries yet
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              Your completed deliveries will appear here
            </Text>
          </View>
        ) : (
          <Map
            items={deliveredOrders}
            render={(order, index) => (
              <>
                <TouchableOpacity className="rounded-xl border border-gray-200 bg-white p-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1">
                        <Text className="font-bold text-gray-900">
                          {order.orderNumber}
                        </Text>
                        <View className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        <Text className="text-sm text-gray-500">
                          {formatDistanceToNow(
                            new Date(order._creationTime),
                            {
                              addSuffix: true,
                            },
                          )}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-lg font-bold text-primary">
                      ${order.totalAmount}
                    </Text>
                  </View>

                  <View className="mb-1 flex-row items-center gap-1">
                    <MaterialIcons
                      name="inventory-2"
                      size={14}
                      color="#6b7280"
                    />
                    <Text className="flex-1 text-sm font-medium text-gray-700">
                      {order.item}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="location-on" size={16} color="#9ca3af" />
                    <Text className="flex-1 text-sm text-gray-600">
                      {order.pickupAddress}
                    </Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#9ca3af"
                    />
                    <Text className="flex-1 text-sm text-gray-600">
                      {order.deliveryAddress}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index !== deliveredOrders.length - 1 && (
                  <View className="bg-primary/30 my-2 h-[0.5px] w-[90%] self-end rounded-full" />
                )}
              </>
            )}
          />
        )}
      </View>
    </RootWrapper>
  );
}
