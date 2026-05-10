import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Kicker } from '../../components/ui/Kicker';
import { Pill } from '../../components/ui/Pill';
import { RankNum } from '../../components/ui/RankNum';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/tokens';

// Filtres affichés dans la barre de pills
const FILTERS = ['Tous', '9e', '18e'] as const;
type Filter = typeof FILTERS[number];

// Type qui correspond à une ligne de la table "spots" dans Supabase
interface Spot {
  id: string;
  name: string;
  arrondissement: number;
  type: string;
  like_count: number;  // calculé par la requête
  trend: number;       // placeholder jusqu'au calcul réel
  rank: number;        // position dans le classement
}

export default function TrendingScreen() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>('Tous');

  useEffect(() => {
    fetchSpots();
  }, []);

  async function fetchSpots() {
    setLoading(true);
    setError(null);

    /**
     * On joint la table spots avec les votes pour compter les likes.
     * select('*, votes(count)') demande à Supabase de compter les votes
     * associés à chaque spot en une seule requête.
     */
    const { data, error } = await supabase
      .from('spots')
      .select(`
        id,
        name,
        arrondissement,
        type,
        votes(count)
      `)
      .order('name');

    if (error) {
      setError('Impossible de charger les spots.');
      setLoading(false);
      return;
    }

    // On transforme les données Supabase dans le format attendu par l'UI
    const formatted: Spot[] = (data ?? []).map((row, i) => ({
      id: row.id,
      name: row.name,
      arrondissement: row.arrondissement,
      type: row.type ?? '',
      like_count: (row.votes as any)?.[0]?.count ?? 0,
      trend: 0,  // sera calculé côté Supabase dans un sprint futur
      rank: i + 1,
    }));

    // Trie par nombre de likes décroissant et assigne les rangs
    formatted.sort((a, b) => b.like_count - a.like_count);
    const total = formatted.length;
    formatted.forEach((s, i) => {
      s.rank = i + 1;
      // ↑ pour les 2 premiers (chauds), ↓ pour les 2 derniers, 0 sinon
      s.trend = s.rank <= 2 ? 1 : s.rank >= total - 1 ? -1 : 0;
    });

    setSpots(formatted);
    setLoading(false);
  }

  const filtered =
    activeFilter === 'Tous'
      ? spots
      : spots.filter((s) => s.arrondissement === parseInt(activeFilter, 10));

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

      {/* ── Filtres arrondissement ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filters}
      >
        {FILTERS.map((f) => (
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

      {/* ── Contenu ── */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={colors.rouille} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchSpots} style={s.retry}>
            <Text style={s.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
          {filtered.map((spot, i) => (
            <SpotRow key={spot.id} spot={spot} last={i === filtered.length - 1} />
          ))}
          <View style={s.listBottom} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SpotRow({ spot, last }: { spot: Spot; last: boolean }) {
  const isTop = spot.rank === 1;

  return (
    <TouchableOpacity
      style={[s.spot, !last && s.spotBorder]}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/spot/[id]', params: { id: spot.id, rank: spot.rank } })}
    >
      <RankNum rank={spot.rank} featured={isTop} />
      <View style={s.spotInfo}>
        <Text style={s.spotName}>{spot.name}</Text>
        <Text style={s.spotMeta}>
          {spot.arrondissement}e arr. · {spot.type}
        </Text>
        <View style={s.stats}>
          <Text style={s.likes}>
            <Text style={s.heart}>♥</Text>{' '}
            {spot.like_count.toLocaleString('fr-FR')}
          </Text>
          {spot.trend !== 0 && (
            <Text style={[s.trendArrow, spot.trend > 0 ? s.trendUp : s.trendDown]}>
              {spot.trend > 0 ? '↑' : '↓'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 10,
  },
  logo: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  dot: { color: colors.rouille },
  iconBtn: {
    width: 30, height: 30,
    borderWidth: 1, borderColor: colors.ink,
    borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  burger: { fontSize: 13, color: colors.ink },

  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingBottom: 8,
  },

  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  errorText: { fontSize: 13, color: colors.gray1, textAlign: 'center' },
  retry: {
    borderWidth: 1, borderColor: colors.ink,
    borderRadius: 100, paddingHorizontal: 20, paddingVertical: 8,
  },
  retryText: { fontSize: 12, color: colors.ink },

  list: { flex: 1, paddingHorizontal: 22 },
  listBottom: { height: 24 },

  spot: { flexDirection: 'row', gap: 14, paddingVertical: 14 },
  spotBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  spotInfo: { flex: 1 },
  spotName: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 16, color: colors.ink, marginBottom: 2,
  },
  spotMeta: { fontSize: 11, color: colors.gray1, marginBottom: 6 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  likes: { fontSize: 11, color: colors.ink },
  heart: { color: colors.rouille },
  trendArrow: { fontSize: 12, fontWeight: '700' },
  trendUp: { color: colors.rouille },
  trendDown: { color: colors.gray2 },
});
