<template>
  <div class="review">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>今日复习</h2>
        <div class="header-spacer"></div>
        <el-tag type="success" v-if="remaining > 0">还剩 {{ remaining }} 个</el-tag>
      </el-header>

      <el-main class="page-content">
        <el-empty v-if="dueItems.length === 0" description="🎉 今天没有需要复习的知识点，休息一下吧！">
          <el-button type="primary" @click="goToCategories">去学习新知识</el-button>
        </el-empty>

        <div v-if="currentItem" class="review-card-wrapper">
          <el-card class="review-card">
            <template #header>
              <div class="card-header">
                <el-tag>{{ currentCategory?.name || '未知分类' }}</el-tag>
                <el-tag :type="getDifficultyType(currentItem.difficulty)">{{ currentItem.difficulty }} 难度</el-tag>
                <span class="progress">第 {{ currentIndex + 1 }}/{{ total }}</span>
              </div>
            </template>

            <div class="question">
              <h3>{{ currentItem.question }}</h3>
            </div>

            <div class="answer-wrapper" v-show="showAnswer">
              <el-divider content-position="left">答案</el-divider>
              <div class="answer" v-html="formatAnswer(currentItem.answer)"></div>

              <div v-if="currentItem.code" class="code-block-wrapper">
                <el-divider content-position="left">代码示例</el-divider>
                <pre class="code-block"><code>{{ currentItem.code }}</code></pre>
              </div>

              <div v-if="currentItem.imageUrl" class="image-wrapper">
                <el-divider content-position="left">示意图</el-divider>
                <img :src="currentItem.imageUrl" alt="示意图" class="review-image" />
              </div>

              <el-divider></el-divider>

              <div class="eval-buttons">
                <p>你记住了吗？请自我评价：</p>
                <div class="buttons">
                  <el-button type="danger" size="large" @click="evaluate(false)">
                    <el-icon><Close /></el-icon>
                    完全忘记
                  </el-button>
                  <el-button type="warning" size="large" @click="evaluate(false)">
                    <el-icon><HelpFilled /></el-icon>
                    记得模糊
                  </el-button>
                  <el-button type="success" size="large" @click="evaluate(true)">
                    <el-icon><Check /></el-icon>
                    完全记住
                  </el-button>
                </div>
              </div>
            </div>

            <div class="show-answer" v-if="!showAnswer">
              <el-button type="primary" size="large" @click="showAnswer = true">
                查看答案
              </el-button>
            </div>
          </el-card>

          <div class="ai-quick" v-if="settingsStore.settings.aiApiKey">
            <el-button type="primary" plain @click="goToAIAnalysis(currentItem.id)">
              <el-icon><MagicStick /></el-icon>
              AI 详细解释
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Close, Check, HelpFilled, MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useKnowledgeStore } from '../store/knowledge'
import { useSettingsStore } from '../store/settings'
import { calculateNextReview } from '../utils/spacedRepetition'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const settingsStore = useSettingsStore()

const dueItems = computed(() => knowledgeStore.dueForReview)
const total = computed(() => dueItems.value.length)
const remaining = computed(() => dueItems.value.length - currentIndex.value)

const currentIndex = ref(0)
const showAnswer = ref(false)

const currentItem = computed(() => dueItems.value[currentIndex.value] || null)
const currentCategory = computed(() => {
  if (!currentItem.value) return null
  return knowledgeStore.categories.find(c => c.id === currentItem.value!.categoryId)
})

const goBack = () => router.push('/')
const goToCategories = () => router.push('/categories')

const getDifficultyType = (difficulty: number) => {
  if (difficulty <= 2) return 'success'
  if (difficulty <= 3) return 'warning'
  return 'danger'
}

const formatAnswer = (answer: string) => {
  return answer.replace(/\n/g, '<br>')
}

const evaluate = (remembered: boolean) => {
  const item = currentItem.value
  if (!item) return

  const { nextReview, newInterval } = calculateNextReview(
    item.difficulty,
    item.interval,
    item.repetitions,
    remembered,
    settingsStore.settings.easeFactor
  )

  knowledgeStore.updateKnowledge(item.id, {
    interval: newInterval,
    repetitions: item.repetitions + 1,
    nextReview: nextReview.toISOString()
  })

  currentIndex.value++
  showAnswer.value = false

  if (currentIndex.value >= dueItems.value.length) {
    ElMessage.success('🎉 今天的复习完成了！')
  }
}

const goToAIAnalysis = (id: string) => {
  router.push(`/ai-analysis/${id}`)
}
</script>

<style scoped>
.review {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: auto !important;
  padding: 12px 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.header-spacer {
  flex: 1;
}

.page-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.review-card-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.card-header .progress {
  margin-left: auto;
  color: #909399;
  font-size: 0.9rem;
}

.question {
  padding: 20px 0;
}

.question h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #303133;
  line-height: 1.6;
}

.answer {
  line-height: 1.8;
  color: #606266;
  font-size: 1.05rem;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.review-image {
  max-width: 100%;
  border-radius: 4px;
}

.eval-buttons p {
  text-align: center;
  margin-bottom: 15px;
  color: #606266;
}

.eval-buttons .buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.show-answer {
  text-align: center;
  padding: 20px 0;
}

.ai-quick {
  text-align: right;
  margin-top: 15px;
}
</style>
