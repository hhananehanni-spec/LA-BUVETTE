import { StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props {
  children: React.ReactNode;
  size?: 'lg' | 'sm';
}

export function EditorialTitle({ children, size = 'lg' }: Props) {
  return <Text style={[s.title, size === 'sm' && s.sm]}>{children}</Text>;
}

function Accent({ children }: { children: React.ReactNode }) {
  return <Text style={s.accent}>{children}</Text>;
}
EditorialTitle.Accent = Accent;

const s = StyleSheet.create({
  title: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1,
    color: colors.ink,
  },
  sm: {
    fontSize: 24,
    lineHeight: 26,
  },
  accent: {
    color: colors.rouille,
  },
});
