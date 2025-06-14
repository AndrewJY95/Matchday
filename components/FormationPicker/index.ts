// components/FormationPicker/index.ts
// Explicitly re-export the native implementation so that TypeScript
// correctly resolves both the default component and all named exports.
export { default } from './FormationPicker';
export { formationPositions } from './FormationPicker';
export type { Player, Position } from './types';
