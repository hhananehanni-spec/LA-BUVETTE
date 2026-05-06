import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Kicker } from '../../components/ui/Kicker';
import { Pill } from '../../components/ui/Pill';
import { RankNum } from '../../components/ui/RankNum';
import { ARR_FILTERS, MOCK_SPOTS, type Spot } from '../../mock/spots';
import { colors } from '../../theme/tokens';

export default function TrendingScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('Tous');

  const spots =
    activeFilter === 'Tous'
      ? MOCK_SPOTS
      : MOCK_SPOTS.filter((s) => s.arrondissement === parseInt(activeFilter));

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* ── Top nav ── */}
      <View style={s.nav}>
        <Text style={s.logo}>
          La Buvette<Text style={s.dot}>.</Text>
        </Text>
        <View style={s.iconBtn}>
          <Text style={s.burger}>☰</Text>
        </View>
      </View>

      {/* ── Arrondissement filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
      >
        {ARR_FILTERS.map((f) => (
          <Pill
            key={f}
            label={f}
            active={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
      </ScrollView>

      {/* ── Kicker ── */}
      <Kicker left="Trending — semaine 19" right="↗ Paris" />

      {/* ── Ranking list ── */}
      <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
        {spots.map((spot, i) => (
          <SpotRow key={spot.id} spot={spot} last={i === spots.length - 1} />
        ))}
        <View style={s.listBottom} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SpotRow({ spot, last }: { spot: Spot; last: boolean }) {
  const isTop = spot.rank === 1;
  const isUp = spot.trend > 0;

  return (
    <TouchableOpacity
      style={[s.spot, !last && s.spotBorder]}
      activeOpacity={0.7}
    >
      <RankNum rank={spot.rank} featured={isTop} />
      <View style={s.spotInfo}>
        <Text style={s.spotName}>{spot.name}</Text>
        <Text style={s.spotMeta}>
          {spot.arrondissement}e arr. · {spot.type}
        </Text>
        <View style={s.stats}>
          <Text style={s.likes}>
            <Text style={s.heart}>♥</Text>
            {' '}
            {spot.likes.toLocaleString('fr-FR')}
          </Text>
          <Text style={[s.trend, isUp ? s.trendUp : s.trendDown]}>
            {isUp ? `↑ ${spot.trend}` : `↓ ${Math.abs(spot.trend)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  /* nav */
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
  },
  logo: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  dot: {
    color: colors.rouille,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burger: {
    fontSize: 13,
    color: colors.ink,
  },

  /* filters */
  filters: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },

  /* list */
  list: {
    flex: 1,
    paddingHorizontal: 22,
  },
  listBottom: {
    height: 24,
  },

  /* spot row */
  spot: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
  },
  spotBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 16,
    color: colors.ink,
    marginBottom: 2,
  },
  spotMeta: {
    fontSize: 11,
    color: colors.gray1,
    marginBottom: 6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  likes: {
    fontSize: 11,
    color: colors.ink,
  },
  heart: {
    color: colors.rouille,
  },
  trend: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendUp: {
    color: colors.rouille,
  },
  trendDown: {
    color: colors.gray1,
  },
});
