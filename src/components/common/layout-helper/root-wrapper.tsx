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
    <View className="bg-background dark:bg-backgroundDark flex-1 overflow-y-scroll">
      <View className={cn('ios:pt-16 android:pt-10 pt-5', className)}>
        {children}
      </View>
    </View>
  );
}
