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
  { id: '1', name: 'Lomi',        arrondissement: 18, type: 'Roastery, filtres',   likes: 1247, trend:  14, rank: 1 },
  { id: '2', name: 'Honor',       arrondissement: 9,  type: 'Espresso, latte',     likes: 1089, trend:   6, rank: 2 },
  { id: '3', name: 'Fragments',   arrondissement: 9,  type: 'Filtres, brunch',     likes:  934, trend:  -3, rank: 3 },
  { id: '4', name: 'KB CaféShop', arrondissement: 18, type: 'Flat white, bakery',  likes:  812, trend:   9, rank: 4 },
  { id: '5', name: 'Café Lino',   arrondissement: 9,  type: 'Tiny spot, espresso', likes:  674, trend:  -1, rank: 5 },
];

export const ARR_FILTERS = ['Tous', '9e', '18e'] as const;
