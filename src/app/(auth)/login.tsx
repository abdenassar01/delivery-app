import React, { useState } from 'react';
import {
  RootWrapper,
  Text,
  View,
  FieldInput,
  FormContext,
  Button,
} from '@/components';
import { Link, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { authClient } from '@/lib/auth-client';
import { z } from 'zod';
import { toast } from 'sonner-native';

export default function Login() {
  const { replace } = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: z.object({
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
          .string('Password is required')
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          ),
      }),
    },

    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            formApi.reset();
            toast.success('Login successful');
            replace('/');
          },
          onError: error => {
            toast.error(error.error.message || 'Login failed');
          },
        },
      });

      formApi.reset();
    },
  });

  return (
    <RootWrapper className="flex-1 px-4">
      <KeyboardAvoidingView
        behavior="padding"
        className="bg-backgroundSecondary mb-3 flex-1 justify-center rounded-2xl">
        <Text className="text-center text-2xl font-bold">Welcome back!</Text>
        <Text className="text-text-secondary mb-8 text-center">
          Sign in to continue to TDelivery
        </Text>

        <FormContext value={form}>
          <FieldInput
            label="Email"
            name="email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FieldInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            password
          />
          <form.Subscribe>
            {({ isSubmitting }) => (
              <Button
                label="Sign In"
                onPress={form.handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                className="mt-6"
              />
            )}
          </form.Subscribe>
        </FormContext>

        <View className="mt-4 flex-row justify-center">
          <Text className="text-text-secondary text-sm">
            Don't have an account?{' '}
          </Text>
          <Link asChild href="/signup">
            <Text className="text-primary text-sm font-medium">Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
