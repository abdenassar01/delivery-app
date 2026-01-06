import React from 'react';
import {
  Button,
  RootWrapper,
  Text,
  View,
  FieldInput,
  FormContext,
} from '@/components';
import { useIsFirstTime } from '@/lib';
import { Link, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function Login() {
  const { setIsFirstTime } = useIsFirstTime();
  const { replace } = useRouter();

  const form = useForm();

  return (
    <RootWrapper className="flex-1 px-3">
      <KeyboardAvoidingView
        behavior="padding"
        className="bg-backgroundSecondary dark:bg-backgroundSecondaryDark mb-3 rounded-2xl p-2">
        <Text className="text-center text-xl font-medium">Welcome back!</Text>
        <FormContext value={form}>
          <FieldInput
            label="Email"
            name="email"
            placeholder="Enter your email"
            className="bg-background dark:bg-backgroundDark"
          />
          <FieldInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            password
            className="bg-background dark:bg-backgroundDark"
          />
        </FormContext>
        <Button
          label="Go Onboarding"
          className="my-2"
          onPress={() => {
            setIsFirstTime(true);
            replace('/onboarding');
          }}
        />
        <Text className="mb-2 text-center text-sm">
          Don't have an account?{' '}
          <Link asChild href="/signup">
            <Text className="text-primary">Sign up</Text>
          </Link>
        </Text>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
