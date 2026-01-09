import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { HomeScreenByRole, RootWrapper } from '@/components';

export default function HomeScreen() {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) {
    return (
      <RootWrapper className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </RootWrapper>
    );
  }

  return <HomeScreenByRole user={user} />;
}
