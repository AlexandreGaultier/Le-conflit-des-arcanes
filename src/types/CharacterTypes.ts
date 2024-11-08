import type { Position } from './GameTypes'
import type { InventoryItem } from './IngredientTypes'

export enum CharacterClass {
  ELEMENTALIST = 'elementalist',
  NECROMANCER = 'necromancer',
  ENCHANTER = 'enchanter',
  ALCHEMIST = 'alchemist'
}

export enum SpellType {
  DAMAGE = 'damage',
  CONTROL = 'control',
  UTILITY = 'utility',
  HEAL = 'heal',
  SUMMON = 'summon',
  BUFF = 'buff',
  DEBUFF = 'debuff'
}

export enum AreaOfEffectType {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  LINE = 'LINE'
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  type: SpellType;
  damage?: number;
  range?: number;
  cost: number;
  areaOfEffect: {
    type: AreaOfEffectType;
    size: number;
  };
  duration?: number;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  position: Position | null;
  movement: number;
  maxHealth: number;
  currentHealth: number;
  inventory: InventoryItem[];
  spells: Spell[];
}

export const CHARACTER_STATS = {
  [CharacterClass.ELEMENTALIST]: {
    baseHp: 8,
    movement: 3,
    spells: [
      {
        id: 'fireball',
        name: 'Boule de feu',
        description: 'Lance une boule de feu infligeant 2 dégâts',
        type: SpellType.DAMAGE,
        damage: 2,
        range: 3,
        cost: 1,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'ice-wall',
        name: 'Mur de glace',
        description: 'Crée un mur de glace bloquant une case pendant 2 tours',
        type: SpellType.CONTROL,
        duration: 2,
        range: 2,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'storm',
        name: 'Tempête',
        description: 'Déchaîne une tempête infligeant 1 dégât dans une zone',
        type: SpellType.DAMAGE,
        damage: 1,
        range: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 3 }
      }
    ]
  },
  [CharacterClass.NECROMANCER]: {
    baseHp: 6,
    movement: 2,
    spells: [
      {
        id: 'life-drain',
        name: 'Drain de vie',
        description: 'Inflige 1 dégât et soigne de 1 PV',
        type: SpellType.DAMAGE,
        damage: 1,
        range: 2,
        cost: 1,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'summon-skeleton',
        name: 'Invocation de squelette',
        description: 'Invoque un squelette temporaire',
        type: SpellType.SUMMON,
        duration: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'curse',
        name: 'Malédiction',
        description: 'Réduit les dégâts ennemis',
        type: SpellType.DEBUFF,
        duration: 2,
        range: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      }
    ]
  },
  [CharacterClass.ENCHANTER]: {
    baseHp: 7,
    movement: 3,
    spells: [
      {
        id: 'charm',
        name: 'Charme',
        description: 'Prend le contrôle d\'un monstre',
        type: SpellType.CONTROL,
        duration: 2,
        range: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'teleport',
        name: 'Téléportation',
        description: 'Se téléporte jusqu\'à 4 cases',
        type: SpellType.UTILITY,
        range: 4,
        cost: 1,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'magic-shield',
        name: 'Bouclier magique',
        description: 'Absorbe 2 dégâts',
        type: SpellType.BUFF,
        duration: 2,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      }
    ]
  },
  [CharacterClass.ALCHEMIST]: {
    baseHp: 7,
    movement: 4,
    spells: [
      {
        id: 'explosive-potion',
        name: 'Potion explosive',
        description: 'Inflige 2 dégâts en croix',
        type: SpellType.DAMAGE,
        damage: 2,
        range: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'transmutation',
        name: 'Transmutation',
        description: 'Change un ingrédient en un autre',
        type: SpellType.UTILITY,
        range: 2,
        cost: 1,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 1 }
      },
      {
        id: 'toxic-cloud',
        name: 'Nuage toxique',
        description: 'Crée une zone de dégâts sur 2 tours',
        type: SpellType.DAMAGE,
        damage: 1,
        duration: 2,
        range: 3,
        cost: 2,
        areaOfEffect: { type: AreaOfEffectType.SQUARE, size: 2 }
      }
    ]
  }
} 