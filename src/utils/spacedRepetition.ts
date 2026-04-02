import type { KnowledgePoint } from '../types'

// SM-2 间隔重复算法实现
// 评分说明：0=完全忘记，1=错误，2=困难，3=一般，4=良好，5=完美记住

export interface ReviewResult {
  nextReview: string;
  updatedInterval: number;
  updatedEaseFactor: number;
  updatedMemoryStage: number;
}

// 简化版本，供我们的页面使用
export interface SimpleReviewResult {
  nextReview: Date;
  newInterval: number;
}

// 计算下次复习时间（简化版 SM-2）
export function calculateNextReview(
  difficulty: number,
  currentInterval: number,
  repetitions: number,
  remembered: boolean,
  easeFactor: number
): SimpleReviewResult {
  // difficulty: 1-5，越大越难
  let newInterval: number

  if (!remembered) {
    // 忘记了，重置间隔
    newInterval = Math.max(1, Math.round(difficulty / 2))
  } else {
    if (repetitions === 0) {
      newInterval = 1
    } else if (repetitions === 1) {
      newInterval = 3
    } else {
      // 间隔 = 当前间隔 * 容易因子 / 难度系数
      const difficultyFactor = 1 + (difficulty - 3) * 0.2
      newInterval = Math.round(currentInterval * easeFactor / difficultyFactor)
    }
  }

  // 限制最大间隔为 365 天
  newInterval = Math.min(newInterval, 365)

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    nextReview,
    newInterval
  }
}

// 初始化新知识点
export function initKnowledgePoint(categoryId: string, question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard', tags: string[]): Omit<KnowledgePoint, 'id'> {
  return {
    categoryId,
    question,
    answer,
    difficulty,
    tags,
    memoryStage: 0,
    easeFactor: 2.5,
    interval: 1,
    lastReviewed: null,
    nextReview: new Date().toISOString().split('T')[0], // 今天开始
    reviewCount: 0,
  }
}

// 处理复习，更新间隔
export function processReview(knowledgePoint: KnowledgePoint, grade: number): ReviewResult {
  let { easeFactor, interval } = knowledgePoint

  // 更新容易因子
  // SM-2 公式: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))

  // 容易因子不能小于1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3
  }

  // 如果评分低于3，重置间隔
  if (grade < 3) {
    interval = 1
  } else {
    if (knowledgePoint.reviewCount === 0) {
      interval = 1
    } else if (knowledgePoint.reviewCount === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
  }

  // 计算下次复习日期
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)
  const nextReview = nextDate.toISOString().split('T')[0]

  // 更新记忆阶段
  let memoryStage = knowledgePoint.memoryStage
  if (grade >= 4) {
    memoryStage = Math.min(5, memoryStage + 1)
  } else if (grade < 2) {
    memoryStage = Math.max(0, memoryStage - 1)
  }

  return {
    nextReview,
    updatedInterval: interval,
    updatedEaseFactor: easeFactor,
    updatedMemoryStage: memoryStage,
  }
}

// 获取今天需要复习的知识点
export function getDueToday(points: KnowledgePoint[]): KnowledgePoint[] {
  const today = new Date().toISOString().split('T')[0]
  return points.filter(p => p.nextReview && p.nextReview <= today)
}

// 获取未学习的新知识点
export function getNewCards(points: KnowledgePoint[], limit: number): KnowledgePoint[] {
  return points
    .filter(p => p.reviewCount === 0)
    .slice(0, limit)
}

// 判断是否今天需要复习
export function isDueToday(point: KnowledgePoint): boolean {
  const today = new Date().toISOString().split('T')[0]
  return !!point.nextReview && point.nextReview <= today
}

// 根据自评转换为grade
export function selfGradeToNumber(selfAssessment: 'again' | 'good' | 'easy'): number {
  switch (selfAssessment) {
    case 'again': return 1
    case 'good': return 3
    case 'easy': return 5
    default: return 3
  }
}
