'use client';

import React, { useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../../ui';
import { cn } from '@/lib';

type FieldInputProps = {
  name: string;
  label: string;
  password?: boolean;
  placeholder?: string;
  className?: string;
};

export function FieldInput({
  name,
  label,
  password,
  className,
  placeholder,
}: FieldInputProps) {
  const form = useFormContext();

  const field = useField({
    form,
    name,
  });

  const [isPassword, setIsPassword] = useState(password);

  return (
    <View className="flex w-full flex-col">
      <Text className="mb-1 font-medium text-text dark:text-textdark">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          className={cn(
            'bg-background-secondary focus:not-last:border-tertiary mt-0 w-full rounded-xl p-[11px] font-medium text-text transition-all focus:outline-none dark:text-textdark',
            className,
          )}
          id={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          placeholder={placeholder || label}
          onChangeText={text => {
            field.handleChange(text);
          }}
          secureTextEntry={isPassword}
        />
        {password && (
          <TouchableOpacity
            onPress={() => setIsPassword(!isPassword)}
            className="absolute right-4 top-[40%] text-gray-500">
            <Image
              width={16}
              height={16}
              className="h-4 w-4"
              source={
                isPassword
                  ? require('@/assets/icons/eye.png')
                  : require('@/assets/icons/eye-off.png')
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {field.state.meta.isTouched ? (
        <Text className="text-xs text-red-500">
          {field.state.meta.errors.map(err => err.message).join(', ')}
        </Text>
      ) : null}
    </View>
  );
}
