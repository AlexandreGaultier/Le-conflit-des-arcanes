import { defineStore } from 'pinia'
import { Ingredient, InventoryItem, CellContent } from '@/types/GameTypes'

interface IngredientsState {
  inventories: Record<number, InventoryItem[]>; // playerId -> inventory
}

export const useIngredientsStore = defineStore('ingredients', {
  state: (): IngredientsState => ({
    inventories: {}
  }),

  actions: {
    initPlayerInventory(playerId: number) {
      if (!this.inventories[playerId]) {
        this.inventories[playerId] = []
      }
    },

    collectIngredient(playerId: number, cellContent: CellContent) {
      if (!this.inventories[playerId]) {
        this.initPlayerInventory(playerId)
      }

      const inventory = this.inventories[playerId]
      const existingItem = inventory.find(
        item => item.ingredient.id === cellContent.id
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        inventory.push({
          ingredient: {
            id: cellContent.id,
            type: cellContent.type,
            name: cellContent.name,
            // ... autres propriétés de l'ingrédient
          },
          quantity: 1
        })
      }
    },

    getPlayerInventory(playerId: number): InventoryItem[] {
      return this.inventories[playerId] || []
    }
  }
}) 