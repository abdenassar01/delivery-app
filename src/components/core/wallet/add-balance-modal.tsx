'use client';

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import {
  FormContext,
  FieldInput,
  Modal,
  useModal,
  Button,
  DocumentUpload,
} from '@/components';
import { useCSSVariable } from 'uniwind';
import * as Icons from '@/icons';
import { toast } from '@/lib';
import { z } from 'zod';

type AddBalanceModalProps = {
  onSuccess?: () => void;
};

export function AddBalanceModal({ onSuccess }: AddBalanceModalProps) {
  const { ref, present, dismiss } = useModal();
  const primary = useCSSVariable('--color-primary') as string;
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const requestDeposit = useMutation(api.transactions.requestDeposit);

  const form = useForm({
    defaultValues: {
      amount: '',
      description: '',
      proofUrl: '',
    },
    validators: {
      onSubmit: z.object({
        amount: z.string().min(1, 'Amount is required'),
        description: z.string().min(1, 'Description is required'),
        proofUrl: z.string().min(1, 'Proof document is required'),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await requestDeposit({
          amount: parseFloat(value.amount),
          description: value.description,
          proofUrl: value.proofUrl as any,
        });
        toast.success('Deposit request submitted successfully!');
        form.reset();
        dismiss();
        onSuccess?.();
      } catch (error) {
        toast.error('Failed to submit deposit request. Please try again.');
        console.error('Error submitting deposit:', error);
      }
    },
  });

  return (
    <>
      <TouchableOpacity
        onPress={present}
        className="bg-primary/10 border-primary flex-row items-center justify-center gap-2 rounded-xl border p-4 py-2">
        <Icons.Icon
          icon={Icons.Hugeicons.Wallet03FreeIcons}
          size={15}
          strokeWidth={2}
          color={primary}
        />
        <Text className="text-primary text-sm font-semibold">Add Balance</Text>
      </TouchableOpacity>

      <Modal ref={ref} snapPoints={['75%']} detached>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4">
            <View className="p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    Add Balance
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Deposit funds to your wallet via bank transfer
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

              <FormContext value={form}>
                <View className="gap-3">
                  <FieldInput
                    label="Amount (DH)"
                    name="amount"
                    placeholder="Enter amount in Moroccan Dirhams"
                    keyboardType="decimal-pad"
                    autoCapitalize="none"
                  />

                  <FieldInput
                    label="Description"
                    name="description"
                    placeholder="e.g., Bank transfer from CIH"
                    autoCapitalize="sentences"
                  />

                  <DocumentUpload
                    label="Proof of Transfer (Image/PDF)"
                    onUploadComplete={storageId => {
                      form.setFieldValue('proofUrl', storageId);
                    }}
                  />

                  <View className="bg-primary/5 mt-2 rounded-xl p-3">
                    <View className="mb-2 flex-row items-center gap-2">
                      <Icons.Icon
                        icon={Icons.Hugeicons.InformationCircleFreeIcons}
                        size={16}
                        strokeWidth={2}
                        color={primary}
                      />
                      <Text className="text-primary text-sm font-semibold">
                        Important
                      </Text>
                    </View>
                    <Text className="text-xs leading-relaxed text-gray-600">
                      • Upload a clear image or PDF of your bank transfer
                      receipt{'\n'}• Your deposit will be reviewed by our team
                      {'\n'}• You will receive a notification once approved
                      {'\n'}• Processing typically takes 1-2 business days
                    </Text>
                  </View>

                  <form.Subscribe
                    selector={state => [state.isSubmitting, state.canSubmit]}
                    children={([isSubmitting, canSubmit]) => (
                      <Button
                        label={
                          isSubmitting
                            ? 'Submitting...'
                            : 'Submit Deposit Request'
                        }
                        onPress={form.handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting || !canSubmit}
                        className="mt-2"
                      />
                    )}
                  />
                </View>
              </FormContext>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
