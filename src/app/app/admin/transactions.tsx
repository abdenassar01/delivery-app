import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { RootWrapper, Text, Modal, useModal } from '@/components';
import * as Icons from '@/icons';
import { cn } from '@/lib';
import { useQuery, useMutation } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack } from '@/components/common/layout-helper/header';
import { Id } from 'convex/_generated/dataModel';
import { useCSSVariable } from 'uniwind';
import { toast } from '@/lib';

type TransactionStatus = 'all' | 'pending' | 'approved' | 'rejected';

type TransactionDetailModalProps = {
  transaction: any;
  onApprove: (transactionId: Id<'transactions'>) => void;
  onReject: (transactionId: Id<'transactions'>) => void;
  isProcessing: boolean;
};

function TransactionDetailModal({
  transaction,
  onApprove,
  onReject,
  isProcessing,
}: TransactionDetailModalProps) {
  const { ref, dismiss } = useModal();
  const primary = useCSSVariable('--color-primary') as string;

  const handleApprove = () => {
    onApprove(transaction._id);
    dismiss();
  };

  const handleReject = () => {
    onReject(transaction._id);
    dismiss();
  };

  const openProofUrl = () => {
    if (transaction.proofUrl) {
      Linking.openURL(transaction.proofUrl);
    }
  };

  return (
    <Modal ref={ref} snapPoints={['70%']} detached>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Transaction Details
              </Text>
              <Text className="text-sm text-gray-500">
                {transaction.orderNumber || 'Deposit Request'}
              </Text>
            </View>
            <TouchableOpacity onPress={dismiss} hitSlop={10}>
              <Icons.Icon
                icon={Icons.Hugeicons.CancelCircleFreeIcons}
                size={20}
                strokeWidth={1.5}
                color={primary}
              />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-gray-700">
              User Information
            </Text>
            <View className="border-secondary/10 rounded-xl border p-3">
              <View className="mb-2 flex-row items-center gap-3">
                <View className="bg-secondary h-10 w-10 items-center justify-center rounded-xl">
                  <Text className="text-base font-bold text-white">
                    {transaction.userName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text className="font-bold text-gray-900">
                    {transaction.userName}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {transaction.userEmail}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amount */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-gray-700">Amount</Text>
            <View className="border-secondary/10 rounded-xl border p-3">
              <Text className="text-2xl font-bold text-gray-900">
                {transaction.amount} DH
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-gray-700">
              Description
            </Text>
            <View className="border-secondary/10 rounded-xl border p-3">
              <Text className="text-sm text-gray-700">
                {transaction.description}
              </Text>
            </View>
          </View>

          {/* Proof Document */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-gray-700">
              Proof Document
            </Text>
            {transaction.proofUrl ? (
              <TouchableOpacity
                onPress={openProofUrl}
                className="border-secondary/10 flex-row items-center gap-2 rounded-xl border p-3">
                <Icons.Icon
                  icon={Icons.Hugeicons.FileFreeIcons}
                  size={20}
                  strokeWidth={2}
                  color={primary}
                />
                <Text className="text-primary text-sm font-semibold">
                  View Proof Document
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="border-secondary/10 rounded-xl border p-3">
                <Text className="text-sm text-gray-500">No proof provided</Text>
              </View>
            )}
          </View>

          {/* Status */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-bold text-gray-700">Status</Text>
            <View
              className={cn(
                'rounded-xl border px-3 py-2',
                transaction.status === 'pending'
                  ? 'bg-primary/10 border-primary/20'
                  : transaction.status === 'approved'
                    ? 'bg-success/10 border-success/20'
                    : 'bg-error/10 border-error/20',
              )}>
              <Text
                className={cn(
                  'text-sm font-bold capitalize',
                  transaction.status === 'pending'
                    ? 'text-primary'
                    : transaction.status === 'approved'
                      ? 'text-success'
                      : 'text-error',
                )}>
                {transaction.status}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {transaction.status === 'pending' && (
            <View className="gap-2">
              <TouchableOpacity
                onPress={handleApprove}
                disabled={isProcessing}
                className="bg-success flex-row items-center justify-center rounded-xl px-4 py-3">
                <Icons.Icon
                  icon={Icons.Hugeicons.CheckmarkBadgeFreeIcons}
                  size={18}
                  strokeWidth={2}
                  color="white"
                />
                <Text className="ml-2 text-base font-bold text-white">
                  Approve Deposit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReject}
                disabled={isProcessing}
                className="bg-error flex-row items-center justify-center rounded-xl px-4 py-3">
                <Icons.Icon
                  icon={Icons.Hugeicons.Cancel01FreeIcons}
                  size={18}
                  strokeWidth={2}
                  color="white"
                />
                <Text className="ml-2 text-base font-bold text-white">
                  Reject Deposit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}

export default function AdminTransactionsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<TransactionStatus>('pending');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const primary = useCSSVariable('--color-primary') as string;

  const filters: { key: TransactionStatus; label: string; icon: any }[] = [
    {
      key: 'all',
      label: 'All',
      icon: Icons.Hugeicons.ListFreeIcons,
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: Icons.Hugeicons.Time01FreeIcons,
    },
    {
      key: 'approved',
      label: 'Approved',
      icon: Icons.Hugeicons.CheckmarkBadgeFreeIcons,
    },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: Icons.Hugeicons.Cancel01FreeIcons,
    },
  ];

  const allTransactions = useQuery(api.transactions.getPendingTransactions, {
    limit: 100,
  });

  const approveDeposit = useMutation(api.transactions.approveDeposit);
  const rejectDeposit = useMutation(api.transactions.rejectDeposit);

  const filteredTransactions =
    allTransactions?.filter(transaction => {
      if (selectedFilter === 'all') return true;
      return transaction.status === selectedFilter;
    }) || [];

  const handleApprove = async (transactionId: Id<'transactions'>) => {
    setIsProcessing(true);
    try {
      await approveDeposit({ transactionId });
      toast.success('Deposit approved successfully!');
    } catch (error) {
      toast.error('Failed to approve deposit');
      console.error('Error approving deposit:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (transactionId: Id<'transactions'>) => {
    setIsProcessing(true);
    try {
      await rejectDeposit({ transactionId });
      toast.success('Deposit rejected');
    } catch (error) {
      toast.error('Failed to reject deposit');
      console.error('Error rejecting deposit:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
        return Icons.Hugeicons.Wallet03FreeIcons;
      default:
        return Icons.Hugeicons.ExchangeFreeIcons;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-success';
      case 'withdrawal':
        return 'text-error';
      case 'payment':
        return 'text-secondary';
      case 'earning':
        return 'text-primary';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="my-3">
        <Text className="text-2xl font-medium text-gray-900">
          Manage Transactions
        </Text>
        <Text className="text-sm text-gray-500">
          {filteredTransactions.length} transactions total
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="mb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-1">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={cn(
                  'flex-row items-center gap-2 rounded-xl border p-2 px-4 py-1.5',
                  selectedFilter === filter.key
                    ? 'border-primary bg-primary'
                    : 'border-secondary/10 bg-background-secondary',
                )}>
                <Icons.Icon
                  icon={filter.icon}
                  size={16}
                  strokeWidth={2.5}
                  className={cn(
                    selectedFilter === filter.key ? 'text-white' : 'text-gray-500',
                    selectedFilter !== filter.key && 'mr-1.5',
                  )}
                />
                <Text
                  className={cn(
                    'text-sm font-medium',
                    selectedFilter === filter.key ? 'text-white' : 'text-gray-700',
                  )}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Transactions List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4">
        {!allTransactions || allTransactions.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-primary/10 mb-4 h-20 w-20 items-center justify-center rounded-full">
              <Icons.Icon
                icon={Icons.Hugeicons.Wallet03FreeIcons}
                size={36}
                strokeWidth={1.5}
                className="text-primary"
              />
            </View>
            <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
              No transactions found
            </Text>
            <Text className="text-center text-gray-500">
              Transactions will appear here
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {filteredTransactions.map(transaction => (
              <TouchableOpacity
                key={transaction._id}
                onPress={() => setSelectedTransaction(transaction)}
                className="border-secondary/10 bg-background-secondary rounded-2xl border p-3">
                {/* Transaction Header */}
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View
                      className={cn(
                        'h-8 w-8 items-center justify-center rounded-full',
                        transaction.status === 'pending'
                          ? 'bg-primary/10'
                          : transaction.status === 'approved'
                            ? 'bg-success/10'
                            : 'bg-error/10',
                      )}>
                      <Icons.Icon
                        icon={getTypeIcon(transaction.type)}
                        size={16}
                        strokeWidth={2.5}
                        className={cn(
                          transaction.status === 'pending'
                            ? 'text-primary'
                            : transaction.status === 'approved'
                              ? 'text-success'
                              : 'text-error',
                        )}
                      />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-gray-900 capitalize">
                        {transaction.type}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {transaction.userName}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={cn(
                      'rounded-full border px-3 py-1',
                      getStatusColor(transaction.status),
                    )}>
                    <Text className="text-xs font-bold capitalize">
                      {transaction.status}
                    </Text>
                  </View>
                </View>

                {/* Transaction Details */}
                <View className="mb-3 flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm text-gray-500">Description</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View className="flex-row items-center justify-between border-t border-secondary/10 pt-3">
                  <View className="flex-row items-center gap-1">
                    <Icons.Icon
                      icon={transaction.proofUrl ? Icons.Hugeicons.FileFreeIcons : Icons.Hugeicons.FileNotFoundFreeIcons}
                      size={12}
                      strokeWidth={2}
                      className="text-gray-400"
                    />
                    <Text className="text-xs text-gray-500">
                      {transaction.proofUrl ? 'Has proof' : 'No proof'}
                    </Text>
                  </View>
                  <Text
                    className={cn(
                      'text-xl font-bold',
                      getTypeColor(transaction.type),
                    )}>
                    {transaction.amount} DH
                  </Text>
                </View>

                {/* Pending Action Buttons */}
                {transaction.status === 'pending' && (
                  <View className="mt-3 flex-row gap-2 border-t border-secondary/10 pt-3">
                    <TouchableOpacity
                      onPress={() => handleApprove(transaction._id)}
                      disabled={isProcessing}
                      className="bg-success/10 flex-1 flex-row items-center justify-center rounded-xl px-3 py-2">
                      <Icons.Icon
                        icon={Icons.Hugeicons.CheckmarkBadgeFreeIcons}
                        size={14}
                        strokeWidth={2}
                        color="#22c55e"
                      />
                      <Text className="text-success ml-1 text-xs font-bold">
                        Approve
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReject(transaction._id)}
                      disabled={isProcessing}
                      className="bg-error/10 flex-1 flex-row items-center justify-center rounded-xl px-3 py-2">
                      <Icons.Icon
                        icon={Icons.Hugeicons.Cancel01FreeIcons}
                        size={14}
                        strokeWidth={2}
                        color="#ef4444"
                      />
                      <Text className="text-error ml-1 text-xs font-bold">
                        Reject
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </RootWrapper>
  );
}
