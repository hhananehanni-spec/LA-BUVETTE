import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/tokens';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Pill({ label, active = false, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.pill, active && s.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[s.text, active && s.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  active: {
    backgroundColor: colors.ink,
  },
  text: {
    fontSize: 11,
    color: colors.ink,
  },
  activeText: {
    color: colors.cream,
  },
});
