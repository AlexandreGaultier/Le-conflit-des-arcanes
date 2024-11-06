import { defineStore } from 'pinia'
import { Character, CharacterClass, CHARACTER_STATS } from '@/types/CharacterTypes'
import { InventoryItem } from '../../types/IngredientTypes';

interface CharactersState {
  characters: Character[];
  selectedCharacterId: string | null;
}

const DEFAULT_NAMES = {
  [CharacterClass.ELEMENTALIST]: 'Ignis',
  [CharacterClass.NECROMANCER]: 'Mortis',
  [CharacterClass.ENCHANTER]: 'Lumina',
  [CharacterClass.ALCHEMIST]: 'Sage'
}

export const useCharactersStore = defineStore('characters', {
  state: (): CharactersState => ({
    characters: [] as Character[],
    selectedCharacterId: null
  }),

  getters: {
    selectedCharacter: (state) => {
      return state.characters.find(c => c.id === state.selectedCharacterId)
    }
  },

  actions: {
    createCharacter(characterClass: CharacterClass, name?: string) {
      const defaultName = DEFAULT_NAMES[characterClass]
      const character: Character = {
        id: crypto.randomUUID(),
        class: characterClass,
        name: name || defaultName,
        currentHealth: CHARACTER_STATS[characterClass].baseHp,
        maxHealth: CHARACTER_STATS[characterClass].baseHp,
        movement: CHARACTER_STATS[characterClass].movement,
        spells: CHARACTER_STATS[characterClass].spells,
        inventory: [],
        position: null
      }
      
      this.characters.push(character)
      return character
    },

    selectCharacter(characterId: string) {
      this.selectedCharacterId = characterId
    },

    updatePosition(characterId: string, x: number, y: number) {
      const character = this.characters.find(c => c.id === characterId)
      if (character) {
        character.position = { x, y }
      }
    },

    initializePositions() {
      if (this.characters.length >= 2) {
        // Premier joueur en haut à gauche
        this.characters[0].position = { x: 0, y: 0 }
        // Deuxième joueur en bas à droite
        this.characters[1].position = { x: 7, y: 7 }
      }
    },

    moveCharacter(characterId: string, newPosition: { x: number, y: number }) {
      const character = this.characters.find(c => c.id === characterId)
      if (character) {
        character.position = newPosition
      }
    },

    addToInventory(characterId: string, item: InventoryItem) {
      const character = this.characters.find(c => c.id === characterId)
      if (!character) return

      // Vérifier si la sacoche n'est pas pleine (max 8 emplacements)
      if (!character.inventory) {
        character.inventory = []
      }

      if (character.inventory.length < 8) {
        character.inventory.push(item)
        console.log(`${item.ingredient.name} ajouté à l'inventaire de ${character.name}`)
      } else {
        console.log('Inventaire plein !')
      }
    }
  }
}) 