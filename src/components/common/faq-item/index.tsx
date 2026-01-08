import React, { useState, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { primary } from 'configs/colors';
import Animated, {
  useSharedValue,
  withTiming,
  FadeInDown,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { Text } from '../../text';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  question: string;
  answer: string;
  open?: boolean;
}

export function FaqQuestion({ question, answer, open = false }: Props) {
  const [isOpen, setIsOpen] = useState(open);

  const heightAnimation = useSharedValue(open ? 1 : 0);
  const rotateAnimation = useSharedValue(open ? 1 : 0);

  const toggleAnswer = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);

    heightAnimation.value = withTiming(newState ? 1 : 0, {
      duration: 300,
    });
    rotateAnimation.value = withTiming(newState ? 1 : 0, {
      duration: 300,
    });
  }, [isOpen, heightAnimation, rotateAnimation]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(heightAnimation.value, [0, 1], [60, 200]);

    return {
      height,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rotateAnimation.value, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(heightAnimation.value, [0, 0.5, 1], [0, 0, 1]);

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      entering={FadeInDown}
      style={[animatedContainerStyle]}
      className="bg-primary/10 rounded-xl overflow-hidden"
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleAnswer}
        className="p-4 flex-row justify-between items-center"
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={question}
        accessibilityHint={
          isOpen ? 'Tap to close answer' : 'Tap to open answer'
        }
      >
        <Text className="text-sm font-medium flex-1 pr-2">{question}</Text>
        <Animated.View
          style={[animatedIconStyle]}
          className="p-1 bg-primary/20 rounded-full"
        >
          <Feather name="chevron-down" size={18} color={primary} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[animatedContentStyle]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mx-4 pb-4 pt-2 border-t border-primary/40"
        >
          <Text className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {answer}
          </Text>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}
