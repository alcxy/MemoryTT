import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppSettings } from '../types'

const STORAGE_KEY = 'dev_memory_settings'

const defaultSettings: AppSettings = {
  easeFactor: 2.0,
  initialInterval: 1,
  aiApiKey: '',
  aiBaseUrl: 'https://api.anthropic.com',
  aiModel: 'claude-3-sonnet-20240229'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>(loadSettings())

  function loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) }
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
    return { ...defaultSettings }
  }

  function saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  function updateSettings(newSettings: Partial<AppSettings>): void {
    settings.value = { ...settings.value, ...newSettings }
  }

  return {
    settings,
    saveSettings,
    updateSettings
  }
})

// 为了兼容 Review 页面的导入
export { useSettingsStore as useReviewStore }
