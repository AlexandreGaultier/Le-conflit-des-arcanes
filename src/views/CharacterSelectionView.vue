<template>
  <div class="character-selection-view">
    <h1>Choisissez votre Sorcier</h1>
    
    <div class="character-grid">
      <div 
        v-for="characterClass in Object.values(CharacterClass)"
        :key="characterClass"
        class="character-card"
        :class="{ 'selected': selectedClass === characterClass }"
        @click="selectClass(characterClass)"
      >
        <div class="character-icon">{{ getClassEmoji(characterClass) }}</div>
        <h3>{{ getClassName(characterClass) }}</h3>
        
        <div class="character-stats">
          <div>PV: {{ CHARACTER_STATS[characterClass].baseHp }}</div>
          <div>Déplacement: {{ CHARACTER_STATS[characterClass].movement }}</div>
        </div>

        <div class="character-spells">
          <h4>Sorts:</h4>
          <ul>
            <li v-for="spell in CHARACTER_STATS[characterClass].spells"
                :key="spell.id">
              {{ spell.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="selectedClass" class="character-creation">
      <input 
        v-model="characterName"
        placeholder="Nom du personnage"
        class="name-input"
      />
      <button 
        @click="createCharacter"
        :disabled="!characterName"
        class="create-button"
      >
        Créer le personnage
      </button>
    </div>

    <div class="selected-characters" v-if="selectedCharacters.length > 0">
      <h2>Sorciers sélectionnés</h2>
      <div class="selected-list">
        <div 
          v-for="character in selectedCharacters" 
          :key="character.id"
          class="selected-character"
        >
          <span class="character-emoji">{{ getClassEmoji(character.class) }}</span>
          <span class="character-name">{{ character.name }}</span>
          <span class="character-class">{{ getClassName(character.class) }}</span>
        </div>
      </div>
      
      <div class="actions">
        <button 
          class="start-game"
          @click="startGame"
          :disabled="selectedCharacters.length < requiredPlayers"
        >
          Commencer la partie
          <span v-if="selectedCharacters.length < requiredPlayers">
            ({{ requiredPlayers - selectedCharacters.length }} joueurs restants)
          </span>
        </button>
        <button class="reset-selection" @click="resetSelection">
          Réinitialiser la sélection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CharacterClass, CHARACTER_STATS } from '@/types/CharacterTypes'
import { useCharactersStore } from '@/store/modules/characters'

const router = useRouter()
const charactersStore = useCharactersStore()
const selectedClass = ref<CharacterClass | null>(null)
const characterName = ref('')
const selectedCharacters = ref<Character[]>([])
const requiredPlayers = 2

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

const selectClass = (characterClass: CharacterClass) => {
  selectedClass.value = characterClass
  characterName.value = ''
}

const createCharacter = () => {
  if (selectedClass.value && characterName.value) {
    const character = charactersStore.createCharacter(
      selectedClass.value,
      characterName.value
    )
    selectedCharacters.value.push(character)
    selectedClass.value = null
    characterName.value = ''
  }
}

const startGame = () => {
  if (selectedCharacters.value.length === requiredPlayers) {
    charactersStore.$patch({ characters: selectedCharacters.value })
    router.push('/game')
  }
}

const resetSelection = () => {
  selectedCharacters.value = []
  selectedClass.value = null
  characterName.value = ''
  charactersStore.$reset()
}
</script>

<style scoped lang="scss">
.character-selection-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: #42b883;
  }
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.character-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  &.selected {
    box-shadow: 0 0 0 2px #42b883;
  }
}

.character-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.character-stats {
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #64748b;
}

.character-spells {
  ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
}

.character-creation {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.name-input {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
}

.create-button {
  padding: 0.5rem 1.5rem;
  background: #42b883;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.selected-characters {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  h2 {
    margin-bottom: 1rem;
  }
}

.selected-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.selected-character {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 6px;

  .character-emoji {
    font-size: 1.5rem;
  }

  .character-name {
    font-weight: bold;
  }

  .character-class {
    color: #64748b;
    font-size: 0.9rem;
  }
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .start-game {
    background: #42b883;
    color: white;

    &:hover:not(:disabled) {
      background: #3aa876;
      transform: translateY(-2px);
    }
  }

  .reset-selection {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.3);
    }
  }
}
</style> 