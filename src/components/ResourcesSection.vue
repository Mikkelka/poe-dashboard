<template>
  <section class="tab-content">
    <div class="section-header">
      <div class="section-title">
        <h2>Ressourcer</h2>
        <span class="count">{{ visibleResourceCount }} links</span>
      </div>
      <div class="section-actions">
        <button 
          v-if="hiddenResources.length > 0" 
          @click="restoreAllResources" 
          class="btn-outline"
        >
          Gendan Alle ({{ hiddenResources.length }})
        </button>
        <button class="btn-primary" @click="$emit('add-resource')">+ Tilføj Ressource</button>
      </div>
    </div>
    
    <div v-if="visibleResources.length === 0" class="empty-state">
      <h3>Ingen ressourcer synlige</h3>
      <p v-if="hiddenResources.length > 0">
        Alle ressourcer er skjulte. Klik "Gendan Alle" for at få dem tilbage.
      </p>
      <p v-else>
        Tilføj nyttige links og ressourcer til dine Path of Exile builds.
      </p>
    </div>
    
    <div v-else class="resources-container">
      <div 
        v-for="category in categorizedResources" 
        :key="category.name"
        class="resource-group"
      >
        <h3>{{ category.name }}</h3>
        <div class="resource-grid">
          <div 
            v-for="resource in category.resources" 
            :key="resource.id" 
            class="resource-item"
          >
            <div class="resource-icon">{{ resource.icon }}</div>
            <div class="resource-content">
              <h4>{{ resource.title }}</h4>
              <p>{{ resource.description }}</p>
            </div>
            <div class="resource-actions">
              <a :href="resource.url" target="_blank" class="action-link">
                Åbn
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3.5 3.5L8.5 8.5M8.5 3.5L8.5 8.5L3.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <button 
                v-if="!resource.isDefault"
                @click="$emit('edit-resource', resource)" 
                class="action-link edit-btn"
                title="Rediger ressource"
              >
                Rediger
              </button>
              <button 
                @click="resource.isDefault ? hideResource(resource.id) : deleteResource(resource.id)" 
                class="action-link delete-btn"
                :title="resource.isDefault ? 'Skjul ressource' : 'Slet ressource'"
              >
                {{ resource.isDefault ? 'Skjul' : 'Slet' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defaultResources, categoryOrder } from '../data/resources.js'

export default {
  name: 'ResourcesSection',
  props: {
    resources: {
      type: Array,
      default: () => []
    },
    hiddenResourceIds: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-resource', 'edit-resource', 'hide-resource', 'delete-resource', 'restore-resources'],
  computed: {
    allResources() {
      // Combine default resources with custom user resources
      const customResources = this.resources.filter(r => !r.isDefault)
      return [...defaultResources, ...customResources]
    },
    
    visibleResources() {
      return this.allResources.filter(resource => 
        !this.hiddenResourceIds.includes(resource.id)
      )
    },
    
    hiddenResources() {
      return this.allResources.filter(resource => 
        this.hiddenResourceIds.includes(resource.id)
      )
    },
    
    visibleResourceCount() {
      return this.visibleResources.length
    },
    
    categorizedResources() {
      const categories = {}
      
      // Group visible resources by category
      this.visibleResources.forEach(resource => {
        if (!categories[resource.category]) {
          categories[resource.category] = []
        }
        categories[resource.category].push(resource)
      })
      
      // Return in specified order
      return categoryOrder
        .filter(categoryName => categories[categoryName])
        .map(categoryName => ({
          name: categoryName,
          resources: categories[categoryName]
        }))
    }
  },
  
  methods: {
    hideResource(resourceId) {
      this.$emit('hide-resource', resourceId)
    },
    
    deleteResource(resourceId) {
      this.$emit('delete-resource', resourceId)
    },
    
    restoreAllResources() {
      this.$emit('restore-resources')
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e5e5e5;
}

.count {
  background: #333333;
  color: #999999;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.section-actions {
  display: flex;
  gap: 12px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999999;
}

.empty-state h3 {
  color: #e5e5e5;
  margin-bottom: 8px;
}

.resources-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.resource-group h3 {
  color: #e5e5e5;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333333;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
}

.resource-item:hover {
  border-color: #555555;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.resource-icon {
  font-size: 2rem;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-content {
  flex: 1;
  min-width: 0;
}

.resource-content h4 {
  color: #e5e5e5;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.resource-content p {
  color: #999999;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.resource-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.action-link:hover {
  background: rgba(229, 229, 229, 0.1);
}

.edit-btn {
  color: #4caf50;
}

.edit-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #66bb6a;
}

.delete-btn {
  color: #ff6b6b;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff9999;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .resource-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .resource-actions {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>