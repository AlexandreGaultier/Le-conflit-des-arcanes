<template>
  <div class="game-container">
    <div class="game-content">
      <div class="player-board">
        <CharacterBoard 
          v-if="currentCharacter"
          :character="currentCharacter"
        />
      </div>

      <GameBoard 
        :size="boardSize"
        ref="gameBoard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import CharacterBoard from '@/components/CharacterBoard.vue'
import { useCharactersStore } from '@/store/modules/characters'

const boardSize = ref<8 | 10>(8)
const gameBoard = ref()
const charactersStore = useCharactersStore()

const currentCharacter = computed(() => charactersStore.selectedCharacter)
</script>

<style scoped lang="scss">
.game-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
}

.game-content {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.player-board {
  width: 350px;
  min-width: 350px;
}

@media (max-width: 1200px) {
  .game-content {
    flex-direction: column;
  }

  .player-board {
    width: 100%;
    min-width: 0;
  }
}
</style> 