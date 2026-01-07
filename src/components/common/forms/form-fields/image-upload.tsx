'use client';

import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';
import { useMutation } from 'convex/react';
import { Text } from '../../ui';
import { cn } from '@/lib';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { toast } from 'sonner-native';

type ImageUploadProps = {
  email: string;
  onUploadComplete?: (storageId: Id<'_storage'>) => void;
  className?: string;
  label?: string;
};

export function ImageUpload({
  email,
  onUploadComplete,
  className,
  label = 'Profile Photo',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateUserAvatar = useMutation(api.users.updateUserAvatar);

  const handlePickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Please grant camera roll permissions to upload a photo');
      return;
    }

    // Pick image
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

    setUploading(true);

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload the file to Convex storage
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

      // Step 3: Get the storage ID from the response
      const { storageId } = await uploadResponse.json();

      // Step 4: Update user record with the storage ID
      await updateUserAvatar({ storageId, email });

      // Step 5: Get the URL to display the image
      const fullUrl = `${uploadUrl.split('/_storage')[0]}/${storageId}`;
      setImageUrl(fullUrl);
      onUploadComplete?.(storageId as Id<'_storage'>);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className={cn('flex w-full flex-col', className)}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>
      )}

      <Pressable
        onPress={handlePickImage}
        disabled={uploading}
        className={cn(
          'relative h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50',
          uploading && 'opacity-50',
        )}>
        {uploading ? (
          <>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text className="mt-2 text-sm text-gray-500">Uploading...</Text>
          </>
        ) : imageUrl ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              className="h-full w-full rounded-lg object-cover"
              resizeMode="cover"
            />
            <View className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 opacity-0">
              <Text className="text-sm font-medium text-white">Change</Text>
            </View>
          </>
        ) : (
          <>
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <Text className="text-2xl text-gray-500">+</Text>
            </View>
            <Text className="text-sm text-gray-500">
              Tap to upload profile photo
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
