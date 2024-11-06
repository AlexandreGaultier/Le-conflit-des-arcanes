<template>
  <div class="kanban">
    <h1 class="kanban-title">Diagramme de Gantt</h1>
    
    <div class="gantt-container">
      <!-- En-tête avec les dates -->
      <div class="gantt-header">
        <div class="task-info-header">Tâches</div>
        <div class="timeline-header">
          <div v-for="date in timelineDates" :key="date.getTime()" class="date-column">
            {{ formatDate(date) }}
          </div>
        </div>
      </div>

      <!-- Corps du Gantt -->
      <div class="gantt-body">
        <div v-for="task in tasks" :key="task.id" class="gantt-row">
          <div class="task-info">
            <h3>{{ task.title }}</h3>
            <span :class="['priority-badge', `priority-${task.priority.toLowerCase()}`]">
              {{ task.priority }}
            </span>
          </div>
          <div class="timeline">
            <div 
              class="task-bar"
              :style="getTaskStyle(task)"
              @mouseenter="showTaskDetails(task, $event)"
              @mouseleave="hideTaskDetails"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip pour les détails -->
    <div v-if="selectedTask" class="task-tooltip" :style="tooltipStyle">
      <h3>{{ selectedTask.title }}</h3>
      <p>{{ selectedTask.description }}</p>
      <p>Début: {{ formatDate(selectedTask.startDate) }}</p>
      <p>Fin: {{ formatDate(selectedTask.endDate) }}</p>
      <p>Durée estimée: {{ selectedTask.details.estimatedTime }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import tasksData from '../data/tasks.json'

interface Task {
  id: string | number
  title: string
  description: string
  startDate: string
  endDate: string
  priority: string
  details: {
    estimatedTime: string
  }
}

const tasks = ref(tasksData.tasks)
const selectedTask = ref<Task | null>(null)
const mousePosition = ref({ x: 0, y: 0 })

// Calcul des dates pour la timeline
const timelineDates = computed(() => {
  const dates = []
  const startDate = new Date('2024-03-20')
  const endDate = new Date('2024-04-17')
  
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
})

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('fr-FR', { 
    day: '2-digit',
    month: '2-digit'
  })
}

const getTaskStyle = (task: Task) => {
  const start = new Date(task.startDate)
  const end = new Date(task.endDate)
  const totalDays = timelineDates.value.length
  
  const startOffset = (start.getTime() - timelineDates.value[0].getTime()) / (1000 * 60 * 60 * 24)
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
  
  return {
    left: `${(startOffset / totalDays) * 100}%`,
    width: `${(duration / totalDays) * 100}%`,
    backgroundColor: task.priority === 'Élevée' ? '#ef4444' : 
                    task.priority === 'Moyenne' ? '#eab308' : '#22c55e'
  }
}

const showTaskDetails = (task: Task, event: MouseEvent) => {
  selectedTask.value = task
  mousePosition.value = { x: event.clientX, y: event.clientY }
}

const hideTaskDetails = () => {
  selectedTask.value = null
}

const tooltipStyle = computed(() => ({
  left: `${mousePosition.value.x + 10}px`,
  top: `${mousePosition.value.y + 10}px`
}))
</script>

<style scoped>
/* Styles de base hérités de Task.vue */
.kanban {
  padding: 2rem;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.kanban-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

/* Styles spécifiques au Gantt */
.gantt-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
}

.gantt-header {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.task-info-header {
  width: 250px;
  flex-shrink: 0;
  font-weight: bold;
  color: #42b883;
}

.timeline-header {
  display: flex;
  flex: 1;
}

.date-column {
  flex: 1;
  text-align: center;
  min-width: 50px;
  color: #94a3b8;
  font-size: 0.875rem;
}

.gantt-body {
  margin-top: 1rem;
}

.gantt-row {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  animation: slideIn 0.3s ease-out forwards;
}

.task-info {
  width: 250px;
  flex-shrink: 0;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-info h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #e4e4e4;
}

.timeline {
  flex: 1;
  position: relative;
  height: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.task-bar {
  position: absolute;
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.task-bar:hover {
  transform: scaleY(1.1);
  filter: brightness(1.2);
}

.task-tooltip {
  position: fixed;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 300px;
  animation: fadeIn 0.2s ease-out;
}

.task-tooltip h3 {
  margin: 0 0 0.5rem 0;
  color: #42b883;
}

.task-tooltip p {
  margin: 0.25rem 0;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Réutilisation des styles des badges de priorité de Task.vue */
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-élevée {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.priority-moyenne {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}

.priority-basse {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

@media (max-width: 768px) {
  .gantt-container {
    padding: 1rem;
  }
  
  .task-info {
    width: 200px;
  }
}
</style> 