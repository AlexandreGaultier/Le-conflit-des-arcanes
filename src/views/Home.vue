<template>
  <div class="home">
    <div class="title-container">
      <h1>Le Conflit des Arcanes</h1>
      <p class="subtitle">Un jeu de stratégie et de magie pour 2 joueurs</p>
    </div>

    <div class="menu">
      <router-link to="/character-selection" class="menu-button start">
        Nouvelle Partie
      </router-link>
      <router-link to="/tasks" class="menu-button tasks">
        Voir les Tâches
      </router-link>
      <button class="menu-button rules" @click="showRules = true">
        Règles du jeu
      </button>
    </div>

    <!-- Modal des règles -->
    <div v-if="showRules" class="rules-modal">
      <div class="rules-content">
        <h2>Règles du jeu</h2>
        <div class="rules-text">
          <h3>But du jeu</h3>
          <p>Affrontez-vous dans un duel de sorciers ! Collectez des ingrédients, lancez des sorts et éliminez votre adversaire.</p>

          <h3>Tour de jeu</h3>
          <ul>
            <li>3 actions par tour</li>
            <li>Déplacement (1 action)</li>
            <li>Collecte d'ingrédients (1 action)</li>
            <li>Lancement de sorts (1-2 actions)</li>
          </ul>

          <h3>Victoire</h3>
          <p>La partie se termine quand un sorcier est vaincu ou qu'un joueur atteint 10 points.</p>
        </div>
        <button class="close-button" @click="showRules = false">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showRules = ref(false)
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.title-container {
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #42b883, #347474);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .subtitle {
    font-size: 1.2rem;
    color: #64748b;
  }
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.menu-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;

  &.start {
    background: #42b883;
    color: white;

    &:hover {
      background: #3aa876;
      transform: translateY(-2px);
    }
  }

  &.tasks {
    background: #4a90e2;
    color: white;

    &:hover {
      background: #357abd;
      transform: translateY(-2px);
    }
  }

  &.rules {
    background: rgba(255, 255, 255, 0.1);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rules-content {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    color: #42b883;
    margin-bottom: 1.5rem;
  }

  h3 {
    color: #64748b;
    margin: 1rem 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 1rem 0;

    li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;

      &::before {
        content: "•";
        color: #42b883;
        position: absolute;
        left: 0;
      }
    }
  }
}

.close-button {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>