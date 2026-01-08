import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { HeaderWithGoBack, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';

export default function PaymentMethodsScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const user = useQuery(api.users.getCurrentUser);

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.CreditCardFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      isDefault: true,
    },
  ];

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-lg font-medium">Payment Methods</Text>
        <TouchableOpacity className="bg-primary flex-row items-center gap-1 rounded-full px-3 py-1.5">
          <Icons.Icon
            icon={Icons.Hugeicons.AddCircleFreeIcons}
            size={16}
            strokeWidth={2}
            color="white"
          />
          <Text className="text-xs font-semibold text-white">Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.Wallet03FreeIcons}
                size={20}
                strokeWidth={2}
                color={secondary}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500">
              Wallet Balance
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              ${user?.balance || '0.00'}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Methods */}
      <View className="mt-3">
        <Text className="text-sm font-medium text-gray-500">
          Saved Payment Methods
        </Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-2 rounded-2xl border p-2">
        {paymentMethods.length === 0 ? (
          <View className="items-center py-8">
            <View className="bg-secondary/10 mb-3 h-16 w-16 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.CreditCardFreeIcons}
                size={32}
                strokeWidth={1.5}
                color={secondary}
              />
            </View>
            <Text className="text-center font-semibold text-gray-900">
              No payment methods
            </Text>
            <Text className="text-center text-sm text-gray-500">
              Add a card or payment method for easy checkout
            </Text>
          </View>
        ) : (
          <View>
            {paymentMethods.map((method, index) => (
              <React.Fragment key={method.id}>
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    {method.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">
                      {method.name}
                    </Text>
                  </View>
                  {method.isDefault && (
                    <View className="bg-primary/10 rounded-full px-2 py-1">
                      <Text className="text-primary text-xs font-semibold">
                        Default
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {index < paymentMethods.length - 1 && (
                  <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />
                )}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>

      <View className="mt-4">
        <Text className="text-xs text-gray-500">
          Your payment information is securely stored and encrypted.
        </Text>
      </View>
    </RootWrapper>
  );
}
