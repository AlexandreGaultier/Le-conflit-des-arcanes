<template>
    <div>
      <h1>Bienvenue dans le jeu de Sorciers !</h1>
      <router-link to="/tasks">Voir les Tâches</router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Home'
  });
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  </style>