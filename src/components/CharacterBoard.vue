<template>
  <div class="character-board">
    <div class="character-header">
      <div class="character-avatar">
        {{ getClassEmoji(character.class) }}
      </div>
      <div class="character-info">
        <h3>{{ character.name }}</h3>
        <span class="character-class">{{ getClassName(character.class) }}</span>
      </div>
    </div>

    <div class="character-stats">
      <div class="stat-item">
        <span class="stat-label">PV</span>
        <div>{{ character.hp }}/{{ character.maxHp }}</div>
        <div class="health-bar">
          <div 
            class="health-fill" 
            :style="{ width: `${(character.hp / character.maxHp) * 100}%` }"
          ></div>
          <span class="health-text">{{ character.hp }}/{{ character.maxHp }}</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-label">Déplacement</span>
        <span class="stat-value">{{ character.movement }} cases</span>
      </div>
    </div>

    <div class="spells-section">
      <h4>Sorts</h4>
      <div class="spells-list">
        <div 
          v-for="spell in character.spells" 
          :key="spell.id"
          class="spell-card"
          @mouseover="selectedSpell = spell"
          @mouseleave="selectedSpell = null"
        >
          <div class="spell-header">
            <span class="spell-name">{{ spell.name }}</span>
            <span class="spell-cost">{{ spell.cost }} PA</span>
          </div>
          <div v-if="selectedSpell === spell" class="spell-tooltip">
            <p>{{ spell.description }}</p>
            <div class="spell-stats">
              <span v-if="spell.damage">Dégâts: {{ spell.damage }}</span>
              <span v-if="spell.range">Portée: {{ spell.range }}</span>
              <span v-if="spell.duration">Durée: {{ spell.duration }} tours</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="inventory-section">
      <h4>Inventaire</h4>
      <IngredientInventory 
        :playerId="character.id"
        :playerName="character.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Character, CharacterClass, Spell } from '@/types/CharacterTypes'
import IngredientInventory from './IngredientInventory.vue'

const props = defineProps<{
  character: Character
}>()

const selectedSpell = ref<Spell | null>(null)

const getClassEmoji = (characterClass: CharacterClass): string => {
  const emojis = {
    [CharacterClass.ELEMENTALIST]: '🔥',
    [CharacterClass.NECROMANCER]: '💀',
    [CharacterClass.ENCHANTER]: '✨',
    [CharacterClass.ALCHEMIST]: '⚗️'
  }
  return emojis[characterClass]
}

const getClassName = (characterClass: CharacterClass): string => {
  const names = {
    [CharacterClass.ELEMENTALIST]: 'Élémentaliste',
    [CharacterClass.NECROMANCER]: 'Nécromancien',
    [CharacterClass.ENCHANTER]: 'Enchanteur',
    [CharacterClass.ALCHEMIST]: 'Alchimiste'
  }
  return names[characterClass]
}
</script>

<style scoped lang="scss">
.character-board {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
}

.character-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.character-avatar {
  font-size: 2rem;
  background: rgba(0, 0, 0, 0.2);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.character-info {
  h3 {
    margin: 0;
    color: #42b883;
  }

  .character-class {
    font-size: 0.9rem;
    color: #64748b;
  }
}

.character-stats {
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;

  .stat-label {
    min-width: 100px;
    color: #64748b;
  }
}

.health-bar {
  flex: 1;
  height: 20px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .health-fill {
    height: 100%;
    background: #42b883;
    transition: width 0.3s ease;
  }

  .health-text {
    position: absolute;
    width: 100%;
    text-align: center;
    line-height: 20px;
    color: white;
    mix-blend-mode: difference;
  }
}

.spells-section {
  margin-bottom: 1.5rem;

  h4 {
    color: #42b883;
    margin-bottom: 1rem;
  }
}

.spells-list {
  display: grid;
  gap: 0.5rem;
}

.spell-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  position: relative;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.spell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .spell-cost {
    font-size: 0.8rem;
    color: #64748b;
    background: rgba(0, 0, 0, 0.2);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }
}

.spell-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a2e;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.5rem;

  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
  }

  .spell-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #64748b;
  }
}

.inventory-section {
  h4 {
    color: #42b883;
    margin-bottom: 1rem;
  }
}
</style> 