import React from 'react';
import { Button, RootWrapper, Text } from '@/components';
import { useIsFirstTime } from '@/lib';
import { Image, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Onboarding() {
  const { setIsFirstTime } = useIsFirstTime();
  const { push } = useRouter();
  const { height } = useWindowDimensions();

  return (
    <RootWrapper className="px-3">
      <View
        className="w-full items-center justify-end py-20"
        style={{ height }}>
        <Image
          source={require('@/assets/images/onboarding.png')}
          className="mt-6 w-full"
          resizeMode="contain"
        />
        <View className="gap-2">
          <Text className="text-tertiary text-center text-xl font-bold">
            You ask, we deliver
          </Text>
          <Text className="text-center text-sm">
            Order food, groceries, and more with just a few clicks
          </Text>
        </View>
        <View className="mt-5 w-full">
          <Button
            label="Get Started"
            className="mt-3"
            onPress={() => {
              setIsFirstTime(false);
              push('/');
            }}
          />
        </View>
      </View>
    </RootWrapper>
  );
}
