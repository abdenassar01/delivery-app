'use client';

import React, { useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';

import { FieldLocationSelector, FormContext, Text } from '@/components';
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
  const bottomSheetRef = useRef<BottomSheet>(null);
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
        handleDismiss();
        onSuccess?.();
      } catch (error) {
        console.error('Failed to create order:', error);
      }
    },
  });

  const handlePresent = () => {
    bottomSheetRef.current?.expand();
  };

  const handleDismiss = () => {
    bottomSheetRef.current?.close();
    form.reset();
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePresent}
        className="bg-primary rounded-xl px-4 py-3 shadow-md">
        <View className="flex-row items-center justify-center">
          <MaterialIcons name="add-circle" size={20} color="white" />
          <Text className="ml-2 text-sm font-bold text-white">
            New Delivery
          </Text>
        </View>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['75%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#f9fafb' }}
        handleIndicatorStyle={{ backgroundColor: '#9ca3af' }}>
        <BottomSheetView className="flex-1">
          <View className="p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Request Delivery
              </Text>
              <TouchableOpacity onPress={handleDismiss}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-20">
              <FormContext value={form}>
                <form.Subscribe
                  selector={state => [state.isSubmitting, state.canSubmit]}
                  children={([isSubmitting, canSubmit]) => (
                    <View className="gap-4">
                      {/* What to Deliver */}
                      <form.Field
                        name="item"
                        validators={{
                          onChange: ({ value }) =>
                            !value ? 'Item description is required' : undefined,
                        }}
                        children={field => (
                          <View>
                            <Text className="mb-1 text-sm font-medium text-gray-700">
                              What to Deliver
                            </Text>
                            <View className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                              <MaterialIcons
                                name="inventory-2"
                                size={18}
                                color="#9ca3af"
                                style={{ marginRight: 8 }}
                              />
                              <TextInput
                                className="flex-1 text-sm text-gray-900"
                                placeholder="Describe your item/package"
                                placeholderTextColor="#9ca3af"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChangeText={text => field.handleChange(text)}
                              />
                            </View>
                            {field.state.meta.errors.length > 0 && (
                              <Text className="mt-0.5 text-xs text-red-500">
                                {field.state.meta.errors[0]?.toString()}
                              </Text>
                            )}
                          </View>
                        )}
                      />

                      {/* Pickup Location */}
                      <form.Field
                        name="pickupLocation"
                        validators={{
                          onChange: ({ value }) =>
                            !value ? 'Pickup location is required' : undefined,
                        }}
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
                            !value
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
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
