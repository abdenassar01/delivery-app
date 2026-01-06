import React, { useState } from 'react';
import { RootWrapper, Text, View, FieldInput, FormContext } from '@/components';
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

  const form = useForm({
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
        <Text className="mb-6 text-center text-2xl font-bold">
          Welcome back!
        </Text>
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
            <Text className="text-backgroundSecondary dark:text-backgroundSecondaryDark font-medium">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

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
