import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { router } from 'expo-router';
import { TextInput } from 'react-native';

export default function PersonalInformationScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const user = useQuery(api.users.getCurrentUser);
  const updateUser = useMutation(api.users.update);

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    try {
      await updateUser({
        userId: user?._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const fields = [
    {
      key: 'name' as const,
      label: 'Full Name',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.UserFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      placeholder: 'Enter your full name',
      keyboardType: 'default' as const,
    },
    {
      key: 'email' as const,
      label: 'Email Address',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Mail01FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      placeholder: 'Enter your email',
      keyboardType: 'email-address' as const,
    },
    {
      key: 'phone' as const,
      label: 'Phone Number',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.PhoneFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      placeholder: 'Enter your phone number',
      keyboardType: 'phone-pad' as const,
    },
  ];

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="mt-3">
        <Text className="text-lg font-medium">Personal Information</Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-3 rounded-2xl border p-2">
        <View>
          {fields.map((field, index) => (
            <React.Fragment key={field.key}>
              <View className="flex-col gap-1">
                <Text className="text-xs text-gray-500">{field.label}</Text>
                <View className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    {field.icon}
                  </View>
                  <TextInput
                    className="text-sm flex-1 text-gray-900"
                    value={formData[field.key]}
                    onChangeText={(text) =>
                      setFormData({ ...formData, [field.key]: text })
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor="#9ca3af"
                    keyboardType={field.keyboardType}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              {index < fields.length - 1 && (
                <View className="bg-secondary/10 my-2 h-px w-full rounded-full" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View className="mt-6">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary flex-row items-center justify-center gap-2 rounded-2xl p-4 py-3">
          <Icons.Icon
            icon={Icons.Hugeicons.Save01FreeIcons}
            size={20}
            strokeWidth={2}
            color="white"
          />
          <Text className="text-base font-semibold text-white">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </RootWrapper>
  );
}
