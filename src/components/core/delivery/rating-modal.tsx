'use client';

import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { useModal, Modal as BottomModal } from '@/components';
import { useCSSVariable } from 'uniwind';
import * as Icons from '@/icons';
import { cn, toast } from '@/lib';
import type { Id } from 'convex/_generated/dataModel';

type RatingModalProps = {
  orderId: Id<'orders'>;
  onSuccess?: () => void;
};

export function RatingModal({ orderId, onSuccess }: RatingModalProps) {
  const { ref, present, dismiss } = useModal();
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const markDeliveredAndRate = useMutation(api.orders.markDeliveredAndRate);

  const [selectedRating, setSelectedRating] = useState(0);
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
      });
      toast.success('Order marked as delivered and courier rated!');
      setSelectedRating(0);
      dismiss();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
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

      <BottomModal ref={ref} snapPoints={['45%']} detached>
        <View className="p-4">
          <View className="mb-4 flex-row items-center justify-end">
            <TouchableOpacity onPress={dismiss} hitSlop={10}>
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

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting}
              className={cn(
                'w-full rounded-xl border',
                selectedRating === 0 || isSubmitting
                  ? 'border-gray-300 bg-gray-300'
                  : 'bg-primary/10 border-primary',
              )}>
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
                      className={cn(
                        'text-sm font-semibold',
                        selectedRating !== 0 ? 'text-primary' : 'text-gray-500',
                      )}>
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
      </BottomModal>
    </>
  );
}
