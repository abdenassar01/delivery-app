import React from 'react';
import { View } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { AdminHomeScreen } from '../app/admin/home';
import { CourierHomeScreen } from '../app/courier/home';
import { UserHomeScreen } from '../app/user/home';

export default function HomeScreen() {
  const user = useQuery(api.users.getCurrentUser);

  // Route to appropriate home screen based on user role
  if (user?.role === 'admin') {
    return <AdminHomeScreen user={user} />;
  }

  if (user?.role === 'delivery') {
    return <CourierHomeScreen user={user} />;
  }

  // Default to user home screen
  return <UserHomeScreen user={user} />;
}
