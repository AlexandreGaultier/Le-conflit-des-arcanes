<template>
  <div class="ingredient-inventory">
    <h3>Sacoche à ingrédients 🌿</h3>
    <div class="ingredients-grid">
      <div 
        v-for="i in 8" 
        :key="i"
        class="ingredient-slot"
      >
        <template v-if="store.getPlayerInventory(playerId)[i-1]">
          <div 
            class="ingredient-item"
            :class="{ 'can-use': canUseForSpell(store.getPlayerInventory(playerId)[i-1].ingredient) }"
          >
            <div class="ingredient-icon">
              {{ getIngredientEmoji(store.getPlayerInventory(playerId)[i-1].ingredient.type) }}
            </div>
            <span class="ingredient-quantity">
              x{{ store.getPlayerInventory(playerId)[i-1].quantity }}
            </span>
          </div>
        </template>
        <div v-else class="empty-slot">
          <span class="empty-slot-icon">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useIngredientsStore } from '@/store/modules/ingredients'
import { IngredientType } from '@/types/IngredientTypes'

const props = defineProps<{
  playerName: string,
  playerId: number
}>()

const store = useIngredientsStore()

const canUseForSpell = (ingredient: IngredientType): boolean => {
  // Implement your logic here to determine if the ingredient can be used for a spell
  return true
}

const getIngredientEmoji = (type: IngredientType): string => {
  // Implement your logic here to get the emoji for the ingredient type
  return '🌿'
}
</script>

<style scoped lang="scss">
.ingredient-inventory {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.ingredient-slot {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  overflow: hidden;
}

.ingredient-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.can-use {
    box-shadow: inset 0 0 0 2px #42b883;
  }

  .ingredient-icon {
    font-size: 1.5rem;
  }

  .ingredient-quantity {
    font-size: 0.75rem;
    background: rgba(66, 184, 131, 0.2);
    color: #42b883;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }
}

.empty-slot {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.5rem;
  opacity: 0.5;
}

.empty-slot-icon {
  transform: rotate(45deg);
}
</style> 