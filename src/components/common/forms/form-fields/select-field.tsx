'use client';

import React, { useRef, useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { cn } from '@/lib';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '../../ui';
import * as Icons from '@/icons';

type FieldSelectProps<T> = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  items: T[];
  extractLabel: (item: T) => string;
  extractValue: (item: T) => string;
  onChangeCallback?: (value: T) => void;
  className?: string;
};

export function FieldSelect<T>({
  name,
  label,
  placeholder = 'Select an option',
  disabled = false,
  helperText,
  items,
  extractLabel,
  extractValue,
  onChangeCallback,
  className,
}: FieldSelectProps<T>) {
  const form = useFormContext();

  const field = useField({
    form,
    name,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(() => {
    const value = field.state.value;
    return items.find(item => extractValue(item) === value) ?? items[0] ?? null;
  });

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const handleSelect = (item: T) => {
    setSelectedItem(item);
    field.handleChange(extractValue(item));
    onChangeCallback?.(item);
    setIsOpen(false);
  };

  const displayValue = selectedItem ? extractLabel(selectedItem) : placeholder;

  return (
    <View className="flex w-full flex-col">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </Text>
      )}

      <View className="relative">
        <TouchableOpacity
          onPress={() => !disabled && setIsOpen(!isOpen)}
          activeOpacity={0.7}
          className={cn(
            'h-12 w-full flex-row items-center justify-between rounded-xl border border-gray-300 bg-white px-4',
            hasError && 'border-red-500',
            isOpen && 'border-indigo-500',
            disabled && 'opacity-50',
            className,
          )}
          disabled={disabled}>
          <Text
            className="flex-1 text-base text-gray-900"
            numberOfLines={1}>
            {displayValue}
          </Text>
          <View className="opacity-50">
            <Icons.Icon
              icon={Icons.Hugeicons.ArrowDown01FreeIcons}
              size={16}
              strokeWidth={2}
              style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
            />
          </View>
        </TouchableOpacity>

        {isOpen && !disabled && (
          <>
            {/* Backdrop */}
            <Pressable
              onPress={() => setIsOpen(false)}
              className="absolute -top-10 -right-10 -bottom-10 -left-10 z-10"
            />

            {/* Dropdown */}
            <View
              className={cn(
                'absolute z-20 mt-1 w-full rounded-xl border border-gray-300 bg-white shadow-xl',
              )}>
              <ScrollView
                className="max-h-60"
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}>
                <View>
                  {items.map((item, index) => {
                    const isSelected =
                      extractValue(item) ===
                      (selectedItem ? extractValue(selectedItem) : null);

                    return (
                      <TouchableOpacity
                        key={extractValue(item) ?? index}
                        onPress={() => handleSelect(item)}
                        className={cn(
                          'flex flex-row items-center justify-between border-b border-gray-100 px-4 py-3',
                          index === 0 && 'rounded-t-xl',
                          index === items.length - 1 &&
                            'rounded-b-xl border-b-0',
                          isSelected
                            ? 'bg-indigo-50'
                            : '',
                        )}>
                        <Text
                          className={cn(
                            'flex-1 text-base',
                            isSelected
                              ? 'font-medium text-indigo-600'
                              : 'text-gray-900',
                          )}>
                          {extractLabel(item)}
                        </Text>
                        {isSelected && (
                          <Icons.Icon
                            icon={Icons.Hugeicons.CheckmarkBadgeFreeIcons}
                            size={18}
                            strokeWidth={2.5}
                            className="text-indigo-600"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </>
        )}
      </View>

      {helperText && !hasError && (
        <Text className="mt-1.5 text-xs text-gray-500">{helperText}</Text>
      )}

      {hasError && (
        <Text className="mt-1.5 text-xs text-red-500">
          {field.state.meta.errors
            .map((err: any) => err?.message ?? String(err))
            .join(', ')}
        </Text>
      )}
    </View>
  );
}
