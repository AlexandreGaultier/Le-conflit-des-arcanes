<template>
  <div class="game-container">
    <h1>Le Conflit des Arcanes</h1>
    <div class="game-settings">
      <label>
        Taille du plateau:
        <select v-model="boardSize">
          <option :value="8">8x8</option>
          <option :value="10">10x10</option>
        </select>
      </label>
      <button @click="generateNewBoard">Générer un nouveau plateau</button>
    </div>
    <GameBoard 
      :size="boardSize"
      ref="gameBoard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameBoard from '@/components/GameBoard.vue'

const boardSize = ref<8 | 10>(8)
const gameBoard = ref()

const generateNewBoard = () => {
  gameBoard.value?.regenerateBoard()
}
</script>

<style scoped>
.game-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.game-settings {
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
  align-items: center;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #e4e4e4;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

button {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #3aa876;
  transform: translateY(-1px);
}
</style> 