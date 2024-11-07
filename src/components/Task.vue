<template>
  <div class="kanban">
    <div class="kanban-header">
      <h1 class="kanban-title">Tableau des Tâches</h1>
      <button class="reset-button" @click="resetTasks">
        Réinitialiser les tâches
      </button>
    </div>
    <div class="columns">
      <div class="column" v-for="(status, index) in statuses" :key="index">
        <div class="column-header">
          <h2>{{ status.title }}</h2>
          <span class="task-count">{{ tasks.filter((t: Task) => t.status === status.key).length }} tâches</span>
        </div>
        <div class="task-list">
          <div 
            class="task-card" 
            v-for="task in tasks.filter((t: Task) => t.status === status.key)" 
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
            <h3>Exigences Techniques</h3>
            <ul class="requirements-list">
              <li v-for="requirement in selectedTask.details.technicalRequirements" 
                  :key="requirement" 
                  class="requirement-item"
              >
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :checked="isRequirementCompleted(Number(selectedTask.id), requirement)"
                    @change="toggleRequirement(Number(selectedTask.id), requirement)"
                  >
                  <span class="checkmark"></span>
                  <span class="requirement-text">{{ requirement }}</span>
                </label>
              </li>
            </ul>
          </div>

          <div class="task-detail">
            <h3>Temps estimé</h3>
            <p>{{ selectedTask.details.estimatedTime }}</p>
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
import { ref, watch } from 'vue'
import tasksData from '../data/tasks.json'

interface Task {
  id: string | number
  title: string
  description: string
  status: string
  priority: string
  details: {
    technicalRequirements: string[]
    estimatedTime: string
  }
}

// Clé pour le localStorage
const STORAGE_KEY = 'game-dev-tasks'

// Clé pour le localStorage des requirements
const REQUIREMENTS_KEY = 'task-requirements'

// Structure pour stocker l'état des exigences
interface RequirementState {
  [taskId: number]: {
    [requirement: string]: boolean
  }
}

// Charger les tâches depuis le localStorage ou utiliser les données par défaut
const tasks = ref(loadTasks())
const selectedTask = ref<Task | null>(null)
const statuses = ref([
  { title: 'À faire', key: 'todo' },
  { title: 'En cours', key: 'in-progress' },
  { title: 'Terminé', key: 'done' }
])

// Charger l'état des exigences
const requirementStates = ref<RequirementState>(loadRequirementStates())

// Fonction pour charger les tâches
function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY)
  return savedTasks ? JSON.parse(savedTasks) : tasksData.tasks
}

// Fonction pour sauvegarder les tâches
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value))
}

// Observer les changements dans les tâches et sauvegarder
watch(tasks, () => {
  saveTasks()
}, { deep: true })

// Modification de la fonction moveTask pour utiliser la réactivité de Vue
const moveTask = (task: Task, direction: string) => {
  const statusOrder = ['todo', 'in-progress', 'done']
  const currentIndex = statusOrder.indexOf(task.status)
  
  if (direction === 'next' && currentIndex < statusOrder.length - 1) {
    task.status = statusOrder[currentIndex + 1]
  } else if (direction === 'previous' && currentIndex > 0) {
    task.status = statusOrder[currentIndex - 1]
  }
  
  // La sauvegarde sera déclenchée automatiquement grâce au watch
  closeTaskModal()
}

// Fonction pour réinitialiser les tâches
const resetTasks = () => {
  tasks.value = tasksData.tasks
  requirementStates.value = {}
  saveTasks()
  saveRequirementStates()
}

const openTaskModal = (task: Task) => {
  selectedTask.value = task
}

const closeTaskModal = () => {
  selectedTask.value = null
}

const getStatusTitle = (key: string) => {
  return statuses.value.find(s => s.key === key)?.title
}

// Nouvelles fonctions
// const formatDate = (dateString: string) => {
//   if (!dateString) return 'Non définie'
//   return new Date(dateString).toLocaleDateString('fr-FR', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   })
// }

// const isDeadlineClose = (deadline: string) => {
//   if (!deadline) return false
//   const daysUntilDeadline = Math.ceil(
//     (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//   )
//   return daysUntilDeadline <= 7 && daysUntilDeadline > 0
// }

// const getProgressClass = (progress: number) => {
//   if (!progress) return 'progress-none'
//   if (progress < 30) return 'progress-low'
//   if (progress < 70) return 'progress-medium'
//   return 'progress-high'
// }

function loadRequirementStates(): RequirementState {
  const saved = localStorage.getItem(REQUIREMENTS_KEY)
  return saved ? JSON.parse(saved) : {}
}

function saveRequirementStates() {
  localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(requirementStates.value))
}

function isRequirementCompleted(taskId: number, requirement: string): boolean {
  return requirementStates.value[taskId]?.[requirement] || false
}

function toggleRequirement(taskId: number, requirement: string) {
  if (!requirementStates.value[taskId]) {
    requirementStates.value[taskId] = {}
  }
  requirementStates.value[taskId][requirement] = !isRequirementCompleted(taskId, requirement)
  saveRequirementStates()
  
  // Mettre à jour le statut de la tâche si toutes les exigences sont complétées
  updateTaskStatus(taskId)
}

function updateTaskStatus(taskId: number) {
  const task = tasks.value.find((t: Task) => t.id === taskId)
  if (!task) return

  const requirements = task.details.technicalRequirements
  const completedCount = requirements.filter((r: string) => isRequirementCompleted(taskId, r)).length
  
  if (completedCount === requirements.length && task.status !== 'done') {
    task.status = 'done'
  } else if (completedCount > 0 && completedCount < requirements.length && task.status === 'todo') {
    task.status = 'in-progress'
  }
}

// Observer les changements
watch(requirementStates, () => {
  saveRequirementStates()
}, { deep: true })
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

/* Ajouter uniquement les nouveaux styles */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  color: #64748b;
  font-size: 0.875rem;
}

.detail-value {
  color: #e4e4e4;
  font-size: 0.95rem;
}

.deadline-close {
  color: #f59e0b;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(66, 184, 131, 0.1);
  color: #42b883;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  height: 24px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  transition: width 0.3s ease;
}

.progress-none { background: #64748b; }
.progress-low { background: #ef4444; }
.progress-medium { background: #f59e0b; }
.progress-high { background: #22c55e; }

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reset-button {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: scale(1.05);
}

/* Ajouter ces styles */
.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.requirement-item {
  padding: 0.5rem;
  margin: 0.25rem 0;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 4px;
  font-size: 0.95rem;
}

.requirement-item:hover {
  background: rgba(66, 184, 131, 0.2);
}

/* Styles pour les checkboxes personnalisées */
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
  width: 100%;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #42b883;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: rgba(66, 184, 131, 0.1);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #42b883;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.requirement-text {
  margin-left: 10px;
  flex: 1;
}

.requirement-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(66, 184, 131, 0.1);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.requirement-item:hover {
  background: rgba(66, 184, 131, 0.15);
  transform: translateX(5px);
}

/* Animation pour les checkboxes */
@keyframes checkmark {
  0% { transform: scale(0) rotate(45deg); }
  100% { transform: scale(1) rotate(45deg); }
}

.checkbox-container input:checked ~ .checkmark:after {
  animation: checkmark 0.2s ease-in-out;
}
</style>
