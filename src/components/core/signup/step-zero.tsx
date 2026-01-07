import { Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Button, Text, View } from '../../';
import { cn } from '@/lib';

export function SignupStepZero({
  setStep,
  selectedRole,
  setSelectedRole,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { height } = useWindowDimensions();

  const tabs = [
    {
      label: 'Client',
      value: 'user',
      image: require('@/assets/images/user.png'),
    },
    {
      label: 'Delivery',
      value: 'delivery',
      image: require('@/assets/images/delivery.png'),
    },
  ];

  return (
    <View className="mt-2 justify-between" style={{ height: height - 150 }}>
      <View>
        <Text className="text-primary text-center text-xl font-medium">
          Select your role
        </Text>
        <View className="mt-5 flex-row justify-between">
          {tabs.map(tab => (
            <TouchableOpacity
              key={`role-item-${tab.value}`}
              onPress={() => setSelectedRole(tab.value)}
              className={cn(
                'bg-primary/10 border-primary/20 w-[49%] items-center gap-2 rounded-2xl border-2 p-2',
                selectedRole === tab.value && 'border-primary',
              )}>
              <Image className="h-32 w-32 rounded-xl" source={tab.image} />
              <Text className="border-primary text-primary border-t-2 pt-2">
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className={cn('flex-row justify-end')}>
        <Button
          label="Next"
          className="border-primary w-[49%] border"
          onPress={() => setStep(1)}
        />
      </View>
    </View>
  );
}
