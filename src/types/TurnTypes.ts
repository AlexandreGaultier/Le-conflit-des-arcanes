export enum TurnPhase {
  START = 'start',
  ACTION = 'action',
  END = 'end'
}

export interface TurnState {
  currentPlayerId: string | null;
  phase: TurnPhase;
  actionsLeft: number;
  turnNumber: number;
  activeEffects: {
    id: string;
    type: string;
    duration: number;
    effect: () => void;
  }[];
} 