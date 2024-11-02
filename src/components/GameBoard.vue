<template>
  <div class="game-board" :style="boardStyle">
    <div v-for="row in board" :key="row[0].y" class="board-row">
      <div 
        v-for="(cell, index) in row" 
        :key="`${cell.x}-${cell.y}`"
        class="board-cell"
        :class="[
          cell.type,
          { 
            'has-character': getCharacterAtPosition(cell.x, cell.y),
            'movable': isMovableCell(cell.x, cell.y),
            'disabled': !isMovableCell(cell.x, cell.y) && !getCharacterAtPosition(cell.x, cell.y),
            'collectable': canCollectIngredient(cell),
            'has-ingredient': cell.type === 'ingredient',
          }
        ]"
        :data-x="cell.x"
        :data-y="cell.y"
        @click="handleCellClick(cell)"
      >
        {{ cell.content?.emoji }}
        <div class="cell-coordinates">{{ cell.x }},{{ cell.y }}</div>
        <div v-if="cell.content" class="cell-content">
          {{ cell.content.name }}
        </div>
        
        <div 
          v-if="getCharacterAtPosition(cell.x, cell.y)"
          class="character-token"
          :class="[
            getCharacterClass(getCharacterAtPosition(cell.x, cell.y)?.class),
            { 'active': getCharacterAtPosition(cell.x, cell.y)?.id === currentCharacter?.id }
          ]"
        >
          {{ getClassEmoji(getCharacterAtPosition(cell.x, cell.y)?.class) }}
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
import { ref, computed, watch } from 'vue'
import { useCharactersStore } from '@/store/modules/characters'
import { useTurnsStore } from '@/store/modules/turns'
import { useIngredientsStore } from '@/store/modules/ingredients'
import { CharacterClass } from '@/types/CharacterTypes'
import { CellType } from '@/types/GameTypes'
import type { Cell } from '@/types/GameTypes'
import { IngredientType } from '@/types/IngredientTypes'
import { toRaw } from 'vue'

const charactersStore = useCharactersStore()
const turnsStore = useTurnsStore()

// Définition des props
const props = defineProps<{
  board: Cell[][]
}>()

