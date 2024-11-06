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
  diceRollResult: number | null;
  startingPlayer: string | null;
  hasMovedThisTurn: boolean;
  activeEffects: Array<{
    id: string;
    type: string;
    duration: number;
    effect: () => void;
  }>;
} 