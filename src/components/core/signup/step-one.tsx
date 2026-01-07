import z from 'zod';
import { Button, FormContext, Text, View } from '../../';
import { useForm } from '@tanstack/react-form';
import { useWindowDimensions } from 'react-native';
import { cn } from '@/lib';

export function SignupStepOne({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'client',
    },
    validators: {
      onSubmit: z
        .object({
          name: z.string().min(3),
          email: z.email(),
          password: z
            .string('Password is required')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            ),
          passwordConfirmation: z
            .string('Password is required')
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            ),
          phone: z.string().min(10),
          role: z.enum(['client', 'delivery']),
        })
        .refine(
          data => {
            if (data.password !== data.passwordConfirmation) {
              return false;
            }
            return true;
          },
          {
            message: 'Passwords do not match',
          },
        ),
    },
  });

  return (
    <FormContext value={form}>
      <View className="mt-2 justify-between" style={{ height: height - 150 }}>
        <View>
          <Text>Hello</Text>
        </View>
        <View className={cn('flex-row justify-between')}>
          <Button
            label="Previous"
            className="bg-primary/10 border-primary w-[49%] border"
            textClassName="text-primary"
            onPress={() => {}}
          />
          <Button
            label="Next"
            className="border-primary w-[49%] border"
            onPress={() => setStep(2)}
          />
        </View>
      </View>
    </FormContext>
  );
}
