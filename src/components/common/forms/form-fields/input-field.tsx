'use client';

import React, { useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../ui';
import { cn } from '@/lib';

type FieldInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  password?: boolean;
  className?: string;
  keyboardType?: 'email-address' | 'phone-pad' | 'default';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  helperText?: string;
};

export function FieldInput({
  name,
  label,
  placeholder,
  password,
  className,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  disabled = false,
  helperText,
}: FieldInputProps) {
  const form = useFormContext();

  const field = useField({
    form,
    name,
  });

  const [isPassword, setIsPassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <View style={{ marginBottom: 16 }} className="flex w-full flex-col">
      {label && (
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      )}

      <View className="relative">
        <TextInput
          className={cn(
            'h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
            hasError && 'border-red-500',
            isFocused && !hasError && 'border-indigo-500',
            disabled && 'opacity-50',
            className,
          )}
          id={field.name}
          value={String(field.state.value ?? '')}
          onBlur={() => {
            field.handleBlur();
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onChangeText={text => {
            field.handleChange(text);
          }}
          secureTextEntry={isPassword}
          editable={!disabled}
          selectionColor="#6366f1"
        />

        {password && (
          <TouchableOpacity
            onPress={() => setIsPassword(!isPassword)}
            style={{ top: 14, right: 16 }}
            className="absolute"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Image
              width={20}
              height={20}
              className="h-5 w-5 opacity-60"
              source={
                isPassword
                  ? require('@/assets/icons/eye.png')
                  : require('@/assets/icons/eye-off.png')
              }
            />
          </TouchableOpacity>
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
