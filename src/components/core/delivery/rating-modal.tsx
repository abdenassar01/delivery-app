'use client';

import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { useModal, Modal as BottomModal } from '@/components';
import { useCSSVariable } from 'uniwind';
import * as Icons from '@/icons';
import { toast } from '@/lib';
import type { Id } from 'convex/_generated/dataModel';
import { TextInput, ScrollView } from 'react-native';

type RatingModalProps = {
  orderId: Id<'orders'>;
  onSuccess?: () => void;
};

export function RatingModal({ orderId, onSuccess }: RatingModalProps) {
  const { ref, present, dismiss } = useModal();
  const primary = useCSSVariable('--color-primary') as string;
  const markDeliveredAndRate = useMutation(api.orders.markDeliveredAndRate);

  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await markDeliveredAndRate({
        orderId,
        rating: selectedRating,
        reviewMessage: reviewMessage.trim() || undefined,
      });
      toast.success('Order marked as delivered and courier rated!');
      setSelectedRating(0);
      setReviewMessage('');
      dismiss();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedRating(0);
    setReviewMessage('');
    dismiss();
  };

  const renderStar = (rating: number) => {
    const isSelected = rating <= selectedRating;
    return (
      <TouchableOpacity
        key={rating}
        onPress={() => setSelectedRating(rating)}
        className="mx-1"
        hitSlop={10}>
        <Icons.Icon
          icon={
            isSelected
              ? Icons.Hugeicons.StarFreeIcons
              : Icons.Hugeicons.StarOffIcon
          }
          size={32}
          strokeWidth={isSelected ? 0 : 2}
          fill={isSelected ? primary : 'none'}
          color={isSelected ? primary : '#d1d5db'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={present}
        className="bg-primary/10 border-primary rounded-xl border px-4 py-2">
        <View className="flex-row items-center gap-2">
          <Icons.Icon
            icon={Icons.Hugeicons.StarFreeIcons}
            size={16}
            strokeWidth={2}
            color={primary}
          />
          <Text className="text-primary text-sm font-bold">Rate Delivery</Text>
        </View>
      </TouchableOpacity>

      <BottomModal ref={ref} snapPoints={['60%']} detached>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="p-4">
            <View className="mb-4 flex-row items-center justify-end">
              <TouchableOpacity onPress={handleCancel} hitSlop={10}>
                <Icons.Icon
                  icon={Icons.Hugeicons.CancelCircleFreeIcons}
                  size={20}
                  strokeWidth={1.5}
                  color={primary}
                />
              </TouchableOpacity>
            </View>

            <View className="items-center">
              <Text className="text-text text-center text-lg font-medium">
                Rate Your Delivery
              </Text>
              <Text className="mb-4 text-center text-sm text-gray-600">
                How was your delivery experience?
              </Text>

              {/* Stars */}
              <View className="mb-6 flex-row items-center justify-center">
                {[1, 2, 3, 4, 5].map(renderStar)}
              </View>

              {/* Rating Description */}
              {selectedRating > 0 && (
                <Text className="mb-4 text-center text-lg font-semibold text-gray-900">
                  {selectedRating === 1 && 'Poor'}
                  {selectedRating === 2 && 'Fair'}
                  {selectedRating === 3 && 'Good'}
                  {selectedRating === 4 && 'Very Good'}
                  {selectedRating === 5 && 'Excellent'}
                </Text>
              )}

              {/* Review Message */}
              {selectedRating > 0 && (
                <View className="mb-4 w-full">
                  <Text className="mb-2 text-left text-sm font-medium text-gray-700">
                    Review (Optional)
                  </Text>
                  <TextInput
                    className="border-primary/10 bg-background-secondary min-h-[100px] w-full rounded-xl border p-3 text-sm text-gray-900"
                    value={reviewMessage}
                    onChangeText={setReviewMessage}
                    placeholder="Share your experience with this delivery..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={selectedRating === 0 || isSubmitting}
                className="w-full rounded-xl border"
                style={{
                  backgroundColor:
                    selectedRating === 0 || isSubmitting
                      ? '#d1d5db'
                      : primary + '20',
                  borderColor: selectedRating === 0 || isSubmitting ? '#d1d5db' : primary,
                }}>
                <View className="flex-row items-center justify-center gap-2 px-6 py-2">
                  {isSubmitting ? (
                    <>
                      <Icons.Icon
                        icon={Icons.Hugeicons.RefreshFreeIcons}
                        size={20}
                        color="white"
                      />
                      <Text className="text-background text-base font-semibold">
                        Submitting...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Icons.Icon
                        icon={Icons.Hugeicons.CheckmarkBadgeFreeIcons}
                        size={20}
                        color={selectedRating !== 0 ? primary : 'gray'}
                      />
                      <Text
                        className="text-sm font-semibold"
                        style={{
                          color: selectedRating !== 0 ? primary : 'gray',
                        }}>
                        Submit & Mark Delivered
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Helper Text */}
              <Text className="mt-4 text-center text-xs text-gray-500">
                By submitting, you confirm that you have received your order
              </Text>
            </View>
          </View>
        </ScrollView>
      </BottomModal>
    </>
  );
}
