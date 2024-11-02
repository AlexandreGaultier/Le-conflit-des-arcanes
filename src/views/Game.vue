<template>
  <div class="game-container">
    <TurnManager class="turn-manager" />
    
    <div class="game-content">
      <div class="player-boards">
        <CharacterBoard 
          v-for="character in characters"
          :key="character.id"
          :character="character"
          :class="{ 'active': character.id === currentCharacter?.id }"
        />
      </div>

      <GameBoard 
        :size="boardSize"
        ref="gameBoard"
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
import { ref, computed, onMounted } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import CharacterBoard from '@/components/CharacterBoard.vue'
import TurnManager from '@/components/TurnManager.vue'
import { useCharactersStore } from '@/store/modules/characters'
import { useTurnsStore } from '@/store/modules/turns'
import DiceRollModal from '@/components/DiceRollModal.vue'

const boardSize = ref<8 | 10>(8)
const gameBoard = ref()
const charactersStore = useCharactersStore()
const turnsStore = useTurnsStore()

const characters = computed(() => charactersStore.characters)
const currentCharacter = computed(() => charactersStore.selectedCharacter)

const showDiceRoll = ref(true)
const diceResult = ref(0)
const startingPlayer = ref('')

onMounted(() => {
  charactersStore.initializePositions()
  const { diceResult: result, startingPlayer: player } = turnsStore.startGame()
  diceResult.value = result
  startingPlayer.value = player
})
</script>

<style scoped lang="scss">
.game-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.turn-manager {
  width: 100%;
}

.game-content {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.player-boards {
  width: 350px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.active {
  border: 2px solid #42b883;
  border-radius: 12px;
}

@media (max-width: 1200px) {
  .game-content {
    flex-direction: column;
  }

  .player-boards {
    width: 100%;
    min-width: 0;
  }
}
</style> 