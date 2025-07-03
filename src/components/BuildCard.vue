<template>
  <div class="build-card">
    <div class="build-header">
      <div class="build-info">
        <h3>{{ build.buildName }}</h3>
      </div>
    </div>
    
    <div class="build-meta">
      <div class="build-meta-left">
        <span class="game-badge" :class="build.gameVersion">
          {{ build.gameVersion === 'poe1' ? 'PoE 1' : 'PoE 2' }}
        </span>
        <span class="status-dot" :class="build.buildStatus"></span>
        <span class="status-text">{{ getStatusText(build.buildStatus) }}</span>
      </div>
      <div class="guide-status" :class="build.guideStatus">
        <span class="guide-indicator">{{ getGuideIndicator(build.guideStatus) }}</span>
        <span class="guide-text">{{ getGuideText(build.guideStatus) }}</span>
      </div>
    </div>
    
    <div class="build-details">
      <div class="detail-item">
        <span class="label">League</span>
        <span class="value">{{ build.league || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Character</span>
        <span class="value">{{ build.characterName || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Sidst åbnet</span>
        <span class="value">{{ formatLastOpened(build.lastOpened) }}</span>
      </div>
    </div>

    <div class="build-actions">
      <a v-if="build.pobLink" :href="build.pobLink" target="_blank" class="action-link" @click="$emit('link-clicked', build.id)">
        <span>PoB Link</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <a v-if="build.guideLink" :href="build.guideLink" target="_blank" class="action-link" @click="$emit('link-clicked', build.id)">
        <span>Guide</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <button @click="$emit('edit-build', build)" class="action-link edit-btn">
        <span>Rediger</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuildCard',
  props: {
    build: {
      type: Object,
      required: true
    }
  },
  emits: ['edit-build', 'link-clicked'],
  methods: {
    getStatusText(status) {
      const statusMap = {
        'active': 'Aktiv',
        'paused': 'Pause',
        'completed': 'Færdig'
      }
      return statusMap[status] || status
    },
    
    getGuideIndicator(status) {
      const indicatorMap = {
        'up-to-date': '✓',
        'outdated': '⚠',
        'unknown': '?'
      }
      return indicatorMap[status] || '?'
    },
    
    getGuideText(status) {
      const textMap = {
        'up-to-date': 'Guide opdateret',
        'outdated': 'Guide forældet',
        'unknown': 'Guide ukendt'
      }
      return textMap[status] || 'Guide ukendt'
    },
    
    formatLastOpened(timestamp) {
      if (!timestamp) return 'Aldrig'
      
      const now = new Date()
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const diffMs = now - date
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffMinutes < 1) return 'Lige nu'
      if (diffMinutes < 60) return `${diffMinutes} minut${diffMinutes === 1 ? '' : 'ter'} siden`
      if (diffHours < 24) return `${diffHours} time${diffHours === 1 ? '' : 'r'} siden`
      if (diffDays < 30) return `${diffDays} dag${diffDays === 1 ? '' : 'e'} siden`
      
      // For longer periods, show actual date
      return date.toLocaleDateString('da-DK', { 
        day: 'numeric', 
        month: 'short', 
        year: diffDays > 365 ? 'numeric' : undefined 
      })
    }
  }
}
</script>

<style scoped>
.build-card {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.build-card:hover {
  border-color: #555555;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.build-header {
  margin-bottom: 16px;
}

.build-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0;
}

.build-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.build-meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.game-badge.poe1 {
  background: #fff3e0;
  color: #f57c00;
}

.game-badge.poe2 {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.active {
  background: #4caf50;
}

.status-dot.paused {
  background: #ff9800;
}

.status-dot.completed {
  background: #2196f3;
}

.status-text {
  font-size: 0.8rem;
  color: #999999;
}

.guide-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.guide-status.up-to-date {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.guide-status.outdated {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
}

.guide-status.unknown {
  background: rgba(158, 158, 158, 0.15);
  color: #9e9e9e;
}

.build-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item .label {
  color: #999999;
  font-size: 0.9rem;
}

.detail-item .value {
  color: #e5e5e5;
  font-weight: 500;
  font-size: 0.9rem;
}

.build-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #333333;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.action-link:hover {
  color: #999999;
}
</style>