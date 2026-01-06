import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Header, HeaderWithGoBack, RootWrapper } from '@/components';

export default function Signup() {
  return (
    <RootWrapper className="px-3">
      <ScrollView className="">
        <HeaderWithGoBack />
        <Text>Sign Up</Text>
      </ScrollView>
    </RootWrapper>
  );
}
