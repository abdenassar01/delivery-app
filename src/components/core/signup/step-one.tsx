import z from 'zod';
import { Button, FieldInput, FormContext, Text, View } from '../../';
import { useForm } from '@tanstack/react-form';
import { useWindowDimensions } from 'react-native';
import { cn } from '@/lib';
import { ScrollView } from 'react-native-gesture-handler';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

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
        })
        .refine(
          data => {
            if (data.password !== data.passwordConfirmation) {
              return false;
            }
            return true;
          },
          {
            path: ['passwordConfirmation'],
            error: 'Passwords do not match',
          },
        ),
    },
    onSubmit: async ({ value, formApi }) => {
      console.log('value: ', value);
      authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        fetchOptions: {
          onSuccess: context => {
            formApi.reset();
            setStep(2);
            toast.success('User created successfully');
          },
          onError: context => {
            console.log('context: ', context);
            toast.error(context.error.message);
          },
        },
      });
    },
  });

  return (
    <FormContext value={form}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        className="mt-2 justify-between"
        style={{ height: height - 150 }}>
        <ScrollView
          className=""
          contentContainerClassName="px-1 gap-3"
          showsVerticalScrollIndicator={false}>
          <FieldInput
            name="name"
            label="Full name"
            placeholder="Enter your full name"
          />
          <FieldInput
            name="email"
            label="Email"
            placeholder="Enter your email"
            autoCapitalize="none"
          />
          <FieldInput
            name="password"
            label="Password"
            placeholder="Enter your password"
            password
          />

          <FieldInput
            name="passwordConfirmation"
            label="Confirm Password"
            placeholder="Confirm your password"
            password
          />
        </ScrollView>
        <View
          className={cn(
            'bg-background border-primary/10 flex-row justify-between rounded-2xl border p-1',
          )}>
          <Button
            label="Previous"
            className="bg-primary/10 border-primary w-[49%] border"
            textClassName="text-primary"
            onPress={() => setStep(0)}
          />

          <form.Subscribe>
            {({ isSubmitting }) => (
              <Button
                label="Next"
                onPress={form.handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-[49%]"
              />
            )}
          </form.Subscribe>
        </View>
      </KeyboardAvoidingView>
    </FormContext>
  );
}
