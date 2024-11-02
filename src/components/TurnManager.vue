<template>
  <div class="turn-manager">
    <div class="turn-info">
      <div class="turn-details">
        <div class="turn-number">Tour {{ turnStore.turnNumber }}</div>
        <div class="current-player">
          <span class="player-emoji">👤</span>
          {{ currentPlayerName }}
        </div>
      </div>
      <div class="phase-indicator">
        <div 
          v-for="phase in Object.values(TurnPhase)" 
          :key="phase"
          class="phase-dot"
          :class="{ 
            'active': turnStore.phase === phase,
            'completed': isPhaseCompleted(phase)
          }"
        >
          {{ getPhaseEmoji(phase) }}
        </div>
      </div>
    </div>

    <div class="actions-info">
      <div class="actions-left">
        <div 
          v-for="i in 3" 
          :key="i"
          class="action-point"
          :class="{ 'used': i > turnStore.actionsLeft }"
        />
      </div>
      <button 
        class="end-turn-button"
        @click="turnStore.endTurn()"
        :disabled="turnStore.actionsLeft > 0 && turnStore.phase === TurnPhase.ACTION"
      >
        Fin du tour
      </button>
    </div>

    <div v-if="turnStore.activeEffects.length > 0" class="active-effects">
      <div 
        v-for="effect in turnStore.activeEffects" 
        :key="effect.id"
        class="effect-tag"
      >
        {{ effect.id }} ({{ effect.duration }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TurnPhase } from '@/types/TurnTypes'
import { useTurnsStore } from '@/store/modules/turns'
import { useCharactersStore } from '@/store/modules/characters'

const turnStore = useTurnsStore()
const charactersStore = useCharactersStore()

const currentPlayerName = computed(() => {
  const currentPlayer = charactersStore.characters.find(
    char => char.id === turnStore.currentPlayerId
  )
  return currentPlayer?.name || 'Joueur inconnu'
})

const getPhaseEmoji = (phase: TurnPhase): string => {
  const emojis = {
    [TurnPhase.START]: '🌅',
    [TurnPhase.ACTION]: '⚔️',
    [TurnPhase.END]: '🌙'
  }
  return emojis[phase]
}

const isPhaseCompleted = (phase: TurnPhase): boolean => {
  const phases = Object.values(TurnPhase)
  const currentPhaseIndex = phases.indexOf(turnStore.phase)
  const phaseIndex = phases.indexOf(phase)
  return phaseIndex < currentPhaseIndex
}
</script>

<style scoped lang="scss">
.turn-manager {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.turn-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.turn-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.current-player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #64748b;

  .player-emoji {
    font-size: 1.2rem;
  }
}

.turn-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b883;
}

.phase-indicator {
  display: flex;
  gap: 1rem;
}

.phase-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  font-size: 1.2rem;

  &.active {
    background: #42b883;
    transform: scale(1.1);
  }

  &.completed {
    background: rgba(66, 184, 131, 0.3);
  }
}

.actions-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions-left {
  display: flex;
  gap: 0.5rem;
}

.action-point {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b883;
}
</style> 