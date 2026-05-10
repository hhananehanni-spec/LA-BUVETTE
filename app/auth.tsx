import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/tokens';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Remplis l\'email et le mot de passe.');
      return;
    }
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Erreur', error.message);
      else router.replace('/(tabs)');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert('Erreur', error.message);
      else Alert.alert(
        'Compte créé ✓',
        'Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.',
        [{ text: 'OK', onPress: () => setMode('login') }]
      );
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Text style={s.brand}>
            La Buvette<Text style={s.dot}>.</Text>
          </Text>

          {/* Headline éditoriale */}
          <Text style={s.headline}>
            Le café mérite mieux{'\n'}
            <Text style={s.accent}>que Google Maps.</Text>
          </Text>

          <Text style={s.sub}>
            {mode === 'login'
              ? 'Connecte-toi pour voter et suivre tes spots.'
              : 'Crée ton compte, c\'est gratuit.'}
          </Text>

          {/* Séparateur */}
          <View style={s.divider} />

          {/* Formulaire */}
          <View style={s.form}>
            <TextInput
              style={s.input}
              placeholder="Email"
              placeholderTextColor={colors.gray2}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={s.input}
              placeholder="Mot de passe"
              placeholderTextColor={colors.gray2}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* CTA principal */}
          <TouchableOpacity
            style={[s.cta, loading && s.ctaDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.cream} />
              : <Text style={s.ctaText}>
                  {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
                </Text>
            }
          </TouchableOpacity>

          {/* Toggle login / signup */}
          <TouchableOpacity
            style={s.toggle}
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            <Text style={s.toggleText}>
              {mode === 'login'
                ? 'Pas encore de compte ? '
                : 'Déjà un compte ? '}
              <Text style={s.toggleLink}>
                {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
  },

  /* header */
  brand: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 16,
    color: colors.rouille,
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  dot: {
    color: colors.rouille,
  },
  headline: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1,
    color: colors.ink,
    marginBottom: 12,
  },
  accent: {
    color: colors.rouille,
  },
  sub: {
    fontSize: 13,
    color: colors.gray1,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 28,
  },

  /* form */
  form: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.cream,
  },

  /* cta */
  cta: {
    backgroundColor: colors.rouille,
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: colors.cream,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  /* toggle */
  toggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 12,
    color: colors.gray1,
  },
  toggleLink: {
    color: colors.ink,
    fontWeight: '600',
  },
});
