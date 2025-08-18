import { ref, reactive, computed } from 'vue'

export function useValidation() {
  const errors = ref({})
  
  // Validation rules
  const rules = {
    required: (value, fieldName) => {
      if (!value || value.toString().trim() === '') {
        return `${fieldName} er påkrævet`
      }
      return null
    },
    
    minLength: (min) => (value, fieldName) => {
      if (value && value.length < min) {
        return `${fieldName} skal være mindst ${min} tegn`
      }
      return null
    },
    
    maxLength: (max) => (value, fieldName) => {
      if (value && value.length > max) {
        return `${fieldName} må højst være ${max} tegn`
      }
      return null
    },
    
    url: (value, fieldName) => {
      if (!value) return null
      
      try {
        const url = new URL(value)
        if (!['http:', 'https:'].includes(url.protocol)) {
          return `${fieldName} skal være en gyldig URL (http eller https)`
        }
        return null
      } catch {
        return `${fieldName} skal være en gyldig URL`
      }
    },
    
    pobUrl: (value, fieldName) => {
      if (!value) return null
      
      // Check if it's a valid URL first
      const urlError = rules.url(value, fieldName)
      if (urlError) return urlError
      
      // Check if it looks like a PoB link
      const pobPatterns = [
        /pobb\.in/i,
        /pastebin\.com/i,
        /pathofbuilding/i,
        /poe\.re/i
      ]
      
      if (!pobPatterns.some(pattern => pattern.test(value))) {
        return `${fieldName} skal være et gyldigt Path of Building link (pobb.in, pastebin.com, etc.)`
      }
      
      return null
    },
    
    email: (value, fieldName) => {
      if (!value) return null
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return `${fieldName} skal være en gyldig e-mail adresse`
      }
      return null
    },
    
    characterName: (value, fieldName) => {
      if (!value) return null
      
      // PoE character names: 1-24 characters, alphanumeric and underscore only
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return `${fieldName} må kun indeholde bogstaver, tal og underscore`
      }
      
      if (value.length > 24) {
        return `${fieldName} må højst være 24 tegn`
      }
      
      return null
    },
    
    league: (value, fieldName) => {
      if (!value) return null
      
      // League names shouldn't be too long and should be reasonable
      if (value.length > 50) {
        return `${fieldName} navn er for langt`
      }
      
      return null
    }
  }
  
  // Validate a single field
  const validateField = (fieldName, value, fieldRules, displayName) => {
    const fieldErrors = []
    
    for (const rule of fieldRules) {
      let validator, errorMessage
      
      if (typeof rule === 'string') {
        // Simple rule like 'required'
        validator = rules[rule]
        errorMessage = validator ? validator(value, displayName || fieldName) : null
      } else if (typeof rule === 'function') {
        // Custom rule function
        errorMessage = rule(value, displayName || fieldName)
      } else if (rule.rule && typeof rule.rule === 'function') {
        // Rule with custom parameters like { rule: rules.minLength(3), message: 'Custom message' }
        errorMessage = rule.rule(value, displayName || fieldName)
        if (errorMessage && rule.message) {
          errorMessage = rule.message
        }
      } else if (typeof rule === 'object' && rule.type) {
        // Rule object like { type: 'minLength', value: 3 }
        const ruleFunc = rules[rule.type]
        
        if (ruleFunc && typeof ruleFunc === 'function') {
          if (rule.value !== undefined) {
            // For parameterized rules like minLength(3)
            errorMessage = ruleFunc(rule.value)(value, displayName || fieldName)
          } else {
            // For simple rules
            errorMessage = ruleFunc(value, displayName || fieldName)
          }
        }
      }
      
      if (errorMessage) {
        fieldErrors.push(errorMessage)
      }
    }
    
    return fieldErrors
  }
  
  // Validate all fields in a form
  const validate = (formData, validationRules) => {
    const newErrors = {}
    let isValid = true
    
    for (const [fieldName, fieldRules] of Object.entries(validationRules)) {
      const fieldValue = formData[fieldName]
      const displayName = fieldRules.displayName || fieldName
      const rulesList = fieldRules.rules || fieldRules
      
      const fieldErrors = validateField(fieldName, fieldValue, rulesList, displayName)
      
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors[0] // Show only first error
        isValid = false
      }
    }
    
    errors.value = newErrors
    return isValid
  }
  
  // Clear errors for a specific field
  const clearFieldError = (fieldName) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
      errors.value = { ...errors.value }
    }
  }
  
  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }
  
  // Check if a field has errors
  const hasError = (fieldName) => {
    return !!errors.value[fieldName]
  }
  
  // Get error message for a field
  const getError = (fieldName) => {
    return errors.value[fieldName] || ''
  }
  
  // Check if form is valid
  const isFormValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })
  
  return {
    errors,
    rules,
    validate,
    validateField,
    clearFieldError,
    clearErrors,
    hasError,
    getError,
    isFormValid
  }
}

// Common validation rule sets for reuse
export const buildValidationRules = {
  buildName: {
    displayName: 'Build navn',
    rules: ['required', { type: 'minLength', value: 2 }, { type: 'maxLength', value: 100 }]
  },
  gameVersion: {
    displayName: 'Spil',
    rules: ['required']
  },
  characterName: {
    displayName: 'Character navn',
    rules: ['characterName']
  },
  league: {
    displayName: 'League',
    rules: ['league']
  },
  buildStatus: {
    displayName: 'Status',
    rules: ['required']
  },
  pobLink: {
    displayName: 'Path of Building link',
    rules: ['pobUrl']
  },
  guideLink: {
    displayName: 'Guide link',
    rules: ['url']
  },
  notes: {
    displayName: 'Noter',
    rules: [{ type: 'maxLength', value: 1000 }]
  }
}

export const resourceValidationRules = {
  title: {
    displayName: 'Titel',
    rules: ['required', { type: 'minLength', value: 2 }, { type: 'maxLength', value: 100 }]
  },
  description: {
    displayName: 'Beskrivelse',
    rules: ['required', { type: 'minLength', value: 5 }, { type: 'maxLength', value: 200 }]
  },
  url: {
    displayName: 'URL',
    rules: ['required', 'url']
  },
  category: {
    displayName: 'Kategori',
    rules: ['required']
  },
  icon: {
    displayName: 'Ikon',
    rules: [{ type: 'maxLength', value: 4 }]
  }
}