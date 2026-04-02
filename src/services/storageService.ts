import type { KnowledgeItem } from '../types'

const STORAGE_KEYS = {
  knowledge: 'dev_memory_knowledge',
  knowledgePoints: 'dev_memory_knowledge', // 兼容旧版
  programSubmissions: 'dev_memory_submissions',
  settings: 'dev_memory_settings',
  activities: 'dev_memory_activities'
}

// 知识点存储
export function saveKnowledge(points: KnowledgeItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.knowledge, JSON.stringify(points))
  } catch (e) {
    console.error('Failed to save knowledge:', e)
  }
}

export function loadKnowledge(): KnowledgeItem[] {
  try {
    // 先尝试新版
    const stored = localStorage.getItem(STORAGE_KEYS.knowledge)
    if (stored) {
      return JSON.parse(stored)
    }
    // 尝试旧版迁移
    const oldStored = localStorage.getItem(STORAGE_KEYS.knowledgePoints)
    if (oldStored) {
      return JSON.parse(oldStored)
    }
  } catch (e) {
    console.error('Failed to load knowledge:', e)
  }
  return []
}

// 兼容旧接口
export {
  saveKnowledge as saveKnowledgePoints,
  loadKnowledge as loadKnowledgePoints
}

// 导出/导入全部数据
export interface BackupData {
  knowledge: KnowledgeItem[]
  settings?: any
  activities?: any
}

export function exportAllData(): BackupData {
  return {
    knowledge: loadKnowledge(),
    settings: localStorage.getItem(STORAGE_KEYS.settings) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)!) : undefined,
    activities: localStorage.getItem(STORAGE_KEYS.activities) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.activities)!) : undefined
  }
}

export function importAllData(data: BackupData): void {
  if (Array.isArray(data.knowledge)) {
    saveKnowledge(data.knowledge)
  }
  if (data.settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(data.settings))
  }
  if (data.activities) {
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(data.activities))
  }
}

// 程序题提交存储
export function saveSubmission(submission: any): void {
  const submissions = loadSubmissions()
  submissions.push(submission)
  try {
    localStorage.setItem(STORAGE_KEYS.programSubmissions, JSON.stringify(submissions))
  } catch (e) {
    console.error('Failed to save submission:', e)
  }
}

export function loadSubmissions(): any[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.programSubmissions)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load submissions:', e)
  }
  return []
}
