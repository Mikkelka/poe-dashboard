// Shared utility functions

export const getStatusText = (status) => {
  const statusMap = {
    'active': 'Aktiv',
    'paused': 'Pause',
    'completed': 'Færdig'
  }
  return statusMap[status] || status
}

export const getGuideIndicator = (status) => {
  const indicatorMap = {
    'up-to-date': '✓',
    'outdated': '⚠',
    'unknown': '?'
  }
  return indicatorMap[status] || '?'
}

export const getGuideText = (status) => {
  const textMap = {
    'up-to-date': 'Guide opdateret',
    'outdated': 'Guide forældet',
    'unknown': 'Guide ukendt'
  }
  return textMap[status] || 'Guide ukendt'
}

export const formatLastOpened = (timestamp) => {
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