// Style du plateau
const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.board[0]?.length || 8}, 1fr)`,
  gridTemplateRows: `repeat(${props.board.length || 8}, 1fr)`
}))

// Récupération du personnage actif
const currentCharacter = computed(() => {
  const currentId = turnsStore.currentPlayerId
  
  if (!currentId) return null
  
  const character = charactersStore.characters.find(c => c.id === currentId)
  return character
})

const getCharacterAtPosition = (x: number, y: number) => {
  return charactersStore.characters.find(char => 
    char.position?.x === x && char.position?.y === y
  )
}

const getClassEmoji = (characterClass: CharacterClass): string => {
  const emojis = {
    [CharacterClass.ELEMENTALIST]: '🔥',
    [CharacterClass.NECROMANCER]: '💀',
    [CharacterClass.ENCHANTER]: '✨',
    [CharacterClass.ALCHEMIST]: '⚗️'
  }
  return emojis[characterClass] || ''
}

const getCharacterClass = (characterClass: CharacterClass | undefined): string => {
  return characterClass?.toLowerCase() || ''
}

const isMovableCell = (x: number, y: number): boolean => {
  if (!currentCharacter.value) {
    // console.log('Pas de personnage actif')
    return false
  }

  if (!turnsStore.canMove) {
    // console.log('Déplacement déjà effectué ce tour')
    return false
  }

  if (!currentCharacter.value.position) {
    // console.log('Position du personnage non définie')
    return false
  }

  const { x: currentX, y: currentY } = currentCharacter.value.position
  const distance = Math.abs(x - currentX) + Math.abs(y - currentY)
  
  return distance <= currentCharacter.value.movement && 
         distance > 0 && 
         !getCharacterAtPosition(x, y)
}

const handleCellClick = (cell: Cell) => {
  if (isMovableCell(cell.x, cell.y)) {
    moveCharacter(cell.x, cell.y)
  } else if (cell.type === 'ingredient' && !canCollectIngredient(cell)) {
    console.log('💡 Pour collecter un ingrédient, déplacez-vous d\'abord sur sa case !')
  } else if (canCollectIngredient(cell)) {
    collectIngredient(cell)
  }
}

const canCollectIngredient = (cell: Cell): boolean => {
  if (!currentCharacter.value?.position) return false
  
  return currentCharacter.value.position.x === cell.x && 
         currentCharacter.value.position.y === cell.y && 
         cell.type === 'ingredient'
}

const collectIngredient = (cell: Cell) => {
  if (!currentCharacter.value || !cell.content) return

  const ingredientsStore = useIngredientsStore()
  
  // Normalisation du type (suppression des accents et espaces)
  const normalizedType = cell.content.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toUpperCase()
    .replace(/ /g, '_') as IngredientType

  ingredientsStore.addIngredient(
    currentCharacter.value.id,
    {
      type: normalizedType,
      quantity: 1
    }
  )
}

const moveCharacter = (x: number, y: number) => {
  if (currentCharacter.value && turnsStore.useMovement()) {
    charactersStore.moveCharacter(currentCharacter.value.id, { x, y })
  }
}

const resetTurn = () => {
  // Reset logic here
}

defineExpose({
  regenerateBoard: () => {}, // Add your regenerateBoard logic here
  resetTurn
})

</script>

<style scoped lang="scss">
.game-board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  padding: 4px;
}

.board-row {
  display: contents;
}

.board-cell {
  aspect-ratio: 1;
  padding: 0.2rem;
  font-size: 0.65rem;
  min-height: 0;
  background: rgba(40, 40, 40, 0.8);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(60, 60, 60, 0.8);
    transform: scale(1.02);
    box-shadow: 0 0 8px rgba(66, 184, 131, 0.3);
  }

  &.movable {
    border-color: rgba(66, 184, 131, 0.5);
    
    &:hover {
      background: rgba(66, 184, 131, 0.2);
      box-shadow: 0 0 12px rgba(66, 184, 131, 0.4);
    }
  }

  &.collecting {
    animation: collect 0.5s ease-out;
  }

  &.collectable {
    cursor: pointer;
    border: 2px solid #42b883;
    animation: pulse 1.5s infinite;
    
    &:hover {
      background: rgba(66, 184, 131, 0.2);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(66, 184, 131, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(66, 184, 131, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(66, 184, 131, 0);
    }
  }

  &.has-ingredient {
    border: 1px solid rgba(66, 184, 131, 0.3);
  }
}

@keyframes collect {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.cell-coordinates {
  font-size: 0.45rem;
  opacity: 0.4;
  position: absolute;
  bottom: 2px;
  right: 2px;
  color: rgba(255, 255, 255, 0.6);
}

.cell-content {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

.dense_wood {
  background: rgba(101, 67, 33, 0.5) !important;
  border: 2px solid rgba(101, 67, 33, 0.8) !important;
}

.dense_wood::before {
  content: '';
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

.character-token {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &.elementalist {
    background: rgba(239, 68, 68, 0.8);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }
  
  &.necromancer {
    background: rgba(99, 102, 241, 0.8);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  }
  
  &.enchanter {
    background: rgba(236, 72, 153, 0.8);
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
  }
  
  &.alchemist {
    background: rgba(16, 185, 129, 0.8);
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  }

  &.active {
    transform: scale(1.1);
    box-shadow: 0 0 12px rgba(66, 184, 131, 0.6);
  }
}

.board-cell {
  position: relative;
  transition: all 0.3s ease;
  
  &.movable {
    border: 2px dashed #42b883;
    cursor: pointer;
    
    &:hover {
      background: rgba(66, 184, 131, 0.2);
      transform: scale(1.05);
    }

    &::after {
      content: '•';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #42b883;
      font-size: 2rem;
      opacity: 0.5;
    }
  }
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: none;
    }
  }

  &.has-character {
    border: none;
    
    &::after {
      display: none;
    }
  }
}

.movable {
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px dashed #42b883;
    border-radius: 4px;
    animation: borderDash 1s linear infinite;
  }
}

@keyframes borderDash {
  to {
    stroke-dashoffset: -10;
  }
}

.board-cell {
  &.movable:hover {
    background: rgba(66, 184, 131, 0.2);
    cursor: pointer;
  }
}
</style> 