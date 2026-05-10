import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { colors } from '../../theme/tokens';

export default function ProfilScreen() {
  const { session } = useAuth();
  const [voteCount, setVoteCount] = useState(0);

  const email = session?.user.email ?? '';
  // Initiales depuis l'email (ex: "hanane@gmail.com" → "H")
  const initiale = email.charAt(0).toUpperCase();
  // Prénom estimé depuis l'email (avant le @)
  const prenom = email.split('@')[0];
  const handle = `@${prenom}`;
  const annee = session?.user.created_at
    ? new Date(session.user.created_at).getFullYear()
    : 2026;

  useEffect(() => {
    if (session) fetchStats();
  }, [session]);

  async function fetchStats() {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session!.user.id);
    setVoteCount(count ?? 0);
  }

  async function handleLogout() {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── En-tête profil ── */}
        <View style={s.head}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initiale}</Text>
          </View>
          <Text style={s.kicker}>Membre depuis {annee}</Text>
          <Text style={s.name}>{prenom}</Text>
          <Text style={s.handle}>{handle} · Paris</Text>
        </View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statNum}>{voteCount}</Text>
            <Text style={s.statLabel}>Votes</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statNum}>0</Text>
            <Text style={s.statLabel}>Listes</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statNum}>0</Text>
            <Text style={s.statLabel}>Amis</Text>
          </View>
        </View>

        {/* ── Tabs (placeholder) ── */}
        <View style={s.tabs}>
          <View style={[s.tab, s.tabActive]}>
            <Text style={[s.tabText, s.tabTextActive]}>Mes listes</Text>
          </View>
          <View style={s.tab}>
            <Text style={s.tabText}>Activité</Text>
          </View>
          <View style={s.tab}>
            <Text style={s.tabText}>Badges</Text>
          </View>
        </View>

        {/* ── Liste placeholder ── */}
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>Aucune liste pour l'instant</Text>
          <Text style={s.emptySub}>Vote sur des spots pour commencer à construire tes listes.</Text>
        </View>

        {/* ── Déconnexion ── */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={s.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.dark },

  /* head */
  head: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248,241,231,0.12)',
  },
  avatar: {
    width: 76, height: 76,
    borderRadius: 38,
    backgroundColor: colors.cream2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 28, color: colors.ink,
  },
  kicker: { fontSize: 11, color: colors.cream2, marginBottom: 6 },
  name: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 24, color: colors.cream,
  },
  handle: { fontSize: 11, color: colors.cream2, marginTop: 2 },

  /* stats */
  statsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248,241,231,0.12)',
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 22, color: colors.rouille,
  },
  statLabel: {
    fontSize: 9, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.cream2, marginTop: 2,
  },

  /* tabs */
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(248,241,231,0.12)',
  },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.rouille },
  tabText: {
    fontSize: 10, letterSpacing: 1.5,
    textTransform: 'uppercase', color: colors.cream2,
  },
  tabTextActive: { color: colors.cream },

  /* empty */
  emptyState: {
    paddingHorizontal: 22, paddingVertical: 40,
    alignItems: 'center', gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 16, color: colors.cream,
  },
  emptySub: {
    fontSize: 12, color: colors.cream2,
    textAlign: 'center', lineHeight: 18,
  },

  /* logout */
  logoutBtn: {
    marginHorizontal: 22, marginBottom: 32,
    borderWidth: 1, borderColor: 'rgba(248,241,231,0.2)',
    borderRadius: 100, paddingVertical: 13,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 12, color: colors.cream2,
    letterSpacing: 1, textTransform: 'uppercase',
  },
});
