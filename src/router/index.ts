import { createRouter, createWebHistory } from 'vue-router';
import Game from '../views/Game.vue';
import Task from '../components/Task.vue';
import Gantt from '../components/Gantt.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: Game
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
    }
  ]
});

export default router;