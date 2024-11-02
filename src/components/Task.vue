<template>
  <div class="kanban">
    <h1 class="kanban-title">Tableau des Tâches</h1>
    <div class="columns">
      <div class="column" v-for="(status, index) in statuses" :key="index">
        <div class="column-header">
          <h2>{{ status.title }}</h2>
          <span class="task-count">{{ tasks.filter(t => t.status === status.key).length }} tâches</span>
        </div>
        <div class="task-list">
          <div 
            class="task-card" 
            v-for="task in tasks.filter(t => t.status === status.key)" 
            :key="task.id"
            @click="openTaskModal(task)"
          >
            <div class="task-header">
              <h3>{{ task.title }}</h3>
              <span :class="['priority-badge', `priority-${task.priority.toLowerCase()}`]">
                {{ task.priority }}
              </span>
            </div>
            <p class="task-description">{{ task.description }}</p>
            <div class="task-footer">
              <span class="task-id">#{{ task.id }}</span>
              <div class="task-actions">
                <button 
                  v-if="status.key !== 'todo'"
                  @click.stop="moveTask(task, 'previous')"
                  class="action-button previous"
                >←</button>
                <button 
                  v-if="status.key !== 'done'"
                  @click.stop="moveTask(task, 'next')"
                  class="action-button next"
                >→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedTask" class="modal-overlay" @click="closeTaskModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeTaskModal">&times;</button>
        <div class="modal-header">
          <h2>{{ selectedTask.title }}</h2>
          <span :class="['priority-badge', `priority-${selectedTask.priority.toLowerCase()}`]">
            {{ selectedTask.priority }}
          </span>
        </div>
        <div class="modal-body">
          <div class="task-detail">
            <h3>Description</h3>
            <p>{{ selectedTask.description }}</p>
          </div>
          <div class="task-detail">
            <h3>Statut actuel</h3>
            <p>{{ getStatusTitle(selectedTask.status) }}</p>
          </div>
          <div class="task-detail">
            <h3>Actions disponibles</h3>
            <div class="modal-actions">
              <button 
                v-if="selectedTask.status !== 'todo'"
                @click="moveTask(selectedTask, 'previous')"
                class="action-button previous"
              >Déplacer vers la colonne précédente</button>
              <button 
                v-if="selectedTask.status !== 'done'"
                @click="moveTask(selectedTask, 'next')"
                class="action-button next"
              >Déplacer vers la colonne suivante</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import tasksData from '../data/tasks.json'

const selectedTask = ref(null)
const statuses = ref([
  { title: 'À faire', key: 'todo' },
  { title: 'En cours', key: 'in-progress' },
  { title: 'Terminé', key: 'done' }
])
const tasks = ref(tasksData.tasks)

const openTaskModal = (task) => {
  selectedTask.value = task
}

const closeTaskModal = () => {
  selectedTask.value = null
}

const getStatusTitle = (key) => {
  return statuses.value.find(s => s.key === key)?.title
}

const moveTask = (task, direction) => {
  const statusOrder = ['todo', 'in-progress', 'done']
  const currentIndex = statusOrder.indexOf(task.status)
  
  if (direction === 'next' && currentIndex < statusOrder.length - 1) {
    task.status = statusOrder[currentIndex + 1]
  } else if (direction === 'previous' && currentIndex > 0) {
    task.status = statusOrder[currentIndex - 1]
  }
  
  closeTaskModal()
}
</script>

<style scoped>
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

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.column {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.column-header h2 {
  font-size: 1.25rem;
  color: #42b883;
  margin: 0;
}

.task-count {
  background: rgba(66, 184, 131, 0.1);
  color: #42b883;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(66, 184, 131, 0.3);
}

/* Animation d'entrée pour les cartes */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-card {
  animation: slideIn 0.3s ease-out forwards;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.task-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #e4e4e4;
}

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

.task-description {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.5rem 0;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
}

.task-id {
  color: #64748b;
}

.task-status {
  color: #42b883;
}

@media (max-width: 768px) {
  .kanban {
    padding: 1rem;
  }
  
  .columns {
    grid-template-columns: 1fr;
  }
  
  .column {
    min-height: auto;
  }
}

/* Nouveaux styles pour les boutons d'action */
.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-button.previous {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.action-button.next {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.action-button:hover {
  opacity: 0.8;
}

/* Styles pour la modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ef4444;
  transform: rotate(90deg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-detail {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.task-detail h3 {
  color: #42b883;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.modal-actions .action-button {
  padding: 0.5rem 1rem;
  flex: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation pour les badges de priorité */
.priority-badge {
  transition: all 0.2s ease;
}

.priority-badge:hover {
  transform: scale(1.05);
}

/* Animation pour les boutons d'action */
.action-button {
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: scale(1.05);
  opacity: 1;
}

.action-button.previous:hover {
  background: rgba(59, 130, 246, 0.3);
}

.action-button.next:hover {
  background: rgba(34, 197, 94, 0.3);
}

/* Animation pour le compteur de tâches */
.task-count {
  transition: all 0.2s ease;
}

.task-count:hover {
  transform: scale(1.05);
  background: rgba(66, 184, 131, 0.2);
}
</style>
