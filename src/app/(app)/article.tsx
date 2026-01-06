import { View, Text } from 'react-native';
import React from 'react';
import { Header, HeaderWithGoBack, RootWrapper } from '@/components';

export default function Article() {
  return (
    <RootWrapper>
      <Header />
      <Text>Article</Text>
    </RootWrapper>
  );
}
