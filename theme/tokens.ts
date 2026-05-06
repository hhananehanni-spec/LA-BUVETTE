export const colors = {
  cream: '#F8F1E7',
  cream2: '#E8D9C5',
  ink: '#2D2926',
  rouille: '#C44536',
  gray1: '#7A7571',
  gray2: '#B5AFA9',
  line: '#E0D6C8',
  dark: '#1F1B18',
} as const;

export type ColorKey = keyof typeof colors;
