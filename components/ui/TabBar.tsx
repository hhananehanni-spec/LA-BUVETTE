import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';

const TABS: Record<string, { icon: string; label: string }> = {
  index:  { icon: '≡', label: 'Trending' },
  carte:  { icon: '○', label: 'Carte' },
  listes: { icon: '♥', label: 'Listes' },
  profil: { icon: '●', label: 'Profil' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;
  const isDark = activeRoute === 'profil';

  return (
    <View style={[
      s.bar,
      isDark ? s.dark : s.light,
      { paddingBottom: Math.max(insets.bottom, 10) },
    ]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            style={s.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Text style={[s.icon, focused ? s.focused : (isDark ? s.inactiveDark : s.inactive)]}>
              {tab.icon}
            </Text>
            <Text style={[s.label, focused ? s.focused : (isDark ? s.inactiveDark : s.inactive)]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  light: {
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  dark: {
    backgroundColor: colors.dark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(248,241,231,0.12)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontFamily: 'Georgia',
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  focused: {
    color: colors.rouille,
    fontWeight: '700',
  },
  inactive: {
    color: colors.gray1,
  },
  inactiveDark: {
    color: colors.cream2,
  },
});
