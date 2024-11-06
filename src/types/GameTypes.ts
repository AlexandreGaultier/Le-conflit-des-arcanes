import { Ingredient } from "./IngredientTypes";

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
  type: MonsterType;
}

export enum MonsterType {
  PETIT_MONSTRE = 'petit_monstre',
  MONSTRE_MOYEN = 'monstre_moyen',
  MONSTRE_GRAND = 'monstre_grand'
}
