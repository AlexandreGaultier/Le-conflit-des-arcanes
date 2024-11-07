import { IngredientType } from "./IngredientTypes";

export enum CellType {
  EMPTY = 'empty',
  INGREDIENT = 'ingredient',
  OBSTACLE = 'obstacle',
  MONSTER = 'monster',
  SPECIAL = 'special',
  SPAWN = 'spawn',
  DENSE_WOOD = 'dense_wood'
}

export interface Cell {
  type: CellType;
  x: number;
  y: number;
  content?: Ingredient | Monster;
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

export interface Monster {
  id: string
  name: string
  variant: number
}

export enum MonsterType {
  PETIT_MONSTRE = 'petit_monstre',
  MONSTRE_MOYEN = 'monstre_moyen',
  MONSTRE_GRAND = 'monstre_grand'
}

export interface Special {
  id: string
  name: string
  variant: number
}

export interface Ingredient {
  type: IngredientType;
  quantity: number; 
}
