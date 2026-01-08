import React from 'react';

import { cn } from '@/lib/helpers';
import { TouchableOpacity, View } from 'react-native';

export function TabsNavigator(props: any) {
  return (
    <View className="border-secondary bg-backgroundSecondary dark:border-backgroundDark dark:bg-backgroundSecondaryDark absolute bottom-5 flex-row items-center gap-4 self-center rounded-full border p-2">
      {props.state.routes.map((route, index) => (
        <TouchableOpacity
          hitSlop={20}
          onPress={() => props.navigation.navigate(route.name)}
          key={route.key}
          className={cn(
            'rounded-full p-2',
            props.state.index === index
              ? 'bg-secondary dark:bg-backgroundDark'
              : '',
          )}>
          {/* @ts-ignore */
          props.descriptors[route?.key]?.options?.tabBarIcon({
            focused: props.state.index === index,
          })}
        </TouchableOpacity>
      ))}
    </View>
  );
}
