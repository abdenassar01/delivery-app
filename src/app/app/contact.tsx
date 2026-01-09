import React from 'react';
import {
  RootWrapper,
  Text,
  View,
  FieldInput,
  FormContext,
  Button,
} from '@/components';
import { HeaderWithGoBack } from '@/components';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from '@/lib';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function ContactUs() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        subject: z.string().min(1, 'Subject is required'),
        message: z.string().min(10, 'Message must be at least 10 characters'),
      }),
    },
    onSubmit: async ({ value }) => {
      // TODO: Implement contact form submission
      console.log('Contact form submitted:', value);
      toast.success('Message sent successfully!');
      form.reset();
    },
  });

  return (
    <RootWrapper className="px-4">
      <HeaderWithGoBack />

      <KeyboardAvoidingView
        behavior="padding"
        className="bg-backgroundSecondary flex-1"
        keyboardVerticalOffset={100}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4">
          <View className="mt-3">
            <Text className="text-2xl font-bold text-gray-900">Contact Us</Text>
            <Text className="text-text-secondary mt-1 text-sm">
              Have a question or feedback? We'd love to hear from you.
            </Text>
          </View>

          <FormContext value={form}>
            <View className="border-secondary/10 bg-background-secondary mt-6 rounded-2xl border p-4">
              <View className="gap-3">
                <FieldInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
                <FieldInput
                  label="Email Address"
                  name="email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FieldInput
                  label="Subject"
                  name="subject"
                  placeholder="What is this about?"
                  autoCapitalize="sentences"
                />
                <View className="flex w-full flex-col">
                  <Text className="mb-1 text-sm font-medium text-gray-700">
                    Message
                  </Text>
                  <View className="bg-background-secondary border-primary/10 w-full rounded-xl border p-3">
                    <form.Field
                      name="message"
                      children={(field) => (
                        <TextInput
                          className="text-sm text-gray-900"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          placeholder="Tell us more about your inquiry..."
                          placeholderTextColor="#9ca3af"
                          onChangeText={field.handleChange}
                          multiline
                          numberOfLines={6}
                          textAlignVertical="top"
                          style={{ minHeight: 120 }}
                        />
                      )}
                    />
                  </View>
                  <form.Field
                    name="message"
                    children={(field) => (
                      <>
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <Text className="mt-0.5 text-xs text-red-500">
                              {field.state.meta.errors
                                .map((err: any) => err?.message ?? String(err))
                                .join(', ')}
                            </Text>
                          )}
                      </>
                    )}
                  />
                </View>
              </View>

              <form.Subscribe>
                {({ isSubmitting }) => (
                  <Button
                    label={isSubmitting ? 'Sending...' : 'Send Message'}
                    onPress={form.handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="mt-4"
                  />
                )}
              </form.Subscribe>
            </View>
          </FormContext>

          <View className="mt-6">
            <Text className="text-text-secondary text-center text-sm">
              Or reach us directly at{' '}
              <Text className="text-primary font-medium">support@tanger-deliver.com</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </RootWrapper>
  );
}
