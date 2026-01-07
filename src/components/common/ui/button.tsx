import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib';

export interface ButtonProps {
  label?: string;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-primary',
  secondary: 'bg-gray-600',
  outline: 'border border-gray-300 bg-white',
  ghost: 'bg-transparent',
};

const labelVariantStyles = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-gray-900',
  ghost: 'text-gray-900',
};

const sizeStyles = {
  sm: 'h-9 px-3',
  md: 'h-11 px-4',
  lg: 'h-12 px-6',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  label,
  onPress,
  className,
  disabled = false,
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  textClassName,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-xl',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className,
      )}>
      {loading ? (
        <>
          <ActivityIndicator
            size="small"
            color={
              variant === 'outline' || variant === 'ghost' ? '#6366f1' : '#fff'
            }
            className="mr-2"
          />
          {label && (
            <Text
              className={cn(
                'font-medium',
                textSizeStyles[size],
                labelVariantStyles[variant],
              )}>
              {label}
            </Text>
          )}
        </>
      ) : (
        <>
          {children || (
            <Text
              className={cn(
                'font-medium',
                textSizeStyles[size],
                labelVariantStyles[variant],
                textClassName,
              )}>
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
