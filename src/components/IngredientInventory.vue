<template>
  <div class="ingredient-inventory">
    <h3>Sacoche de {{ playerName }}</h3>
    <div class="ingredients-list">
      <div 
        v-for="item in store.getPlayerInventory(playerId)" 
        :key="item.ingredient.id"
        class="ingredient-item"
        :class="{ 'can-use': canUseForSpell(item.ingredient) }"
      >
        <div class="ingredient-icon">
          {{ getIngredientEmoji(item.ingredient.type) }}
        </div>
        <div class="ingredient-info">
          <span class="ingredient-name">{{ item.ingredient.name }}</span>
          <span class="ingredient-quantity">x{{ item.quantity }}</span>
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
  max-width: 300px;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.can-use {
    box-shadow: 0 0 0 2px #42b883;
  }
}

.ingredient-icon {
  font-size: 1.5rem;
  color: #64748b;
}

.ingredient-info {
  display: flex;
  flex-direction: column;
}

.ingredient-name {
  font-size: 0.875rem;
  color: #64748b;
}

.ingredient-quantity {
  background: rgba(66, 184, 131, 0.2);
  color: #42b883;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style> 