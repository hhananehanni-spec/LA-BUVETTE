import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';

export default function ProfilScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.center}>
        <Text style={s.label}>Profil</Text>
        <Text style={s.sub}>Sprint 1</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.dark },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Georgia', fontWeight: '700', fontSize: 28, color: colors.cream },
  sub: { fontSize: 12, color: colors.cream2, marginTop: 6 },
});
