// components\FormationPicker\types.ts
export interface Player {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  label: string;
  x: number;
  y: number;
  player?: Player | null;
}

