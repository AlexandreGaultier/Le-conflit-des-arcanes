import { defineStore } from 'pinia'
import { IngredientType } from '@/types/IngredientTypes'

interface InventoryItem {
  ingredient: {
    type: IngredientType
    quantity: number
  }
}

interface IngredientsState {
  playerInventories: Record<string, InventoryItem[]>
}

export const useIngredientsStore = defineStore('ingredients', {
  state: (): IngredientsState => ({
    playerInventories: {}
  }),

  actions: {
    addIngredient(playerId: string, ingredient: { type: IngredientType, quantity: number }) {
      console.log('Ajout ingrédient:', {
        playerId,
        ingredient
      })

      if (!this.playerInventories[playerId]) {
        this.playerInventories[playerId] = []
      }

      const existingItem = this.playerInventories[playerId].find(
        item => item.ingredient.type === ingredient.type
      )

      if (existingItem) {
        existingItem.ingredient.quantity += ingredient.quantity
      } else {
        this.playerInventories[playerId].push({ 
          ingredient: {
            type: ingredient.type,
            quantity: ingredient.quantity
          }
        })
      }
    }
  }
}) 