<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1rem;
  background-color: #1a1a1a;
  text-align: center;
}

nav {
  margin-top: 1rem;
}

nav a {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

nav a:hover {
  color: #42b883;
}

nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}

main {
  flex: 1;
}

.nav-menu {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.nav-link {
  color: #42b883;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(66, 184, 131, 0.1);
}

.nav-link.router-link-active {
  background: rgba(66, 184, 131, 0.2);
  font-weight: 600;
}
</style>
