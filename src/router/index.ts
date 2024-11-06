import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import CharacterSelectionView from '@/views/CharacterSelectionView.vue';
import Game from '@/views/Game.vue';
import { useCharactersStore } from '../store/modules/characters';
import Task from '@/components/Task.vue';
import Gantt from '@/components/Gantt.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/character-selection',
      name: 'character-selection',
      component: CharacterSelectionView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Task
    },
    {
      path: '/gantt',
      name: 'gantt',
      component: Gantt
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter: (to, from, next) => {
        const charactersStore = useCharactersStore();
        if (charactersStore.characters.length < 2) {
          next({ name: 'character-selection' });
        } else {
          next();
        }
      }
    }
  ]
});

export default router;