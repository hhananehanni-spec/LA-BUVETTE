import { StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props {
  rank: number;
  featured?: boolean;
}

export function RankNum({ rank, featured = false }: Props) {
  const label = String(rank).padStart(2, '0');
  return <Text style={[s.num, featured && s.featured]}>{label}</Text>;
}

const s = StyleSheet.create({
  num: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    color: colors.ink,
    width: 32,
  },
  featured: {
    color: colors.rouille,
  },
});
