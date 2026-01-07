import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { Button, ImageUpload, ScrollView, Text, View } from '../../';
import { cn } from '@/lib';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { useRouter } from 'expo-router';

export function SignupStepTwoUser({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();
  const { replace } = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const setUserAvatar = useMutation(api.users.updateUserAvatar);

  if (user === undefined) {
    return <ActivityIndicator className="mt-5" size={32} />;
  }

  const email = user.email;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      className="mt-2 justify-between"
      style={{ height: height - 150 }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="mb-1 text-lg font-semibold text-gray-900">
            Add your profile photo
          </Text>
          <Text className="text-sm text-gray-500">
            Add a photo so people can recognize you
          </Text>
        </View>

        <View className="items-center justify-center">
          <View className="aspect-square w-1/2">
            {email && (
              <ImageUpload
                onUploadComplete={id => setUserAvatar({ storageId: id })}
              />
            )}
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
          onPress={() => setStep(1)}
        />
        <Button
          label="Submit"
          className="border-primary w-[49%] border"
          onPress={() => replace('/')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
