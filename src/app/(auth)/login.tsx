import React, { useState } from 'react';
import {
  RootWrapper,
  Text,
  View,
  FieldInput,
  FormContext,
} from '@/components';
import { Link, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TouchableOpacity, Alert } from 'react-native';
import { authClient } from '@/lib/auth-client';
import { ActivityIndicator } from 'react-native';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async () => {
    const values = form.state.values;
    if (!values.email || !values.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/(app)',
      });

      if (result.error) {
        Alert.alert('Error', result.error.message || 'Login failed');
      } else {
        replace('/(app)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootWrapper className="flex-1 px-3">
      <KeyboardAvoidingView
        behavior="padding"
        className="bg-backgroundSecondary dark:bg-backgroundSecondaryDark mb-3 flex-1 justify-center rounded-2xl p-6">
        <Text className="mb-6 text-center text-2xl font-bold">Welcome back!</Text>
        <Text className="mb-8 text-center text-text-secondary">
          Sign in to continue to TDelivery
        </Text>

        <FormContext value={form}>
          <FieldInput
            label="Email"
            name="email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-background dark:bg-backgroundDark"
          />
          <FieldInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            password
            className="bg-background dark:bg-backgroundDark mt-4"
          />
        </FormContext>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`mt-6 items-center justify-center rounded-xl p-3 ${
            isLoading ? 'bg-gray-400' : 'bg-primary'
          }`}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-medium text-backgroundSecondary dark:text-backgroundSecondaryDark">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-4 flex-row justify-center">
          <Text className="text-sm text-text-secondary">
            Don't have an account?{' '}
          </Text>
          <Link asChild href="/signup">
            <Text className="text-sm font-medium text-primary">Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
