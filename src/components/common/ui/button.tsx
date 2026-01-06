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
        'bg-primary h-10 items-center justify-center rounded-xl',
        className,
      )}
      onPress={onPress}>
      <Text className="text-sm font-medium text-white">{label}</Text>
    </TouchableOpacity>
  );
}
