import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { colors } from '../../theme/tokens';

// ─── Types ───────────────────────────────────────────────
interface SpotDetail {
  id: string;
  name: string;
  arrondissement: number;
  type: string;
  rank: number;
}

interface VoteStats {
  likes: number;
  dislikes: number;
  total: number;
  pct: number; // % de likes
}

type MyVote = 'like' | 'dislike' | null;

// ─── Écran ───────────────────────────────────────────────
export default function SpotDetailScreen() {
  const { id, rank } = useLocalSearchParams<{ id: string; rank: string }>();
  const { session } = useAuth();

  const [spot, setSpot] = useState<SpotDetail | null>(null);
  const [stats, setStats] = useState<VoteStats>({ likes: 0, dislikes: 0, total: 0, pct: 0 });
  const [myVote, setMyVote] = useState<MyVote>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);

    // 1. Infos du spot
    const { data: spotData } = await supabase
      .from('spots')
      .select('id, name, arrondissement, type')
      .eq('id', id)
      .single();

    // 2. Stats des votes
    const { data: votesData } = await supabase
      .from('votes')
      .select('type')
      .eq('spot_id', id);

    // 3. Mon vote perso
    const { data: myVoteData } = await supabase
      .from('votes')
      .select('type')
      .eq('spot_id', id)
      .eq('user_id', session?.user.id ?? '')
      .maybeSingle();

    if (spotData) {
      setSpot({ ...spotData, rank: parseInt(rank ?? '0', 10) });
    }

    if (votesData) {
      const likes = votesData.filter((v) => v.type === 'like').length;
      const dislikes = votesData.filter((v) => v.type === 'dislike').length;
      const total = likes + dislikes;
      setStats({ likes, dislikes, total, pct: total > 0 ? Math.round((likes / total) * 100) : 0 });
    }

    setMyVote((myVoteData?.type as MyVote) ?? null);
    setLoading(false);
  }

  async function handleVote(type: 'like' | 'dislike') {
    if (!session) return;
    setVoting(true);

    try {
      if (myVote === type) {
        // Même vote → on annule (toggle off)
        await supabase.from('votes')
          .delete()
          .eq('spot_id', id)
          .eq('user_id', session.user.id);
        setMyVote(null);
        setStats((s) => {
          const likes = type === 'like' ? s.likes - 1 : s.likes;
          const dislikes = type === 'dislike' ? s.dislikes - 1 : s.dislikes;
          const total = likes + dislikes;
          return { likes, dislikes, total, pct: total > 0 ? Math.round((likes / total) * 100) : 0 };
        });
      } else if (myVote) {
        // Vote différent → on change
        await supabase.from('votes')
          .update({ type })
          .eq('spot_id', id)
          .eq('user_id', session.user.id);
        setMyVote(type);
        setStats((s) => {
          const likes = type === 'like' ? s.likes + 1 : s.likes - 1;
          const dislikes = type === 'dislike' ? s.dislikes + 1 : s.dislikes - 1;
          const total = likes + dislikes;
          return { likes, dislikes, total, pct: total > 0 ? Math.round((likes / total) * 100) : 0 };
        });
      } else {
        // Nouveau vote
        await supabase.from('votes')
          .insert({ spot_id: id, user_id: session.user.id, type });
        setMyVote(type);
        setStats((s) => {
          const likes = type === 'like' ? s.likes + 1 : s.likes;
          const dislikes = type === 'dislike' ? s.dislikes + 1 : s.dislikes;
          const total = likes + dislikes;
          return { likes, dislikes, total, pct: total > 0 ? Math.round((likes / total) * 100) : 0 };
        });
      }
    } catch {
      Alert.alert('Erreur', 'Impossible d\'enregistrer ton vote.');
    }

    setVoting(false);
  }

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={colors.rouille} />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={s.errorText}>Spot introuvable.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['bottom']}>
      {/* ── Hero ── */}
      <View style={s.hero}>
        <LinearGradient
          colors={['#3a2e26', '#5a4838']}
          start={{ x: 0.3, y: 0.4 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Overlay rouille subtil */}
        <View style={s.heroOverlay} />

        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* ── Corps ── */}
      <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
        {/* Kicker rang */}
        <Text style={s.kicker}>#{String(spot.rank).padStart(2, '0')} — cette semaine</Text>

        {/* Nom */}
        <Text style={s.name}>{spot.name}</Text>
        <Text style={s.arr}>{spot.arrondissement}e arrondissement · Paris</Text>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statNum}>{stats.pct}%</Text>
            <Text style={s.statLabel}>Likes</Text>
          </View>
          <View style={[s.stat, s.statBorder]}>
            <Text style={s.statNum}>{stats.total}</Text>
            <Text style={s.statLabel}>Votes</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statNum}>#{spot.rank}</Text>
            <Text style={s.statLabel}>{spot.arrondissement}e arr.</Text>
          </View>
        </View>

        {/* Type */}
        <Text style={s.type}>{spot.type}</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Boutons vote (sticky) ── */}
      <View style={s.voteBar}>
        <TouchableOpacity
          style={[s.voteBtn, s.voteBtnOutline, myVote === 'dislike' && s.voteBtnActive]}
          onPress={() => handleVote('dislike')}
          disabled={voting}
          activeOpacity={0.75}
        >
          <Text style={[s.voteBtnText, myVote === 'dislike' && s.voteBtnTextActive]}>
            ✕  Pas pour moi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.voteBtn, s.voteBtnFill, myVote === 'like' && s.voteBtnLiked]}
          onPress={() => handleVote('like')}
          disabled={voting}
          activeOpacity={0.75}
        >
          <Text style={s.voteBtnTextFill}>
            {myVote === 'like' ? '♥  J\'adore ✓' : '♥  J\'adore'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 13, color: colors.gray1 },

  /* hero */
  hero: { height: 230, position: 'relative' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(196,69,54,0.12)',
  },
  backBtn: {
    position: 'absolute', top: 52, left: 18,
    width: 34, height: 34,
    backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.ink,
    borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 16, color: colors.ink },

  /* corps */
  body: { flex: 1, paddingHorizontal: 22, paddingTop: 22 },
  kicker: {
    fontSize: 11, color: colors.rouille,
    letterSpacing: 0.5, marginBottom: 8,
  },
  name: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 30, lineHeight: 32,
    color: colors.ink, marginBottom: 4,
  },
  arr: { fontSize: 11, color: colors.gray1, letterSpacing: 0.5, marginBottom: 18 },

  /* stats */
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14, marginBottom: 18,
  },
  stat: { flex: 1, alignItems: 'center' },
  statBorder: {
    borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: colors.line,
  },
  statNum: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 22, color: colors.rouille,
  },
  statLabel: {
    fontSize: 9, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.gray1, marginTop: 2,
  },

  /* type */
  type: { fontSize: 12, color: colors.gray1, lineHeight: 20 },

  /* vote bar */
  voteBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 18,
    paddingBottom: 28,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  voteBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 100, alignItems: 'center',
  },
  voteBtnOutline: {
    borderWidth: 1, borderColor: colors.ink,
    backgroundColor: colors.cream,
  },
  voteBtnActive: {
    backgroundColor: colors.ink,
  },
  voteBtnFill: {
    backgroundColor: colors.rouille,
  },
  voteBtnLiked: {
    backgroundColor: '#9c3328', // rouille foncé = déjà voté
  },
  voteBtnText: {
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase',
    color: colors.ink,
  },
  voteBtnTextActive: { color: colors.cream },
  voteBtnTextFill: {
    fontSize: 12, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase',
    color: colors.cream,
  },
});
