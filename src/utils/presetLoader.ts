// 动态导入预置题库数据
import type { KnowledgeItem } from '../types'

const presetMap: Record<string, () => Promise<any>> = {
  'csharp': () => import('../data/languages/csharp.json'),
  'python': () => import('../data/languages/python.json'),
  'javascript': () => import('../data/languages/javascript.json'),
  'typescript': () => import('../data/languages/typescript.json'),
  'aspnetcore': () => import('../data/frameworks/aspnetcore.json'),
  'mysql': () => import('../data/databases/mysql.json'),
  'vue': () => import('../data/frontend/vue.json'),
  'git': () => import('../data/other/git.json'),
}

// 难度转换：字符串 -> 数字 1-5
function convertDifficulty(d: string): number {
  switch (d.toLowerCase()) {
    case 'easy': return 2 // 低难度
    case 'medium': return 3 // 中难度
    case 'hard': return 4 // 高难度
    default:
      if (!isNaN(parseFloat(d))) return parseFloat(d)
      return 3
  }
}

export async function loadPresetKnowledge(categoryId: string): Promise<KnowledgeItem[]> {
  if (categoryId in presetMap) {
    const module = await presetMap[categoryId]()
    const list = module.default as Array<{
      question: string
      answer: string
      code?: string
      difficulty: string
      tags?: any
    }>
    // 转换为我们需要的格式
    return list.map(item => ({
      question: item.question,
      answer: item.answer,
      code: item.code,
      difficulty: convertDifficulty(item.difficulty)
    })) as KnowledgeItem[]
  }
  return []
}
