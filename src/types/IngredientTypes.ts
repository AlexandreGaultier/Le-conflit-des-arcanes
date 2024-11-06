export enum IngredientType {
  CHAMPIGNONS_MAGIQUES = 'CHAMPIGNONS_MAGIQUES',
  CRISTAUX_MANA = 'CRISTAUX_MANA',
  HERBES_MYSTIQUES = 'HERBES_MYSTIQUES',
  POUDRE_FEE = 'POUDRE_FEE',
  RACINES_ANCIENNES = 'RACINES_ANCIENNES',
  BAIES_ENCHANTEES = 'BAIES_ENCHANTEES',
  PLUMES_PHENIX = 'PLUMES_PHENIX',
  ESSENCE_ELEMENTAIRE = 'ESSENCE_ELEMENTAIRE'
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
  emoji?: string;
}

export interface InventoryItem {
  ingredient: Ingredient;
  quantity: number;
} 