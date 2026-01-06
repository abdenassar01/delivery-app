import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="article" />
    </Tabs>
  );
}
