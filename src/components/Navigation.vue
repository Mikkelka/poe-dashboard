<template>
  <nav class="tabs">
    <button 
      class="tab" 
      :class="{ active: activeTab === 'builds' }"
      @click="$emit('tab-change', 'builds')"
    >
      Builds
    </button>
    <button 
      class="tab" 
      :class="{ active: activeTab === 'resources' }"
      @click="$emit('tab-change', 'resources')"
    >
      Ressourcer
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    activeTab: {
      type: String,
      required: true,
      default: 'builds'
    }
  },
  emits: ['tab-change']
}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #333333;
  margin-bottom: 40px;
}

.tab {
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #999999;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: #e5e5e5;
}

.tab.active {
  color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}
</style>