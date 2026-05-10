import '../global.css';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

/**
 * RootLayout — deux niveaux :
 * 1. FontLoader  : charge les fonts, cache le splash screen
 * 2. AuthProvider : enveloppe tout avec le contexte de session
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

/**
 * RootNavigator — lit la session et redirige en conséquence.
 * Séparé de RootLayout pour pouvoir utiliser useAuth()
 * (qui nécessite d'être à l'intérieur de AuthProvider).
 */
function RootNavigator() {
  const { session, loading } = useAuth();

  // Pendant le chargement de la session, on ne rend rien
  // (le splash screen est encore visible)
  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      {/* Redirige selon l'état de connexion */}
      {!session && <Redirect href="/auth" />}
    </Stack>
  );
}
