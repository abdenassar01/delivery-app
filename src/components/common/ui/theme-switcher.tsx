import { View, Pressable, Text, ScrollView } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

export const ThemeSwitcher = () => {
  const { theme, hasAdaptiveThemes } = useUniwind();

  const themes = [
    { name: 'light', label: 'Light', icon: '☀️' },
    { name: 'dark', label: 'Dark', icon: '🌙' },
    { name: 'ocean', label: 'Ocean', icon: '🌊' },
    { name: 'sunset', label: 'Sunset', icon: '🌅' },
    { name: 'forest', label: 'Forest', icon: '🌲' },
    { name: 'high-contrast', label: 'High Contrast', icon: '♿' },
  ];
  const activeTheme = hasAdaptiveThemes ? 'system' : theme;

  return (
    <View className="gap-4 p-4">
      <Text className="text-foreground text-sm">Current: {activeTheme}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {themes.map(t => (
            <Pressable
              key={t.name}
              onPress={() => Uniwind.setTheme(t.name)}
              className={`items-center rounded-lg px-4 py-3 ${activeTheme === t.name ? 'bg-primary' : 'bg-card border-border border'} `}>
              <Text
                className={`text-2xl ${activeTheme === t.name ? 'text-white' : 'text-foreground'}`}>
                {t.icon}
              </Text>
              <Text
                className={`mt-1 text-xs ${activeTheme === t.name ? 'text-white' : 'text-foreground'}`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
