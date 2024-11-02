import { defineStore } from 'pinia'
import { Character, CharacterClass, CHARACTER_STATS } from '@/types/CharacterTypes'

interface CharactersState {
  characters: Character[];
  selectedCharacter: Character | null;
}

interface InitialPosition {
  player1: { x: number; y: number };
  player2: { x: number; y: number };
}

const INITIAL_POSITIONS: InitialPosition = {
  player1: { x: 0, y: 0 }, // Côté gauche du plateau
  player2: { x: 7, y: 7 }  // Côté droit du plateau
}

const DEFAULT_NAMES = {
  [CharacterClass.ELEMENTALIST]: 'Ignis',
  [CharacterClass.NECROMANCER]: 'Mortis',
  [CharacterClass.ENCHANTER]: 'Lumina',
  [CharacterClass.ALCHEMIST]: 'Sage'
}

export const useCharactersStore = defineStore('characters', {
  state: (): CharactersState => ({
    characters: [],
    selectedCharacter: null
  }),

  actions: {
    createCharacter(characterClass: CharacterClass, name?: string) {
      const defaultName = DEFAULT_NAMES[characterClass]
      const character: Character = {
        id: crypto.randomUUID(),
        class: characterClass,
        name: name || defaultName,
        hp: CHARACTER_STATS[characterClass].baseHp,
        maxHp: CHARACTER_STATS[characterClass].baseHp,
        movement: CHARACTER_STATS[characterClass].movement,
        spells: CHARACTER_STATS[characterClass].spells,
        level: 1,
        experience: 0
      }
      
      this.characters.push(character)
      return character
    },

    selectCharacter(characterId: string) {
      this.selectedCharacter = this.characters.find(c => c.id === characterId) || null
    },

    updatePosition(characterId: string, x: number, y: number) {
      const character = this.characters.find(c => c.id === characterId)
      if (character) {
        character.position = { x, y }
      }
    },

    gainExperience(characterId: string, amount: number) {
      const character = this.characters.find(c => c.id === characterId)
      if (character) {
        character.experience += amount
        // Système de niveau simple : chaque niveau nécessite 100 XP
        const newLevel = Math.floor(character.experience / 100) + 1
        if (newLevel > character.level) {
          character.level = newLevel
          character.maxHp += 1
          character.hp = character.maxHp
        }
      }
    },

    initializePositions() {
      // Positionne les personnages à leurs positions de départ
      this.characters[0].position = INITIAL_POSITIONS.player1
      this.characters[1].position = INITIAL_POSITIONS.player2
    }
  }
}) 