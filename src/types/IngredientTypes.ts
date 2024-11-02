export enum IngredientType {
  CRYSTAL = 'crystal',
  HERB = 'herb',
  MUSHROOM = 'mushroom',
  ROOT = 'root',
  FLOWER = 'flower',
  ESSENCE = 'essence',
  POWDER = 'powder',
  GEM = 'gem'
}

export enum EffectType {
  DAMAGE = 'damage',
  HEAL = 'heal',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  UTILITY = 'utility'
}

export interface Effect {
  type: EffectType;
  value: number;
  duration?: number;
}

export interface Ingredient {
  id: string;
  type: IngredientType;
  name: string;
  description: string;
  rarity: number; // 1-5
  baseEffect: Effect;
  combinationEffects?: Effect[];
}

export interface InventoryItem {
  ingredient: Ingredient;
  quantity: number;
} 