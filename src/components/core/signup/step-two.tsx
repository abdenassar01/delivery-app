import { cn } from '@/lib';
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Button,
  DocumentUpload,
  FieldInput,
  FormContext,
  ImageUpload,
  Text,
} from '../../';
import { useForm } from '@tanstack/react-form';
import z from 'zod';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import * as Icons from '@/icons';
import { useState } from 'react';
import { Id } from 'convex/_generated/dataModel';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export function SignupStepTwo({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();
  const user = useQuery(api.users.getCurrentUser);
  const createCourier = useMutation(api.couriers.createCourier);
  const { replace } = useRouter();
  const [avatar, setAvatar] = useState<Id<'_storage'> | null>(null);
  const [cin, setCin] = useState<Id<'_storage'> | null>(null);

  const form = useForm({
    defaultValues: {
      phone: '',
      address: '',
      cinCode: '',
      avatar,
      cin,
    },
    validators: {
      onSubmit: z.object({
        phone: z.string().min(10, 'Phone number must be at least 10 digits'),
        address: z.string().min(1, 'Address is required'),
        cinCode: z.string().min(1, 'CIN is required'),
        avatar: z.any(),
        cin: z.any(),
      }),
    },
    onSubmitInvalid: ({ formApi, meta }) => {
      console.log('Invalid: ', JSON.stringify(meta));
    },
    onSubmit: async ({ value, formApi }) => {
      formApi.reset();
      createCourier({
        name: user?.name,
        phone: value.phone,
        address: value.address,
        cinCode: value.cinCode,
        status: 'pending',
        totalDeliveries: 0,
        rating: 0,
        avatar,
        cin,
      });
      toast.success('Profile created successfully');
      replace('/');
    },
  });

  if (user === undefined) {
    return <ActivityIndicator size={32} className="mt-5" />;
  }

  return (
    <FormContext value={form}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        className="mt-2 justify-between"
        style={{ height: height - 150 }}>
        <ScrollView
          contentContainerClassName="gap-3 p-1"
          showsVerticalScrollIndicator={false}>
          <FieldInput
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          <FieldInput
            name="address"
            label="Address"
            placeholder="Enter your address"
          />
          <FieldInput
            name="cinCode"
            label="CIN (National ID Number)"
            placeholder="Enter your CIN"
          />
          <View className="mb-6 aspect-square w-1/2">
            {user?.email && (
              <ImageUpload onUploadComplete={id => setAvatar(id)} />
            )}
          </View>

          <View>
            <View className="mb-3 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                <Icons.Icon
                  icon={Icons.Hugeicons.IdFreeIcons}
                  size={18}
                  strokeWidth={2}
                  className="text-indigo-600"
                />
              </View>
              <View>
                <Text className="text-sm font-semibold text-gray-900">
                  Identification Documents
                </Text>
                <Text className="text-xs text-gray-500">
                  Upload your ID card (front and back)
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <DocumentUpload
                label="ID Card (CIN)"
                description="Upload the front side of your national ID"
                onUploadComplete={id => setCin(id)}
              />
            </View>
          </View>

          <View className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <View className="flex-row gap-3">
              <View className="h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Icons.Icon
                  icon={Icons.Hugeicons.InformationCircleFreeIcons}
                  size={14}
                  strokeWidth={2}
                  className="text-amber-600"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-amber-900">
                  Verification Required
                </Text>
                <Text className="mt-1 text-xs text-amber-800">
                  Your documents will be verified before you can start accepting
                  deliveries. This usually takes 1-2 business days.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          className={cn(
            'bg-background border-primary/10 flex-row justify-between rounded-2xl border p-1',
          )}>
          <Button
            label="Previous"
            className="bg-primary/10 border-primary w-[49%] border"
            textClassName="text-primary"
            onPress={() => {
              setStep(1);
            }}
          />
          <Button
            label="Submit"
            className="w-[49%]"
            onPress={form.handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </FormContext>
  );
}
