<template>
  <div class="ingredient-inventory">
    <h3>Sacoche à ingrédients 🌿</h3>
    <div class="ingredients-grid">
      <div 
        v-for="i in 8" 
        :key="i"
        class="ingredient-slot"
      >
        <template v-if="store.playerInventories[playerId]?.[i-1]">
          <div 
            class="ingredient-item"
            :class="{ 'can-use': canUseForSpell(store.playerInventories[playerId][i-1].ingredient) }"
            :title="getIngredientName(store.playerInventories[playerId][i-1].ingredient.type)"
          >
            <div class="ingredient-icon">
              {{ getIngredientEmoji(store.playerInventories[playerId][i-1].ingredient.type) }}
            </div>
            <span class="ingredient-quantity">
              x{{ store.playerInventories[playerId][i-1].ingredient.quantity }}
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
import { defineProps, watch } from 'vue'
import { useIngredientsStore } from '@/store/modules/ingredients'
import { IngredientType } from '@/types/IngredientTypes'

const props = defineProps<{
  playerName: string,
  playerId: string
}>()

const store = useIngredientsStore()

const getIngredientName = (type: IngredientType): string => {
  const names: Record<IngredientType, string> = {
    CHAMPIGNONS_MAGIQUES: 'Champignons magiques',
    CRISTAUX_MANA: 'Cristaux de mana',
    HERBES_MYSTIQUES: 'Herbes mystiques',
    POUDRE_FEE: 'Poudre de fée',
    RACINES_ANCIENNES: 'Racines anciennes',
    BAIES_ENCHANTEES: 'Baies enchantées',
    PLUMES_PHENIX: 'Plumes de phénix',
    ESSENCE_ELEMENTAIRE: 'Essence élémentaire'
  }
  return names[type] || 'Ingrédient inconnu'
}

const getIngredientEmoji = (type: IngredientType): string => {
  const emojis: Record<IngredientType, string> = {
    CHAMPIGNONS_MAGIQUES: '🍄',
    CRISTAUX_MANA: '💎',
    HERBES_MYSTIQUES: '🌿',
    POUDRE_FEE: '✨',
    RACINES_ANCIENNES: '🌱',
    BAIES_ENCHANTEES: '🫐',
    PLUMES_PHENIX: '🪶',
    ESSENCE_ELEMENTAIRE: '🌀'
  }
  return emojis[type] || '❓'
}

const canUseForSpell = () => {
  return false
}

watch(() => store.playerInventories[props.playerId], (newInventory) => {
  if (newInventory?.length) {
    console.log('Inventaire complet:', JSON.stringify(newInventory[0], null, 2))
  }
}, { deep: true })
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
  position: relative;

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

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 10;
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