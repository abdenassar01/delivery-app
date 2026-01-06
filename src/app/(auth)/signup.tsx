import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Alert } from 'react-native';
import { HeaderWithGoBack, RootWrapper, Text, Button } from '@/components';
import { FieldInput, FormContext } from '@/components/common/forms';
import { useForm } from '@tanstack/react-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import * as DocumentPicker from 'expo-document-picker';
import type { UserRole } from '@/types';
import { useMutation, useConvex } from 'convex/react';
import { api } from 'convex/_generated/api';

type SignupStep = 'role-selection' | 'basic-info' | 'delivery-details';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  vehicleType?: string;
  licenseNumber?: string;
}

export default function Signup() {
  const router = useRouter();
  const updateUserRole = useMutation(api.users.updateUserRole);

  const [step, setStep] = useState<SignupStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      vehicleType: '',
      licenseNumber: '',
    },
  });

  const totalSteps = selectedRole === 'delivery' ? 3 : 2;
  const currentStepNumber =
    step === 'role-selection'
      ? 1
      : step === 'basic-info'
        ? 2
        : step === 'delivery-details'
          ? 3
          : 1;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('basic-info');
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setStep('role-selection');
  };

  const handleBasicInfoNext = async () => {
    const values = form.state.values;
    if (!values.name || !values.email || !values.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedRole === 'delivery') {
      setStep('delivery-details');
    } else {
      await handleSignup();
    }
  };

  const handlePickVehiclePhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVehiclePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSignup = async () => {
    const values = form.state.values;
    if (!values.name || !values.email || !values.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedRole === 'delivery') {
      if (!values.phone || !values.vehicleType || !values.licenseNumber) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
    }

    setIsLoading(true);
    try {
      await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: '/(app)',
      });

      // Update user role after successful signup
      if (selectedRole) {
        try {
          await updateUserRole({ email: values.email, role: selectedRole });
        } catch (error) {
          console.error('Failed to update user role:', error);
        }
      }

      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <View className="">
      <Text className="mb-2 text-center text-2xl font-bold">
        Choose your role
      </Text>
      <Text className="text-text-secondary mb-6 text-center">
        Select how you want to use TDelivery
      </Text>

      <TouchableOpacity
        onPress={() => handleRoleSelect('user')}
        className="bg-background dark:bg-backgroundDark mb-4 rounded-2xl p-6 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="bg-primary/20 h-16 w-16 items-center justify-center rounded-full">
            <Text className="text-3xl">👤</Text>
          </View>
          <View className="">
            <Text className="mb-1 text-lg font-semibold">Client</Text>
            <Text className="text-text-secondary text-sm">
              Order deliveries and track packages
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleRoleSelect('delivery')}
        className="bg-background dark:bg-backgroundDark rounded-2xl p-6 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="bg-primary/20 h-16 w-16 items-center justify-center rounded-full">
            <Text className="text-3xl">🚚</Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-lg font-semibold">Delivery Driver</Text>
            <Text className="text-text-secondary text-sm">
              Earn money by delivering packages
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View className="flex-1">
      <Text className="mb-2 text-center text-2xl font-bold">
        Create your account
      </Text>
      <Text className="text-text-secondary mb-6 text-center">
        {selectedRole === 'delivery'
          ? 'Start your delivery driver journey'
          : 'Join TDelivery today'}
      </Text>

      <FormContext value={form}>
        <FieldInput
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
        />
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
          placeholder="Create a password"
          password
        />
      </FormContext>

      <View className="mt-6 flex-row justify-between">
        <TouchableOpacity
          onPress={handleBackToRoleSelection}
          className="flex-1 rounded-xl bg-gray-200 px-4 py-3 dark:bg-gray-700">
          <Text className="text-center font-semibold dark:text-white">
            Back
          </Text>
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity
          onPress={handleBasicInfoNext}
          className="bg-primary flex-1 rounded-xl px-4 py-3">
          <Text className="text-center font-semibold text-white">
            {selectedRole === 'delivery' ? 'Next' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeliveryDetails = () => (
    <View className="flex-1">
      <Text className="mb-2 text-center text-2xl font-bold">
        Driver Details
      </Text>
      <Text className="text-text-secondary mb-6 text-center">
        Tell us about your vehicle
      </Text>

      <FormContext value={form}>
        <FieldInput
          label="Phone Number"
          name="phone"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        <FieldInput
          label="Vehicle Type"
          name="vehicleType"
          placeholder="e.g., Car, Motorcycle, Bicycle"
        />
        <FieldInput
          label="License Number"
          name="licenseNumber"
          placeholder="Enter your license number"
        />

        <View className="mt-4">
          <Text className="text-text dark:text-textdark mb-2 font-medium">
            Vehicle Photo
          </Text>
          <TouchableOpacity
            onPress={handlePickVehiclePhoto}
            className="bg-background-secondary dark:bg-backgroundSecondaryDark flex-row items-center gap-3 rounded-xl p-4">
            {vehiclePhoto ? (
              <>
                <Image
                  source={{ uri: vehiclePhoto }}
                  className="h-12 w-12 rounded-lg"
                />
                <Text className="flex-1">Photo selected</Text>
              </>
            ) : (
              <>
                <View className="bg-primary/20 h-12 w-12 items-center justify-center rounded-full">
                  <Text className="text-2xl">📷</Text>
                </View>
                <Text className="text-text-secondary flex-1">
                  Tap to upload vehicle photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </FormContext>

      <View className="mt-6 flex-row justify-between">
        <TouchableOpacity
          onPress={() => setStep('basic-info')}
          className="flex-1 rounded-xl bg-gray-200 px-4 py-3 dark:bg-gray-700">
          <Text className="text-center font-semibold dark:text-white">
            Back
          </Text>
        </TouchableOpacity>
        <View className="w-3" />
        <TouchableOpacity
          onPress={handleSignup}
          disabled={isLoading}
          className={`flex-1 rounded-xl px-4 py-3 ${isLoading ? 'bg-gray-400' : 'bg-primary'}`}>
          <Text className="text-center font-semibold text-white">
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProgressIndicator = () => (
    <View className="mb-6 flex-row items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index < currentStepNumber
              ? 'bg-primary'
              : 'bg-background-secondary dark:bg-backgroundSecondaryDark'
          }`}
          style={{ width: index < currentStepNumber ? 32 : 8 }}
        />
      ))}
    </View>
  );

  return (
    <RootWrapper className="px-3">
      <KeyboardAvoidingView behavior="padding" className="">
        <ScrollView className="">
          <HeaderWithGoBack />
          {step !== 'role-selection' && renderProgressIndicator()}
          {step === 'role-selection' && renderRoleSelection()}
          {step === 'basic-info' && renderBasicInfo()}
          {step === 'delivery-details' && renderDeliveryDetails()}
        </ScrollView>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
