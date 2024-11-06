<template>
  <div class="game-view">
    <div class="game-layout">
      <!-- Character Board du joueur 1 -->
      <CharacterBoard 
        :character="charactersStore.characters[0]"
        :is-active="charactersStore.characters[0]?.id === turnsStore.currentPlayerId"
      />

      <!-- Plateau central -->
      <div class="center-content">
        <TurnManager />
        <GameBoard 
          ref="gameBoard"
          :board="board"
        />
      </div>

      <!-- Character Board du joueur 2 -->
      <CharacterBoard 
        :character="charactersStore.characters[1]"
        :is-active="charactersStore.characters[1]?.id === turnsStore.currentPlayerId"
      />
    </div>

    <DiceRollModal
      v-if="showDiceRoll"
      :dice-result="diceResult"
      :starting-player="startingPlayer"
      @close="showDiceRoll = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCharactersStore } from '../store/modules/characters'
import { useTurnsStore } from '../store/modules/turns'
import { BoardGenerator } from '../services/BoardGenerator'
import GameBoard from '@/components/GameBoard.vue'
import TurnManager from '@/components/TurnManager.vue'
import DiceRollModal from '@/components/DiceRollModal.vue'
import CharacterBoard from '@/components/CharacterBoard.vue'
import type { Cell } from '../types/GameTypes'

const charactersStore = useCharactersStore()
const turnsStore = useTurnsStore()

// Initialiser le board immédiatement
const boardGenerator = new BoardGenerator()
const board = ref<Cell[][]>(boardGenerator.generateBoard(8))
const gameBoard = ref(null)
const showDiceRoll = ref(true)
const diceResult = ref(0)
const startingPlayer = ref('')

onMounted(() => {
  
  // 1. Initialiser les positions
  charactersStore.initializePositions()
  
  // 2. Démarrer le jeu et sélectionner le premier joueur
  const { diceResult: result, startingPlayer: player } = turnsStore.startGame()
  diceResult.value = result
  startingPlayer.value = player

//   console.log('État initial:', {
//     board: board.value,
//     characters: charactersStore.characters,
//     currentPlayerId: turnsStore.currentPlayerId,
//     selectedCharacterId: charactersStore.selectedCharacterId
//   })
})
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.game-layout {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 2rem);
  min-height: 0;
  overflow: hidden;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
  min-height: 0;
  max-width: 800px;
  margin: 0 auto;
}

:deep(.character-board) {
  flex: 0 0 180px;
  max-width: 180px;
  font-size: 0.8rem;
  height: auto;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.game-board) {
  width: 100%;
  max-width: min(700px, 90vh);
  aspect-ratio: 1;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 4px;
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.turn-manager) {
  width: 100%;
  max-width: 600px;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(30, 30, 30, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style> 