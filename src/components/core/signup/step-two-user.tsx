import { useWindowDimensions } from 'react-native';
import { Button, Text, View } from '../../';
import { cn } from '@/lib';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export function SignupStepTwoUser({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      className="mt-2 justify-between"
      style={{ height: height - 150 }}>
      <Text>SignupStepTwoUser</Text>
      <View className={cn('flex-row justify-between')}>
        <Button
          label="Previous"
          className="bg-primary/10 border-primary w-[49%] border"
          textClassName="text-primary"
          onPress={() => setStep(1)}
        />

        <Button
          label="Submit"
          className="border-primary w-[49%] border"
          onPress={() => setStep(2)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
