import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import * as Icons from '@/icons';

import {
  FieldLocationSelector,
  FormContext,
  Text,
  Modal,
  useModal,
  FieldInput,
} from '@/components';
import { useCSSVariable } from 'uniwind';
import { cn } from '@/lib';
import z from 'zod';

type CreateDeliveryModalProps = {
  userId?: Id<'users'>;
  onSuccess?: () => void;
};

export function CreateDeliveryModal({
  userId,
  onSuccess,
}: CreateDeliveryModalProps) {
  const { ref, present, dismiss } = useModal();
  const primary = useCSSVariable('--color-primary') as string;
  const createOrder = useMutation(api.orders.createOrder);

  const form = useForm({
    defaultValues: {
      item: '',
      phone: '',
      price: '0',
      pickupLocation: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
      deliveryLocation: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
    },
    validators: {
      onChange: z.object({
        item: z.string().min(1, 'Item is required'),
        phone: z.string().min(1, 'Please enter a valid phone number'),
        price: z.string(),
        pickupLocation: z.object({
          address: z.string(),
          latitude: z.number(),
          longitude: z.number(),
        }),
        deliveryLocation: z.object({
          address: z.string(),
          latitude: z.number(),
          longitude: z.number(),
        }),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!userId) {
        console.error('User not authenticated');
        return;
      }

      try {
        await createOrder({
          userId,
          item: value.item,
          pickupAddress: value.pickupLocation?.address || '',
          deliveryAddress: value.deliveryLocation?.address || '',
          pickupLocation: {
            latitude: value.pickupLocation?.latitude || 0,
            longitude: value.pickupLocation?.longitude || 0,
          },
          deliveryLocation: {
            latitude: value.deliveryLocation?.latitude || 0,
            longitude: value.deliveryLocation?.longitude || 0,
          },
          totalAmount: value.price ? parseFloat(value.price) : undefined,
        });
        form.reset();
        dismiss();
        onSuccess?.();
      } catch (error) {
        console.error('Failed to create order:', error);
      }
    },
  });

  return (
    <>
      <TouchableOpacity
        onPress={present}
        className="bg-primary/10 border-primary absolute right-4 bottom-4 rounded-2xl border px-4 py-2">
        <View className="flex-row items-center justify-center">
          <MaterialIcons name="add-circle" size={20} color={primary} />
          <Text className="text-primary ml-2 text-sm font-medium">
            New Delivery
          </Text>
        </View>
      </TouchableOpacity>

      <Modal ref={ref} snapPoints={['50%', '70%']} detached>
        <View className="p-4">
          <Text className="mb-2 text-base font-medium">Request Delivery</Text>
          <TouchableOpacity
            onPress={dismiss}
            className="bg-primary/10 absolute top-4 right-4 rounded-full p-1.5">
            <Icons.Icon
              icon={Icons.Hugeicons.CancelCircleFreeIcons}
              size={18}
              strokeWidth={1.5}
              color={primary}
            />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <FormContext value={form}>
              <form.Subscribe
                selector={state => [state.isSubmitting, state.canSubmit]}
                children={([isSubmitting, canSubmit]) => (
                  <View className="gap-3">
                    <FieldInput
                      name="item"
                      label="Item to Deliver"
                      placeholder="e.g., Documents, Package, Food"
                    />
                    <FieldInput
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                    <FieldInput
                      name="price"
                      label="Price (Optional)"
                      placeholder="Enter price in USD"
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                    <form.Field
                      name="pickupLocation"
                      validators={{
                        onChange: ({ value }) =>
                          !value || !value.address
                            ? 'Pickup location is required'
                            : undefined,
                      }}
                      children={field => (
                        <FieldLocationSelector
                          name="pickupLocation"
                          label="Pickup Location"
                          placeholder="Select pickup location on map"
                        />
                      )}
                    />

                    <form.Field
                      name="deliveryLocation"
                      validators={{
                        onChange: ({ value }) =>
                          !value || !value.address
                            ? 'Delivery location is required'
                            : undefined,
                      }}
                      children={field => (
                        <FieldLocationSelector
                          name="deliveryLocation"
                          label="Delivery Location"
                          placeholder="Select delivery location on map"
                        />
                      )}
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={form.handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                      className={cn(
                        'border-primary/10 rounded-xl border px-4 py-3',
                        !canSubmit || isSubmitting
                          ? 'bg-gray-300'
                          : 'bg-primary/10',
                      )}>
                      <View className="flex-row items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Icons.Icon
                              icon={Icons.Hugeicons.RefreshFreeIcons}
                              size={20}
                              color={primary}
                            />
                            <Text className="text-primary ml-2 text-sm font-bold">
                              Creating...
                            </Text>
                          </>
                        ) : (
                          <>
                            <Icons.Icon
                              icon={Icons.Hugeicons.Sent02FreeIcons}
                              size={20}
                              color={primary}
                            />
                            <Text className="text-primary ml-2 text-sm font-bold">
                              Submit Request
                            </Text>
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </FormContext>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
