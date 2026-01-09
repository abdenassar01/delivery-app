import { TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import {
  HeaderWithGoBack,
  RootWrapper,
  Text,
  AddBalanceModal,
} from '@/components';
import { useCSSVariable } from 'uniwind';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { cn } from '@/lib';
import { formatDistanceToNow } from 'date-fns';

type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'payment' | 'earning';

const filters: { key: TransactionType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposits' },
  { key: 'withdrawal', label: 'Withdrawals' },
  { key: 'payment', label: 'Payments' },
  { key: 'earning', label: 'Earnings' },
];

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] =
    React.useState<TransactionType>('all');
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;

  const user = useQuery(api.users.getCurrentUser);
  const transactions = useQuery(api.transactions.getUserTransactions, {
    limit: 50,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'rejected':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-success bg-success/10';
      case 'withdrawal':
        return 'text-error bg-error/10';
      case 'payment':
        return 'text-warning bg-warning/10';
      case 'earning':
        return 'text-primary bg-primary/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return Icons.Hugeicons.ArrowDown01FreeIcons;
      case 'withdrawal':
        return Icons.Hugeicons.ArrowUp01FreeIcons;
      case 'payment':
        return Icons.Hugeicons.CreditCardFreeIcons;
      case 'earning':
        return Icons.Hugeicons.DollarCircleFreeIcons;
      default:
        return Icons.Hugeicons.ReceiptDollarFreeIcons;
    }
  };

  const filteredTransactions = (transactions || []).filter(transaction => {
    return selectedFilter === 'all' || transaction.type === selectedFilter;
  });

  const renderFilter = (filter: { key: TransactionType; label: string }) => (
    <TouchableOpacity
      key={filter.key}
      onPress={() => setSelectedFilter(filter.key)}
      className={cn(
        'flex-row items-center rounded-xl border px-3 py-1.5',
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
      <HeaderWithGoBack />
      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="bg-secondary/10 mb-2 h-12 w-12 items-center justify-center rounded-xl">
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
              {user?.balance?.toFixed(2) || '0.00'} DH
            </Text>
          </View>
          <AddBalanceModal onSuccess={() => {}} />
        </View>
      </View>

      <View className="mt-3">
        <View className="flex-row flex-wrap gap-1">
          {filters.map(renderFilter)}
        </View>
      </View>

      {/* Transactions */}
      <View className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Transactions</Text>
          <Text className="text-sm text-gray-500">
            {filteredTransactions.length} transactions
          </Text>
        </View>

        {filteredTransactions.length === 0 ? (
          <View className="border-secondary/10 bg-background-secondary mt-2 items-center justify-center rounded-2xl border p-8">
            <Icons.Icon
              icon={Icons.Hugeicons.ReceiptDollarFreeIcons}
              size={40}
              strokeWidth={1.5}
              color={secondary}
            />
            <Text className="mt-3 text-center font-semibold text-gray-900">
              No transactions yet
            </Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              Your transaction history will appear here
            </Text>
          </View>
        ) : (
          <ScrollView className="mt-2" showsVerticalScrollIndicator={false}>
            {filteredTransactions.map(transaction => (
              <View
                key={transaction._id}
                className="border-secondary/10 bg-background-secondary mb-2 rounded-2xl border p-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <View
                        className={cn(
                          'rounded-xl border px-2 py-0.5',
                          getTypeColor(transaction.type),
                        )}>
                        <Text
                          className={cn(
                            'text-xs font-bold capitalize',
                            getTypeColor(transaction.type).split(' ')[0],
                          )}>
                          {transaction.type}
                        </Text>
                      </View>
                      <View
                        className={cn(
                          'rounded-xl border px-2 py-0.5',
                          getStatusColor(transaction.status),
                        )}>
                        <Text
                          className={cn(
                            'text-xs font-bold capitalize',
                            getStatusColor(transaction.status).split(' ')[0],
                          )}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-1 flex-row items-center gap-1">
                      <Icons.Icon
                        icon={getTypeIcon(transaction.type)}
                        size={14}
                        strokeWidth={2}
                        color="#6b7280"
                      />
                      <Text className="text-sm font-medium text-gray-700">
                        {transaction.description}
                      </Text>
                    </View>

                    {transaction.proofUrl && (
                      <View className="mt-2">
                        <Text className="mb-1 text-xs text-gray-500">
                          Proof Document
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Icons.Icon
                            icon={Icons.Hugeicons.File01FreeIcons}
                            size={14}
                            strokeWidth={2}
                            color={primary}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              /* Handle opening proof */
                            }}>
                            <Text className="text-primary text-xs font-medium">
                              View Document
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    <Text className="mt-1 text-xs text-gray-400">
                      {formatDistanceToNow(
                        new Date(transaction._creationTime),
                        {
                          addSuffix: true,
                        },
                      )}
                    </Text>
                  </View>

                  <View
                    className={cn(
                      'text-base font-bold',
                      transaction.type === 'deposit' ||
                        transaction.type === 'earning'
                        ? 'text-success'
                        : transaction.type === 'withdrawal' ||
                            transaction.type === 'payment'
                          ? 'text-error'
                          : 'text-gray-900',
                    )}>
                    {transaction.type === 'deposit' ||
                    transaction.type === 'earning'
                      ? '+'
                      : '-'}
                    {transaction.amount.toFixed(2)} DH
                  </View>
                </View>
              </View>
            ))}
            <View className="h-4" />
          </ScrollView>
        )}
      </View>

      {/* Info Section */}
      <View className="bg-primary/5 mt-4 rounded-xl p-3">
        <View className="mb-2 flex-row items-center gap-2">
          <Icons.Icon
            icon={Icons.Hugeicons.InformationCircleFreeIcons}
            size={16}
            strokeWidth={2}
            color={primary}
          />
          <Text className="text-primary text-sm font-semibold">
            How it works
          </Text>
        </View>
        <Text className="text-xs leading-relaxed text-gray-600">
          1. Tap "Add Balance" to deposit funds{'\n'}
          2. Enter the amount and upload your bank transfer receipt{'\n'}
          3. Submit for review{'\n'}
          4. Your deposit will be approved within 1-2 business days
        </Text>
      </View>
    </RootWrapper>
  );
}
