<script setup lang="ts">
// Don't import Navbar here
</script>

<template>
  <div id="app-container">
    <main class="main-content"> 
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global styles to enable scrolling */
html, body {
  margin: 0;
  padding: 0;
  height: auto;
  min-height: 100%;
  overflow-y: auto;
  position: relative;
}

#app {
  height: auto;
  min-height: 100%;
  overflow-y: auto;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  background-color: #E4E4E4;
  overflow-y: auto;
}

.main-content {
  flex-grow: 1;
  padding: 0;
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 100%;
  overflow-y: auto;
}

/* Override default Tailwind CSS max-width for larger screens */
@media (min-width: 768px) {
  .main-content {
    max-width: 100%;
  }
}
</style>