import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KnowledgeItem, Category, ActivityItem } from '../types'
import { loadKnowledge, saveKnowledge } from '../services/storageService'
import categoriesData from '../data/categories.json'

const STORAGE_KEY_ACTIVITY = 'dev_memory_activities'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const allKnowledge = ref<KnowledgeItem[]>(loadKnowledge())
  const categories = ref<Category[]>(categoriesData as Category[])
  const activities = ref<ActivityItem[]>(loadActivities())

  // 计算总数
  const totalLearned = computed(() => {
    return allKnowledge.value.filter(k => k.repetitions > 0).length
  })

  const masteryPercent = computed(() => {
    if (allKnowledge.value.length === 0) return 0
    const mastered = allKnowledge.value.filter(k => k.interval > 30).length
    return Math.round((mastered / allKnowledge.value.length) * 100)
  })

  // 待复习
  const dueForReview = computed(() => {
    const now = new Date()
    return allKnowledge.value.filter(k => {
      if (!k.nextReview) return true
      return new Date(k.nextReview) <= now
    })
  })

  // 根据分类获取知识点
  function getKnowledgeByCategory(categoryId: string): KnowledgeItem[] {
    return allKnowledge.value.filter(k => k.categoryId === categoryId)
  }

  // 添加知识点
  function addKnowledge(item: KnowledgeItem): void {
    allKnowledge.value.push(item)
    saveKnowledge(allKnowledge.value)
    recordActivity(item.id, item.question, false)
  }

  // 更新知识点
  function updateKnowledge(id: string, updates: Partial<KnowledgeItem>): void {
    const idx = allKnowledge.value.findIndex(k => k.id === id)
    if (idx >= 0) {
      const remembered = updates.nextReview !== undefined && updates.nextReview > new Date().toISOString()
      allKnowledge.value[idx] = { ...allKnowledge.value[idx], ...updates }
      saveKnowledge(allKnowledge.value)
      recordActivity(id, allKnowledge.value[idx].question, remembered)
    }
  }

  // 删除知识点
  function deleteKnowledge(id: string): void {
    allKnowledge.value = allKnowledge.value.filter(k => k.id !== id)
    saveKnowledge(allKnowledge.value)
  }

  // 连续学习天数
  const consecutiveDays = computed(() => {
    let days = 0
    const today = new Date()
    for (let i = 0; i < 1000; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const count = getActivityCountByDate(dateStr)
      if (count > 0) {
        days++
      } else if (i > 0) {
        break
      }
    }
    return days
  })

  const totalStudyDays = computed(() => {
    const days = new Set<string>()
    activities.value.forEach(a => {
      const day = a.date.split('T')[0]
      days.add(day)
    })
    return days.size
  })

  function getActivityCountByDate(dateStr: string): number {
    return activities.value.filter(a => a.date.startsWith(dateStr)).length
  }

  function recordActivity(id: string, question: string, correct: boolean): void {
    activities.value.unshift({
      id,
      question,
      result: correct ? 'correct' : 'wrong',
      date: new Date().toISOString()
    })
    // 只保留最近 1000 条
    if (activities.value.length > 1000) {
      activities.value = activities.value.slice(0, 1000)
    }
    saveActivities()
  }

  function loadActivities(): ActivityItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVITY)
      if (stored) return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to load activities', e)
    }
    return []
  }

  function saveActivities(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(activities.value))
    } catch (e) {
      console.error('Failed to save activities', e)
    }
  }

  const recentActivities = computed(() => activities.value)

  // 获取所有编程题
  function getAllProgramQuestions(): any[] {
    // TODO: 从数据文件加载
    return []
  }

  // 清空所有进度
  function clearAllProgress(): void {
    allKnowledge.value = allKnowledge.value.map(k => ({
      ...k,
      interval: 0,
      repetitions: 0,
      nextReview: new Date().toISOString()
    }))
    saveKnowledge(allKnowledge.value)
  }

  // 从存储加载
  function loadFromStorage(): void {
    allKnowledge.value = loadKnowledge()
  }

  return {
    allKnowledge,
    categories,
    dueForReview,
    totalLearned,
    masteryPercent,
    consecutiveDays,
    totalStudyDays,
    getKnowledgeByCategory,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    getActivityCountByDate,
    recentActivities,
    getAllProgramQuestions,
    clearAllProgress,
    loadFromStorage
  }
})
