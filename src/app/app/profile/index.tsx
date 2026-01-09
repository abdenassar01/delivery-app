import {
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import {
  RootWrapper,
  Text,
  FieldInput,
  FormContext,
  Button,
  HeaderWithGoBack,
} from '@/components';
import { useCSSVariable } from 'uniwind';
import * as ImagePicker from 'expo-image-picker';
import { toast } from '@/lib';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const user = useQuery(api.users.getCurrentUser);
  const updateUserAvatar = useMutation(api.users.updateUserAvatar);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfile = useMutation(api.users.update);

  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.email('Invalid email'),
        phone: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      await updateProfile({
        name: value.name,
        email: value.email,
        phone: value.phone,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
  });

  React.useEffect(() => {
    if (user && !isEditing) {
      form.setFieldValue('name', user.name || '');
      form.setFieldValue('email', user.email || '');
    }
  }, [user, isEditing]);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    if (!asset || !asset.uri) {
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': asset.mimeType || 'image/jpeg',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { storageId } = await uploadResponse.json();
      await updateUserAvatar({ storageId });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error('Error uploading image:', error);
    }
  };

  const handleCancel = () => {
    form.setFieldValue('name', user?.name || '');
    form.setFieldValue('email', user?.email || '');
    form.setFieldValue('phone', user?.phone || '');
    setIsEditing(false);
  };

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-32">
          <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-6">
            <View className="items-center">
              <TouchableOpacity
                onPress={handleImageUpload}
                className="bg-primary/10 relative mb-4 h-24 w-24 items-center justify-center rounded-full">
                {user?.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <Icons.Icon
                    icon={Icons.Hugeicons.UserFreeIcons}
                    size={40}
                    strokeWidth={1.5}
                    color={primary}
                  />
                )}
                <View className="bg-primary border-background absolute right-0 bottom-0 h-8 w-8 items-center justify-center rounded-full border-2">
                  <Icons.Icon
                    icon={Icons.Hugeicons.CameraFreeIcons}
                    size={14}
                    strokeWidth={2}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">
                {user?.name || 'User'}
              </Text>
              <Text className="text-sm text-gray-500">{user?.email}</Text>
              <View className="bg-primary/10 mt-3 flex-row items-center gap-1 rounded-full px-3 py-1">
                <Icons.Icon
                  icon={Icons.Hugeicons.Male02FreeIcons}
                  size={14}
                  strokeWidth={2}
                  color={primary}
                />
                <Text className="text-primary text-xs font-medium capitalize">
                  {user?.role || 'User'}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit Button */}
          {!isEditing && (
            <View className="mt-3">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-secondary flex-row items-center justify-center gap-2 rounded-2xl p-4 py-3">
                <Icons.Icon
                  icon={Icons.Hugeicons.Edit01FreeIcons}
                  size={20}
                  strokeWidth={2}
                  color="white"
                />
                <Text className="text-base font-semibold text-white">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Information Form */}
          <View className="mt-3">
            <Text className="text-lg font-medium">Profile Information</Text>
          </View>

          <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-4">
            <FormContext value={form}>
              <View className="gap-3">
                <FieldInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                />
                <FieldInput
                  label="Email Address"
                  name="email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={!isEditing}
                />
                <FieldInput
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  disabled={!isEditing}
                />
              </View>

              {/* Form Actions */}
              {isEditing && (
                <View className="mt-4 flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="bg-secondary/20 flex-row items-center justify-center gap-2 rounded-2xl p-4 py-3">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Cancel01FreeIcons}
                      size={20}
                      strokeWidth={2}
                      color={secondary}
                    />
                    <Text className="text-secondary text-base font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <form.Subscribe>
                    {({ isSubmitting }) => (
                      <Button
                        label={isSubmitting ? 'Saving...' : 'Save Changes'}
                        onPress={form.handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className=""
                      />
                    )}
                  </form.Subscribe>
                </View>
              )}
            </FormContext>
          </View>

          {/* Stats */}
          <View className="mt-4 flex-row gap-3">
            <View className="border-secondary/10 bg-background-secondary rounded-2xl border p-4">
              <View className="bg-primary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.NewReleasesFreeIcons}
                  size={20}
                  strokeWidth={2}
                  color={primary}
                />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                {user?.isVerified ? 'Verified' : '-'}
              </Text>
              <Text className="text-xs text-gray-500">Status</Text>
            </View>

            <View className="border-secondary/10 bg-background-secondary flex-1 rounded-2xl border p-4">
              <View className="bg-secondary/10 mb-2 h-10 w-10 items-center justify-center rounded-full">
                <Icons.Icon
                  icon={Icons.Hugeicons.DollarCircleFreeIcons}
                  size={20}
                  strokeWidth={2}
                  color={secondary}
                />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                ${user?.balance || '0'}
              </Text>
              <Text className="text-xs text-gray-500">Balance</Text>
            </View>
          </View>

          {/* Additional Profile Sections */}
          <View className="mt-4">
            <Text className="text-lg font-medium">Account Settings</Text>
          </View>

          <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-2">
            <View>
              <Link href="/app/profile/addresses" asChild>
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Location01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Delivery Addresses
                  </Text>
                  <View className="ml-auto">
                    <Icons.Icon
                      icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
              <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />

              <Link href="/app/profile/wallet" asChild>
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Wallet03FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Payment Methods
                  </Text>
                  <View className="ml-auto">
                    <Icons.Icon
                      icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
              <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />

              <Link href="/app/profile/security" asChild>
                <TouchableOpacity className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    <Icons.Icon
                      icon={Icons.Hugeicons.Shield01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Security
                  </Text>
                  <View className="ml-auto">
                    <Icons.Icon
                      icon={Icons.Hugeicons.ArrowRight01FreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
