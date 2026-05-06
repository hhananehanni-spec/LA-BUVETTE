import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props {
  left: string;
  right?: string;
}

export function Kicker({ left, right }: Props) {
  return (
    <View style={s.row}>
      <Text style={s.left}>{left}</Text>
      {right ? <Text style={s.right}>{right}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 8,
  },
  left: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.rouille,
  },
  right: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.gray2,
  },
});
