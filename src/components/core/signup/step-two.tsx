import { cn } from '@/lib';
import { Button, FormContext, Text, View } from '../../';
import { useWindowDimensions } from 'react-native';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export function SignupStepTwo({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();

  const form = useForm({
    defaultValues: {},
    validators: {
      onSubmit: z.object({}),
    },
  });

  return (
    <FormContext value={form}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        className="mt-2 justify-between"
        style={{ height: height - 150 }}>
        <View>
          <Text>Hello</Text>
        </View>
        <View className={cn('flex-row justify-between')}>
          <Button
            label="Previous"
            className="bg-primary/10 border-primary w-[49%] border"
            textClassName="text-primary"
            onPress={() => {
              setStep(1);
            }}
          />
          <Button
            label="Next"
            className="border-primary w-[49%] border"
            onPress={() => setStep(2)}
          />
        </View>
      </KeyboardAvoidingView>
    </FormContext>
  );
}
