'use client';

import React, { ButtonHTMLAttributes, useRef, useState } from 'react';
import { useField } from '@tanstack/react-form';
import { useFormContext } from '../form-context';
import { cn } from '@/lib';
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from '../../ui';

type FieldSelectProps<T> = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string;
  label: string;
  placeholder?: string;
  onChangeCallback?: (value: T) => void;
  items: T[];
  extractLabel: (item: T) => string;
  extractValue: (item: T) => string;
};

export function FieldSelect<T>({
  name,
  label,
  placeholder,
  items,
  extractLabel,
  extractValue,
  ...props
}: FieldSelectProps<T>) {
  const form = useFormContext();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  // useOutsideClick(dropdownRef, () => setIsOpen(false));

  const field = useField({
    form,
    name,
  });

  return (
    <View ref={dropdownRef} className="relative flex w-full flex-col">
      <Text className="font-medium">{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(prev => !prev)}
        className={cn(
          'bg-background-secondary border-background-secondary mt-0 flex w-full items-center justify-between rounded-xl p-2.5 text-left text-sm font-medium text-text transition-all focus:outline-none dark:text-textdark',
          props.className,
        )}>
        <div className="">
          {extractLabel(
            items.find(item => extractValue(item) === field.state.value) ??
              items[0],
          ) ||
            placeholder ||
            'Select an item'}
        </div>
        <Image
          source={require('@/assets/icons/arrow-down.png')}
          alt="arrow down"
          width={26}
          height={26}
          className="w-6.5 rounded-lg bg-tertiary/10 p-1"
        />
      </TouchableOpacity>

      <View
        className={cn(
          'bg-background-secondary absolute z-10 max-h-52 w-full overflow-y-scroll rounded-xl transition-all duration-300',
          isOpen ? 'h-52' : 'h-0 min-h-0',
          label ? 'top-20' : 'top-16',
        )}>
        <View className="">
          <View className={cn('')}>
            {React.Children.toArray(
              items.map(item => (
                <Text
                  key={extractValue(item)}
                  className="relative cursor-pointer p-2 hover:bg-tertiary/10"
                  onPress={() => {
                    field.state.value = extractValue(item);
                    props.onChangeCallback && props.onChangeCallback(item);
                    setIsOpen(false);
                  }}>
                  {extractLabel(item)}
                </Text>
              )),
            )}
          </View>
        </View>
      </View>
      {field.state.meta.isTouched ? (
        <Text className="text-xs text-red-500">
          {field.state.meta.errors.map(err => err.message).join(', ')}
        </Text>
      ) : null}
    </View>
  );
}
