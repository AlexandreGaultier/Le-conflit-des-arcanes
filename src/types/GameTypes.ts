export enum CellType {
  EMPTY = 'empty',
  INGREDIENT = 'ingredient',
  OBJECT = 'object',
  MONSTER = 'monster',
  SPECIAL = 'special',
  SPAWN = 'spawn',
  DENSE_WOOD = 'dense_wood'
}

export interface Cell {
  type: CellType;
  x: number;
  y: number;
  content?: {
    id: string;
    name: string;
    variant: number;
  };
}

export interface BoardConfig {
  size: 8 | 10;
  distribution: {
    [key in CellType]: number;
  };
}

export interface Position {
  x: number;
  y: number;
} 