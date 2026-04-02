import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KnowledgePoint } from '../types'
import { processReview, selfGradeToNumber } from '../utils/spacedRepetition'
import { useKnowledgeStore } from './knowledge'
import { saveKnowledgePoints } from '../services/storageService'

export const useReviewStore = defineStore('review', () => {
  const currentIndex = ref(0)
  const currentCard = ref<KnowledgePoint | null>(null)
  const showAnswer = ref(false)
  const reviewQueue = ref<KnowledgePoint[]>([])
  const completedCount = ref(0)

  // 兼容新接口，供首页显示计数
  const dueReviewCount = computed(() => {
    const knowledgeStore = useKnowledgeStore()
    return knowledgeStore.dueForReview.length
  })

  // 初始化复习队列
  function startReview(points: KnowledgePoint[]) {
    reviewQueue.value = [...points]
    currentIndex.value = 0
    completedCount.value = 0
    showAnswer.value = false
    currentCard.value = reviewQueue.value.length > 0 ? reviewQueue.value[0] : null
  }

  // 显示答案
  function revealAnswer() {
    showAnswer.value = true
  }

  // 用户自评，处理当前卡片，移动到下一张
  function rateCard(selfAssessment: 'again' | 'good' | 'easy') {
    if (!currentCard.value) return

    const knowledgeStore = useKnowledgeStore()
    const grade = selfGradeToNumber(selfAssessment)
    const result = processReview(currentCard.value, grade)

    // 更新卡片
    currentCard.value.interval = result.updatedInterval
    // @ts-ignore
    currentCard.value.easeFactor = result.updatedEaseFactor
    // @ts-ignore
    currentCard.value.memoryStage = result.updatedMemoryStage
    currentCard.value.nextReview = result.nextReview
    // @ts-ignore
    currentCard.value.lastReviewed = new Date().toISOString().split('T')[0]
    // @ts-ignore
    currentCard.value.reviewCount++

    // 保存到store和存储
    // @ts-ignore
    knowledgeStore.updateKnowledgePoint(currentCard.value)
    // @ts-ignore
    saveKnowledgePoints(knowledgeStore.knowledgePoints)

    completedCount.value++
    nextCard()
  }

  // 下一张卡片
  function nextCard() {
    currentIndex.value++
    showAnswer.value = false
    if (currentIndex.value < reviewQueue.value.length) {
      currentCard.value = reviewQueue.value[currentIndex.value]
    } else {
      currentCard.value = null
    }
  }

  // 是否复习完成
  const isFinished = computed(() => {
    return currentIndex.value >= reviewQueue.value.length
  })

  const progress = computed(() => {
    if (reviewQueue.value.length === 0) return 0
    return Math.round((completedCount.value / reviewQueue.value.length) * 100)
  })

  return {
    currentIndex,
    currentCard,
    showAnswer,
    reviewQueue,
    completedCount,
    isFinished,
    progress,
    dueReviewCount,
    startReview,
    revealAnswer,
    rateCard,
    nextCard,
  }
})
