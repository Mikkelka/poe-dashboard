<template>
  <header class="header">
    <div class="header-content">
      <div class="brand">
        <h1>PoE Tracker</h1>
        <p>Simpel og overskuelig build tracking</p>
      </div>
      <div class="header-actions">
        <span class="user-welcome">Hej, {{ user.displayName || user.email }}!</span>
        <button @click="$emit('logout')" class="btn-outline">Log ud</button>
        <button @click="$emit('new-build')" class="btn-primary">+ Ny Build</button>
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
.header {
  background: #1a1a1a;
  border-bottom: 1px solid #333333;
  padding: 24px 0;
  margin-bottom: 32px;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.brand h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e5e5e5;
  margin-bottom: 4px;
}

.brand p {
  color: #999999;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-welcome {
  color: #999999;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  color: #e5e5e5;
  border: 1px solid #333333;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: #e5e5e5;
}

.btn-primary {
  background: #e5e5e5;
  color: #1a1a1a;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #cccccc;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 0 16px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 12px;
  }
}
</style>