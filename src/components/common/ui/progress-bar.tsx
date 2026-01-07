/* eslint-disable react-hooks/exhaustive-deps */
import { View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text } from './text';
import { cn } from '@/lib';

type Props = {
  steps?: number;
  currentStep?: number;
  header?: string;
  className?: string;
};

export function ProgressBar({
  steps = 3,
  currentStep = 0,
  header,
  className,
}: Props) {
  const width = useSharedValue('0%');

  const style = useAnimatedStyle<any>(() => {
    return {
      width: withSpring(width.value, {}),
    };
  });

  useEffect(() => {
    width.value = `${(currentStep / steps) * 100}%`;
  }, [currentStep, header]);

  return (
    <View className={cn('my-1', className)}>
      {header && <Text className="text-main mb-1">{header}</Text>}
      <View className="bg-background-secondary relative h-2 w-full rounded-full">
        <Animated.View
          style={style}
          className={cn('bg-main absolute top-0 left-0 h-2 rounded-full')}
        />
      </View>
    </View>
  );
}
