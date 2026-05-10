import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * EXPO_PUBLIC_ prefix = variable accessible côté client (dans l'app).
 * Sans ce prefix, la variable reste côté serveur uniquement.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client Supabase unique — à importer partout dans l'app.
 * Ne jamais en créer un deuxième (ça duplique les connexions).
 *
 * auth.storage → AsyncStorage garde la session sur le téléphone
 * auth.persistSession → reste connecté après fermeture de l'app
 * auth.detectSessionInUrl → false car on n'est pas dans un navigateur web
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
