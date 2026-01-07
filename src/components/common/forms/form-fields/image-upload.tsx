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
import * as Icons from '@/icons';

type ImageUploadProps = {
  onUploadComplete?: (storageId: Id<'_storage'>) => void;
  className?: string;
  label?: string;
};

export function ImageUpload({
  onUploadComplete,
  className,
  label = 'Profile Photo',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

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

      setImageUrl(asset.uri);
      onUploadComplete?.(storageId);
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
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
      )}

      <Pressable
        onPress={handlePickImage}
        disabled={uploading}
        className={cn(
          'bg-background-secondary border-primary/10 relative aspect-square w-full flex-col items-center justify-center rounded-2xl border',
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
              className="h-full w-full rounded-xl object-cover"
              resizeMode="cover"
            />
            <View className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/30 opacity-0">
              <Text className="text-sm font-medium text-white">Change</Text>
            </View>
          </>
        ) : (
          <>
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <Icons.Icon
                icon={Icons.Hugeicons.ImageUploadFreeIcons}
                size={24}
                strokeWidth={1.5}
                className="text-gray-500"
              />
            </View>
            <Text className="text-center text-sm text-gray-500">
              Tap to upload profile photo
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
