// Path of Exile 1 resources
const poe1Resources = [
  {
    id: 'poe1-1',
    title: 'PoEDB',
    description: 'Komplet database og reference',
    url: 'https://poedb.tw',
    icon: '📊',
    category: 'Path of Exile 1',
    type: 'database',
    isDefault: true
  },
  {
    id: 'poe1-2',
    title: 'Trade Site',
    description: 'Officiel handel og priser',
    url: 'https://pathofexile.com/trade',
    icon: '💰',
    category: 'Path of Exile 1',
    type: 'trading',
    isDefault: true
  },
  {
    id: 'poe1-3',
    title: 'poe.ninja',
    description: 'Økonomisk analyse og trends',
    url: 'https://poe.ninja',
    icon: '📈',
    category: 'Path of Exile 1',
    type: 'economy',
    isDefault: true
  }
]

// Path of Exile 2 resources
const poe2Resources = [
  {
    id: 'poe2-1',
    title: 'PoE2DB',
    description: 'Database for Path of Exile 2',
    url: 'https://poe2db.tw',
    icon: '🆕',
    category: 'Path of Exile 2',
    type: 'database',
    isDefault: true
  },
  {
    id: 'poe2-2',
    title: 'Maxroll PoE2',
    description: 'Detaljerede guides og builds',
    url: 'https://maxroll.gg/poe2',
    icon: '📚',
    category: 'Path of Exile 2',
    type: 'guide',
    isDefault: true
  },
  {
    id: 'poe2-3',
    title: 'Mobalytics',
    description: 'Build guides og analyser',
    url: 'https://mobalytics.gg/poe-2',
    icon: '📋',
    category: 'Path of Exile 2',
    type: 'guide',
    isDefault: true
  }
]

// Programs and tools
const programResources = [
  {
    id: 'programs-1',
    title: 'Awakened PoE Trade',
    description: 'In-game overlay til hurtig handel og priser for PoE1',
    url: 'https://github.com/SnosMe/awakened-poe-trade',
    icon: '⚡',
    category: 'Programs',
    type: 'overlay',
    isDefault: true
  },
  {
    id: 'programs-2',
    title: 'Exiled Exchange 2',
    description: 'Avanceret trading tool for PoE2',
    url: 'https://github.com/Kvan7/Exiled-Exchange-2',
    icon: '🔄',
    category: 'Programs',
    type: 'trading',
    isDefault: true
  },
  {
    id: 'programs-3',
    title: 'Path of Building',
    description: 'Build planning værktøj',
    url: 'https://pathofbuilding.community',
    icon: '🔧',
    category: 'Programs',
    type: 'tool',
    isDefault: true
  }
]

// Community resources
const communityResources = [
  {
    id: 'community-1',
    title: 'r/PathOfExile',
    description: 'Reddit community og diskussioner',
    url: 'https://reddit.com/r/pathofexile',
    icon: '💬',
    category: 'Community',
    type: 'community',
    isDefault: true
  },
  {
    id: 'community-2',
    title: 'Official Discord',
    description: 'Live chat og support',
    url: 'https://discord.gg/pathofexile',
    icon: '🗨️',
    category: 'Community',
    type: 'community',
    isDefault: true
  },
  {
    id: 'community-3',
    title: 'PoE Wiki',
    description: 'Omfattende reference guide',
    url: 'https://pathofexile.fandom.com',
    icon: '📖',
    category: 'Community',
    type: 'wiki',
    isDefault: true
  },
  {
    id: 'community-4',
    title: 'PoE Builds',
    description: 'Community build-samling og guides',
    url: 'https://www.poebuilds.net',
    icon: '🏗️',
    category: 'Community',
    type: 'builds',
    isDefault: true
  }
]

// Combined default resources
export const defaultResources = [
  ...poe1Resources,
  ...poe2Resources,
  ...programResources,
  ...communityResources
]

// Category order for display
export const categoryOrder = [
  'Path of Exile 1',
  'Path of Exile 2',
  'Programs',
  'Community'
]

// Export individual categories for easier management
export { poe1Resources, poe2Resources, programResources, communityResources }