<template>
  <div class="game-board" :style="boardStyle">
    <div v-for="row in board" :key="row[0].y" class="board-row">
      <div 
        v-for="cell in row" 
        :key="`${cell.x}-${cell.y}`"
        class="board-cell"
        :class="[cell.type, { 'has-content': cell.content }]"
        @click="(event) => handleCellClick(cell, event)"
      >
        <div class="cell-coordinates">{{ cell.x }},{{ cell.y }}</div>
        <div v-if="cell.content" class="cell-content">
          {{ cell.content.name }}
        </div>
      </div>
    </div>
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="collect-particle"
      :style="particle.style"
    >
      {{ particle.emoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BoardGenerator } from '@/services/BoardGenerator'
import type { Cell } from '@/types/GameTypes'
import { useIngredientsStore } from '@/store/modules/ingredients'
import { IngredientType } from '@/types/IngredientTypes'
import { CellType } from '@/types/GameTypes'

const props = defineProps<{
  size: 8 | 10
}>()

const board = ref<Cell[][]>([])
const generator = new BoardGenerator()
const ingredientsStore = useIngredientsStore()
const particles = ref<Array<{id: number, type: IngredientType, style: any}>>([])
let particleId = 0

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.size}, 1fr)`
}))

const regenerateBoard = () => {
  board.value = generator.generateBoard(props.size)
}

const getIngredientEmoji = (type: IngredientType): string => {
  const emojis = {
    [IngredientType.CRYSTAL]: '💎',
    [IngredientType.HERB]: '🌿',
    [IngredientType.MUSHROOM]: '🍄',
    [IngredientType.ROOT]: '🌱',
    [IngredientType.FLOWER]: '🌸',
    [IngredientType.ESSENCE]: '✨',
    [IngredientType.POWDER]: '⚗️',
    [IngredientType.GEM]: '💠'
  }
  return emojis[type] || '✨'
}

const createCollectEffect = (cell: Cell, event: MouseEvent) => {
  // Position de départ (position du clic)
  const startX = event.clientX
  const startY = event.clientY
  
  // Position finale (position de la sacoche - à ajuster selon votre layout)
  const inventoryEl = document.querySelector('.ingredient-inventory')
  if (!inventoryEl) return
  
  const inventoryRect = inventoryEl.getBoundingClientRect()
  const endX = inventoryRect.left + inventoryRect.width / 2
  const endY = inventoryRect.top + inventoryRect.height / 2

  // Créer 5 particules
  for (let i = 0; i < 5; i++) {
    const particle = {
      id: particleId++,
      type: cell.content.type,
      emoji: cell.content.emoji || getIngredientEmoji(cell.content.type),
      style: {
        position: 'fixed',
        left: `${startX}px`,
        top: `${startY}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1,
        zIndex: 1000
      }
    }
    
    particles.value.push(particle)

    // Ajouter un petit délai aléatoire pour chaque particule
    setTimeout(() => {
      particle.style.left = `${endX}px`
      particle.style.top = `${endY}px`
      particle.style.opacity = 0
      
      // Supprimer la particule après l'animation
      setTimeout(() => {
        particles.value = particles.value.filter(p => p.id !== particle.id)
      }, 500)
    }, i * 100)
  }
}

const hasCollectedThisTurn = ref(false)

const handleCellClick = (cell: Cell, event: MouseEvent) => {
  if (cell.type === CellType.INGREDIENT && cell.content && !hasCollectedThisTurn.value) {
    ingredientsStore.collectIngredient(1, cell.content)
    createCollectEffect(cell, event)
    hasCollectedThisTurn.value = true
  }
}

// Cette fonction sera appelée quand le système de tours sera implémenté
const resetTurn = () => {
  hasCollectedThisTurn.value = false
}

onMounted(() => {
  regenerateBoard()
})

defineExpose({
  regenerateBoard,
  resetTurn
})
</script>

<style scoped>
.game-board {
  display: grid;
  gap: 4px;
  background: #2c3e50;
  padding: 8px;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.board-cell {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  text-align: center;
}

.board-cell:hover {
  transform: scale(1.05);
  z-index: 1;
}

.cell-coordinates {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.cell-content {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  text-align: center;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.8);
}

/* Types de cellules */
.empty {
  background: rgba(255, 255, 255, 0.05);
}

.ingredient {
  background: rgba(46, 204, 113, 0.2);
}

.object {
  background: rgba(52, 152, 219, 0.2);
}

.monster {
  background: rgba(231, 76, 60, 0.2);
}

.special {
  background: rgba(155, 89, 182, 0.2);
}

.has-content {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Ajout d'icônes ou symboles pour les différents types */
.ingredient::before {
  content: '🌿';
  font-size: 1.2rem;
}

.object::before {
  content: '📦';
  font-size: 1.2rem;
}

.monster::before {
  content: '👾';
  font-size: 1.2rem;
}

.special::before {
  content: '✨';
  font-size: 1.2rem;
}

/* Animation lors de la génération */
@keyframes cellAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.board-cell {
  animation: cellAppear 0.3s ease-out forwards;
}

.spawn {
  background: rgba(255, 215, 0, 0.2) !important;
  border: 2px solid rgba(255, 215, 0, 0.4) !important;
}

.spawn::before {
  content: '👑';
  font-size: 1.2rem;
}

/* Animation spéciale pour les spawns */
@keyframes spawnPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.spawn {
  animation: spawnPulse 2s infinite ease-in-out;
}

/* Ajout d'une ligne de symétrie visuelle */
.game-board::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.dense_wood {
  background: rgba(101, 67, 33, 0.5) !important;
  border: 2px solid rgba(101, 67, 33, 0.8) !important;
}

.dense_wood::before {
  content: '🌳';
  font-size: 1.2rem;
}

/* Animation pour le bois dense */
@keyframes woodSway {
  0% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
  100% { transform: rotate(-2deg); }
}

.dense_wood::before {
  display: inline-block;
  animation: woodSway 3s infinite ease-in-out;
}

/* Effet d'ombre pour montrer la connexion entre les bois denses */
.dense_wood {
  box-shadow: 0 0 10px rgba(101, 67, 33, 0.3);
}

.dense_wood:hover {
  box-shadow: 0 0 15px rgba(101, 67, 33, 0.5);
}

.collect-particle {
  position: fixed;
  pointer-events: none;
  font-size: 1.5rem;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
  animation: float 0.5s ease-out;
}

@keyframes float {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(360deg);
  }
}
</style> 