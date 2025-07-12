<template>
  <header class="header-full">
    <div class="header-content">
      <div>
        <h1 class="text-3xl font-bold text-gray-200 mb-1">PoE Tracker</h1>
        <p class="text-gray-400 text-base">Simpel og overskuelig build tracking</p>
      </div>
      <div class="header-actions">
        <span class="text-gray-400 text-sm">Hej, {{ user.displayName || user.email }}!</span>
        <button @click="$emit('logout')" class="btn-outline">Log ud</button>
        <button @click="$emit('new-build')" class="btn-primary">+ Ny Build</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['logout', 'new-build']
}
</script>

<style scoped>
/* All styles converted to Tailwind CSS classes */
</style>