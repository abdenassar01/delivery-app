import React from 'react';
import { ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
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

type LocationValue = {
  address: string;
  latitude: number;
  longitude: number;
};

type FormValues = {
  item: string;
  pickupLocation: LocationValue | undefined;
  deliveryLocation: LocationValue | undefined;
};

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
      pickupLocation: undefined,
      deliveryLocation: undefined,
    } as FormValues,
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
        className="bg-primary/10 border-primary absolute right-4 bottom-2 rounded-2xl border px-4 py-2">
        <View className="flex-row items-center justify-center">
          <MaterialIcons name="add-circle" size={20} color={primary} />
          <Text className="text-primary ml-2 text-sm font-medium">
            New Delivery
          </Text>
        </View>
      </TouchableOpacity>

      <Modal ref={ref} snapPoints={['50%']} detached>
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
                  <View className="gap-4">
                    <FieldInput
                      name="item"
                      label="Item to Deliver"
                      placeholder="e.g., Documents, Package, Food"
                    />

                    {/* Pickup Location */}
                    <form.Field
                      name="pickupLocation"
                      children={field => (
                        <FieldLocationSelector
                          name="pickupLocation"
                          label="Pickup Location"
                          placeholder="Select pickup location on map"
                        />
                      )}
                    />

                    {/* Delivery Location */}
                    <form.Field
                      name="deliveryLocation"
                      validators={{
                        onChange: ({ value }) =>
                          !value ? 'Delivery location is required' : undefined,
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
                      className={`rounded-xl px-4 py-3 ${
                        !canSubmit || isSubmitting
                          ? 'bg-gray-300'
                          : 'bg-primary'
                      }`}>
                      <View className="flex-row items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <MaterialIcons
                              name="hourglass-empty"
                              size={20}
                              color="white"
                            />
                            <Text className="ml-2 text-sm font-bold text-white">
                              Creating...
                            </Text>
                          </>
                        ) : (
                          <>
                            <MaterialIcons
                              name="check-circle"
                              size={20}
                              color="white"
                            />
                            <Text className="ml-2 text-sm font-bold text-white">
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
