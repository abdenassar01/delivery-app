import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Header, Map, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { formatDistanceToNow } from 'date-fns';

type OrderStatus = 'all' | 'pending' | 'in-transit' | 'delivered';

const filters: { key: OrderStatus; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }[] = [
  { key: 'all', label: 'All', icon: 'apps' },
  { key: 'pending', label: 'Pending', icon: 'schedule' },
  { key: 'in-transit', label: 'In Transit', icon: 'local-shipping' },
  { key: 'delivered', label: 'Delivered', icon: 'check-circle' },
];

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = React.useState<OrderStatus>('all');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#da910e';
      case 'in-transit':
        return '#00615d';
      case 'delivered':
        return '#4bfc28';
      default:
        return '#9ca3af';
    }
  };

  const getStatusIcon = (status: string): React.ComponentProps<typeof MaterialIcons>['name'] => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'in-transit':
        return 'local-shipping';
      case 'delivered':
        return 'check-circle';
      default:
        return 'shopping-bag';
    }
  };

  const filteredOrders = (allOrders || []).filter(order => {
    return selectedFilter === 'all' || order.status === selectedFilter;
  });

  // Render filter
  const renderFilter = (filter: { key: OrderStatus; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }) => (
    <TouchableOpacity
      key={filter.key}
      onPress={() => setSelectedFilter(filter.key)}
      className={`flex-row items-center rounded-full border-2 px-3 py-2 ${
        selectedFilter === filter.key
          ? 'border-primary bg-primary'
          : 'border-gray-200 bg-white'
      }`}>
      <MaterialIcons
        name={filter.icon}
        size={16}
        color={selectedFilter === filter.key ? 'white' : '#6b7280'}
      />
      <Text
        className={`ml-1 text-sm font-bold ${
          selectedFilter === filter.key ? 'text-white' : 'text-gray-700'
        }`}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RootWrapper className="px-4">
      <Header />

      {/* Filters */}
      <View className="my-3">
        <View className="flex-row flex-wrap gap-2">
          {filters.map(renderFilter)}
        </View>
      </View>

      {/* Orders List */}
      <View className="border-primary/30 bg-primary/10 my-3 rounded-xl border p-2">
        <Text className="mb-2 px-1 text-base font-bold text-primary">
          Orders ({filteredOrders.length})
        </Text>
        {filteredOrders.length === 0 ? (
          <View className="items-center rounded-xl bg-white p-6">
            <MaterialIcons name="search" size={40} color="#9ca3af" />
            <Text className="mt-2 text-center font-semibold text-gray-900">
              No orders found
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              No orders match this filter
            </Text>
          </View>
        ) : (
          <Map
            items={filteredOrders}
            render={(order, index) => (
              <>
                <TouchableOpacity className="rounded-xl border border-gray-200 bg-white p-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name={getStatusIcon(order.status)}
                        size={20}
                        color={getStatusColor(order.status)}
                      />
                      <Text className="font-bold text-gray-900">
                        {order.orderNumber}
                      </Text>
                    </View>
                    <View
                      className="rounded-full border px-2 py-0.5"
                      style={{
                        borderColor: `${getStatusColor(order.status)}40`,
                        backgroundColor: `${getStatusColor(order.status)}15`,
                      }}>
                      <Text className="text-xs font-bold capitalize" style={{ color: getStatusColor(order.status) }}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-1 flex-row items-center gap-1">
                    <MaterialIcons name="inventory-2" size={14} color="#6b7280" />
                    <Text className="flex-1 text-sm font-medium text-gray-700">
                      {order.item}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="location-on" size={16} color="#9ca3af" />
                    <Text className="flex-1 text-sm text-gray-600">
                      {order.pickupAddress}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#9ca3af" />
                    <Text className="flex-1 text-sm text-gray-600">
                      {order.deliveryAddress}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row items-center justify-between border-t border-gray-100 pt-2">
                    <Text className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(order._creationTime), { addSuffix: true })}
                    </Text>
                    <Text className="text-lg font-bold" style={{ color: primary }}>
                      ${order.totalAmount}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index !== filteredOrders.length - 1 && (
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
