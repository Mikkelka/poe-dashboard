<template>
  <header class="bg-gray-900 border-b border-gray-700 py-6 mb-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
    <div class="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-4 md:px-6 gap-5 md:gap-0 text-center md:text-left">
      <div>
        <h1 class="text-3xl font-bold text-gray-200 mb-1">PoE Tracker</h1>
        <p class="text-gray-400 text-base">Simpel og overskuelig build tracking</p>
      </div>
      <div class="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <span class="text-gray-400 text-sm">Hej, {{ user.displayName || user.email }}!</span>
        <button @click="$emit('logout')" class="bg-transparent text-gray-200 border border-gray-700 px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all hover:border-gray-200">Log ud</button>
        <button @click="$emit('new-build')" class="bg-gray-200 text-gray-900 border-none px-5 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-300">+ Ny Build</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
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