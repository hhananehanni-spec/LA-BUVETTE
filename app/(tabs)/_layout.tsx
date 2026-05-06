import { Tabs } from 'expo-router';
import { TabBar } from '../../components/ui/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="carte" />
      <Tabs.Screen name="listes" />
      <Tabs.Screen name="profil" />
    </Tabs>
  );
}
