import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/tokens';

interface Spot {
  id: string;
  name: string;
  arrondissement: number;
  type: string;
  lat: number;
  lng: number;
  like_count: number;
  rank: number;
}

// Centre Paris
const PARIS: Region = {
  latitude: 48.877,
  longitude: 2.344,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

export default function CarteScreen() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selected, setSelected] = useState<Spot | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  async function fetchSpots() {
    const { data } = await supabase
      .from('spots')
      .select('id, name, arrondissement, type, lat, lng, votes(count)')
      .not('lat', 'is', null);

    if (!data) return;

    const formatted: Spot[] = data
      .map((row, i) => ({
        id: row.id,
        name: row.name,
        arrondissement: row.arrondissement,
        type: row.type ?? '',
        lat: row.lat,
        lng: row.lng,
        like_count: (row.votes as any)?.[0]?.count ?? 0,
        rank: i + 1,
      }))
      .sort((a, b) => b.like_count - a.like_count)
      .map((s, i) => ({ ...s, rank: i + 1 }));

    setSpots(formatted);
  }

  function onPinPress(spot: Spot) {
    setSelected(spot);
    mapRef.current?.animateToRegion(
      { latitude: spot.lat - 0.008, longitude: spot.lng, latitudeDelta: 0.03, longitudeDelta: 0.03 },
      400
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* ── Carte ── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={PARIS}
        showsUserLocation
        showsCompass={false}
        showsScale={false}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.lat, longitude: spot.lng }}
            onPress={() => onPinPress(spot)}
          >
            <View style={[s.pin, spot.rank === 1 && s.pinFeatured]}>
              <Text style={[s.pinText, spot.rank === 1 && s.pinTextFeatured]}>
                {spot.rank === 1 ? '★' : String(spot.rank).padStart(2, '0')}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* ── Search bar décorative ── */}
      <View style={s.searchBar}>
        <Text style={s.searchIcon}>⌕</Text>
        <Text style={s.searchText}>Chercher un spot…</Text>
      </View>

      {/* ── Card spot sélectionné ── */}
      {selected && (
        <TouchableOpacity
          style={s.card}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/spot/[id]', params: { id: selected.id, rank: selected.rank } })}
        >
          <Text style={s.cardKicker}>
            {selected.rank === 1 ? '★ Trending cette semaine' : `#${String(selected.rank).padStart(2, '0')} cette semaine`}
          </Text>
          <Text style={s.cardName}>{selected.name}</Text>
          <Text style={s.cardMeta}>{selected.arrondissement}e arr.</Text>
          <View style={s.cardStats}>
            <Text style={s.cardLikes}><Text style={s.heart}>♥</Text> {selected.like_count}</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={s.cardClose}>✕</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  /* search */
  searchBar: {
    position: 'absolute',
    top: 60, left: 14, right: 14,
    backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.ink,
    borderRadius: 100,
    paddingHorizontal: 18, paddingVertical: 11,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  searchIcon: { fontSize: 16, color: colors.gray1 },
  searchText: { fontSize: 12, color: colors.gray1 },

  /* pins */
  pin: {
    width: 32, height: 32,
    backgroundColor: colors.ink,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  pinFeatured: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: colors.rouille,
    shadowOpacity: 0.35,
  },
  pinText: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 11, color: colors.cream,
  },
  pinTextFeatured: { fontSize: 16 },

  /* card */
  card: {
    position: 'absolute',
    bottom: 14, left: 14, right: 14,
    backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.ink,
    borderRadius: 18,
    padding: 16,
  },
  cardKicker: {
    fontSize: 10, color: colors.rouille,
    letterSpacing: 0.5, marginBottom: 4,
  },
  cardName: {
    fontFamily: 'Georgia', fontWeight: '700',
    fontSize: 18, color: colors.ink, marginBottom: 2,
  },
  cardMeta: { fontSize: 11, color: colors.gray1, marginBottom: 10 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLikes: { fontSize: 12, color: colors.ink },
  heart: { color: colors.rouille },
  cardClose: { fontSize: 16, color: colors.gray2, padding: 4 },
});
