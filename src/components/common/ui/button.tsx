import React from 'react';
import { cn } from '@/lib';
import { Text } from './text';
import { TouchableOpacity } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  className?: string;
}

export function Button({ label, onPress, className }: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'items-center justify-center rounded-xl bg-primary p-2.5',
        className,
      )}
      onPress={onPress}>
      <Text className="font-medium text-backgroundSecondary dark:text-backgroundSecondaryDark">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
