import { useWindowDimensions } from 'react-native';
import { Button, ImageUpload, ScrollView, Text, View } from '../../';
import { cn } from '@/lib';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function SignupStepTwoUser({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { height } = useWindowDimensions();
  const { data } = authClient.useSession();
  const [avatarUploaded, setAvatarUploaded] = useState(false);

  const email = data.user.email;

  const handleNext = () => {
    setStep(2);
  };

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

        {email && (
          <ImageUpload
            email={email}
            onUploadComplete={() => setAvatarUploaded(true)}
          />
        )}

        {!email && (
          <View className="mt-4 rounded-lg bg-yellow-50 p-4">
            <Text className="text-sm text-yellow-800">
              Please complete the previous step first
            </Text>
          </View>
        )}
      </ScrollView>

      <View className={cn('flex-row justify-between')}>
        <Button
          label="Previous"
          className="bg-primary/10 border-primary w-[49%] border"
          textClassName="text-primary"
          onPress={() => setStep(1)}
        />

        <Button
          label="Submit"
          className="border-primary w-[49%] border"
          onPress={handleNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
