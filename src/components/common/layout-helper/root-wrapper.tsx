import { cn } from '@/lib';
import React, { type ReactNode } from 'react';
import { View } from 'react-native';

export function RootWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className="bg-background flex-1 overflow-y-scroll">
      <View className={cn('ios:pt-16 android:pt-12 pt-7', className)}>
        {children}
      </View>
    </View>
  );
}
