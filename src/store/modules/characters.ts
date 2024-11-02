import { defineStore } from 'pinia'
import { Character, CharacterClass, CHARACTER_STATS } from '@/types/CharacterTypes'

interface CharactersState {
  characters: Character[];
  selectedCharacter: Character | null;
}

export const useCharactersStore = defineStore('characters', {
  state: (): CharactersState => ({
    characters: [],
    selectedCharacter: null
  }),

  actions: {
    createCharacter(characterClass: CharacterClass, name: string): Character {
      const stats = CHARACTER_STATS[characterClass]
      const character: Character = {
        id: `${characterClass}-${Date.now()}`,
        class: characterClass,
        name,
        hp: stats.baseHp,
        maxHp: stats.baseHp,
        movement: stats.movement,
        spells: stats.spells,
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
    }
  }
}) 