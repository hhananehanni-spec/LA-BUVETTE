export interface Spot {
  id: string;
  name: string;
  arrondissement: number;
  type: string;
  likes: number;
  trend: number; // positive = ↑, negative = ↓
  rank: number;
}

export const MOCK_SPOTS: Spot[] = [
  { id: '1', name: 'Substance',     arrondissement: 3,  type: 'Filtres, espresso', likes: 1247, trend:  12, rank: 1 },
  { id: '2', name: 'Mokonuts',      arrondissement: 11, type: 'Bakery & café',      likes: 1089, trend:   5, rank: 2 },
  { id: '3', name: 'Café Kitsuné',  arrondissement: 2,  type: 'Brunch, latte',      likes:  942, trend:  -2, rank: 3 },
  { id: '4', name: 'Ten Belles',    arrondissement: 10, type: 'Roastery',            likes:  880, trend:   8, rank: 4 },
  { id: '5', name: 'Boot Café',     arrondissement: 3,  type: 'Tiny spot',           likes:  731, trend:  -1, rank: 5 },
];

export const ARR_FILTERS = ['Tous', '3e', '11e', '10e', '18e'] as const;
