'use client';

import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useMutation } from 'convex/react';
import { Text } from '../../ui';
import { cn } from '@/lib';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import * as Icons from '@/icons';

type DocumentUploadProps = {
  label: string;
  description?: string;
  onUploadComplete?: (storageId: Id<'_storage'>) => void;
  className?: string;
  acceptedFileTypes?: string[];
};

export function DocumentUpload({
  label,
  description,
  onUploadComplete,
  className,
  acceptedFileTypes = ['application/pdf', 'image/*'],
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedFileTypes,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (!file || !file.uri) {
        return;
      }

      setUploading(true);
      setFileName(file.name);

      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload the file to Convex storage
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': file.mimeType || 'application/pdf',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload document');
      }

      // Step 3: Get the storage ID from the response
      const { storageId } = await uploadResponse.json();

      // Step 4: Return the storage ID
      onUploadComplete?.(storageId as Id<'_storage'>);
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to upload document. Please try again.',
      );
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className={cn('flex w-full flex-col', className)}>
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
      {description && (
        <Text className="mb-1 text-xs text-gray-500">{description}</Text>
      )}

      <Pressable
        onPress={handlePickDocument}
        disabled={uploading}
        className={cn(
          'bg-background-secondary border-primary/10 relative min-h-24 w-full flex-row items-center justify-center gap-3 rounded-2xl border p-4',
          uploading && 'opacity-50',
        )}>
        {uploading ? (
          <>
            <ActivityIndicator size="small" color="#6366f1" />
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">
                Uploading...
              </Text>
              <Text className="text-xs text-gray-500">
                {fileName || 'Please wait...'}
              </Text>
            </View>
          </>
        ) : fileName ? (
          <>
            <View className="h-16 w-16 items-center justify-center rounded-xl bg-green-100">
              <Icons.Icon
                icon={Icons.Hugeicons.TickDouble01FreeIcons}
                size={24}
                strokeWidth={2.5}
                className="text-green-600"
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-sm font-semibold text-gray-900"
                numberOfLines={1}>
                {fileName}
              </Text>
              <Text className="text-xs text-green-600">
                Document uploaded successfully
              </Text>
            </View>
            <Pressable
              onPress={handlePickDocument}
              className="h-8 w-8 items-center justify-center rounded-xl bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.RefreshFreeIcons}
                size={16}
                strokeWidth={1.5}
                className="text-gray-600"
              />
            </Pressable>
          </>
        ) : (
          <>
            <View className="h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
              <Icons.Icon
                icon={Icons.Hugeicons.FileUploadFreeIcons}
                size={24}
                strokeWidth={1.5}
                className="text-gray-600"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700">
                Tap to upload document
              </Text>
              <Text className="text-xs text-gray-500">PDF or Images</Text>
            </View>
            <Icons.Icon
              icon={Icons.Hugeicons.CircleArrowDown01FreeIcons}
              size={20}
              strokeWidth={1.5}
              className="text-gray-400"
            />
          </>
        )}
      </Pressable>
    </View>
  );
}
