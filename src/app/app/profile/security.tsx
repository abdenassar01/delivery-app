import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Icons from '@/icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import { HeaderWithGoBack, RootWrapper, Text } from '@/components';
import { useCSSVariable } from 'uniwind';
import { TextInput } from 'react-native';

export default function SecurityScreen() {
  const primary = useCSSVariable('--color-primary') as string;
  const secondary = useCSSVariable('--color-secondary') as string;
  const user = useQuery(api.users.getCurrentUser);
  const updatePassword = useMutation(api.users.updatePassword);

  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await updatePassword({
        userId: user?._id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password');
    }
  };

  const securityOptions = [
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.Shield01FreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      action: 'Coming Soon',
      enabled: false,
    },
    {
      title: 'Biometric Authentication',
      description: 'Use Face ID or fingerprint to unlock your account',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.FingerprintFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      action: 'Enable',
      enabled: true,
    },
    {
      title: 'Login Alerts',
      description: 'Get notified when someone logs into your account',
      icon: (
        <Icons.Icon
          icon={Icons.Hugeicons.BellFreeIcons}
          size={16}
          strokeWidth={2}
          color={secondary}
        />
      ),
      action: 'Enabled',
      enabled: true,
    },
  ];

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <View className="mt-3">
        <Text className="text-lg font-medium">Security</Text>
      </View>

      {/* Change Password */}
      <View className="mt-3">
        <Text className="text-sm font-medium text-gray-500">
          Change Password
        </Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-2 rounded-2xl border p-2">
        <View>
          {[
            {
              key: 'currentPassword' as const,
              label: 'Current Password',
              placeholder: 'Enter current password',
              secure: true,
            },
            {
              key: 'newPassword' as const,
              label: 'New Password',
              placeholder: 'Enter new password',
              secure: true,
            },
            {
              key: 'confirmPassword' as const,
              label: 'Confirm New Password',
              placeholder: 'Confirm new password',
              secure: true,
            },
          ].map((field, index) => (
            <React.Fragment key={field.key}>
              <View className="flex-col gap-1">
                <Text className="text-xs text-gray-500">{field.label}</Text>
                <View className="flex-row items-center gap-3">
                  <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                    <Icons.Icon
                      icon={Icons.Hugeicons.LockPasswordFreeIcons}
                      size={16}
                      strokeWidth={2}
                      color={secondary}
                    />
                  </View>
                  <TextInput
                    className="text-sm flex-1 text-gray-900"
                    value={formData[field.key]}
                    onChangeText={(text) =>
                      setFormData({ ...formData, [field.key]: text })
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={field.secure}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              {index < 2 && (
                <View className="bg-secondary/10 my-2 h-px w-full rounded-full" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View className="mt-4">
        <TouchableOpacity
          onPress={handleUpdatePassword}
          className="bg-primary flex-row items-center justify-center gap-2 rounded-2xl p-4 py-3">
          <Icons.Icon
            icon={Icons.Hugeicons.Save01FreeIcons}
            size={20}
            strokeWidth={2}
            color="white"
          />
          <Text className="text-base font-semibold text-white">
            Update Password
          </Text>
        </TouchableOpacity>
      </View>

      {/* Security Options */}
      <View className="mt-6">
        <Text className="text-sm font-medium text-gray-500">
          Security Settings
        </Text>
      </View>

      <View className="border-secondary/10 bg-background-secondary mt-2 rounded-2xl border p-2">
        <View>
          {securityOptions.map((option, index) => (
            <React.Fragment key={option.title}>
              <TouchableOpacity className="flex-row items-center gap-3">
                <View className="bg-secondary/10 h-10 w-10 items-center justify-center rounded-xl">
                  {option.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    {option.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {option.description}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-2 py-1 ${
                    option.enabled
                      ? 'bg-success/10'
                      : 'bg-gray-100'
                  }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      option.enabled
                        ? 'text-success'
                        : 'text-gray-500'
                    }`}>
                    {option.action}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < securityOptions.length - 1 && (
                <View className="bg-secondary/10 my-1 h-px w-full rounded-full" />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Danger Zone */}
      <View className="mt-6">
        <Text className="text-sm font-medium text-error">Danger Zone</Text>
      </View>

      <View className="border-error/20 bg-error/5 mt-2 rounded-2xl border p-4">
        <Text className="text-sm font-semibold text-gray-900">
          Delete Account
        </Text>
        <Text className="mt-1 text-xs text-gray-500">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </Text>
        <TouchableOpacity
          onPress={() => {
            // TODO: Implement account deletion
            alert('This feature is coming soon');
          }}
          className="border-error/20 mt-3 flex-row items-center justify-center gap-2 self-start rounded-xl border px-4 py-2">
          <Icons.Icon
            icon={Icons.Hugeicons.Delete02FreeIcons}
            size={16}
            strokeWidth={2}
            color="#cc0202"
          />
          <Text className="text-error text-sm font-semibold">
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </RootWrapper>
  );
}
