<template>
  <div class="dice-roll-modal">
    <div class="modal-content">
      <div class="dice-animation" :class="{ 'rolling': isRolling }">
        {{ isRolling ? '🎲' : diceResult }}
      </div>
      <h2>{{ resultMessage }}</h2>
      <button @click="$emit('close')" class="start-button">
        Commencer la partie
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  diceResult: number;
  startingPlayer: string;
}>()

const isRolling = ref(true)
const resultMessage = computed(() => 
  `${props.startingPlayer} commence la partie ! (${props.diceResult})`
)

onMounted(() => {
  setTimeout(() => {
    isRolling.value = false
  }, 1500)
})

defineEmits(['close'])
</script>

<style scoped lang="scss">
.dice-roll-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.dice-animation {
  font-size: 4rem;
  margin-bottom: 1rem;
  
  &.rolling {
    animation: roll 0.5s infinite;
  }
}

.start-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3aa876;
    transform: translateY(-2px);
  }
}

@keyframes roll {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 