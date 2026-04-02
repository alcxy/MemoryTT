<template>
  <div class="quiz">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>随机测验</h2>
        <div class="header-spacer"></div>
        <el-tag>答对 {{ correctCount }}/{{ totalQuestions }}</el-tag>
      </el-header>

      <el-main class="page-content">
        <el-empty v-if="!started" description="选择测验配置开始">
          <el-card class="settings-card" style="max-width: 500px; margin: 0 auto;">
            <el-form label-width="100px">
              <el-form-item label="题目数量">
                <el-slider v-model="quizConfig.numQuestions" :min="5" :max="50" :step="5" />
              </el-form-item>
              <el-form-item label="分类">
                <el-select v-model="quizConfig.categoryId" placeholder="全部">
                  <el-option label="全部知识点" value="" />
                  <el-option v-for="cat in knowledgeStore.categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="large" @click="startQuiz" :disabled="availableCount === 0">
                  开始测验
                </el-button>
                <div v-if="availableCount < quizConfig.numQuestions" class="hint">
                  该分类下只有 {{ availableCount }} 个知识点
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-empty>

        <div v-if="started && currentQuestion" class="quiz-card">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>第 {{ currentIndex + 1 }} 题</span>
                <el-progress :percentage="progress" :show-text="false" />
              </div>
            </template>

            <div class="question">
              <h3>{{ currentQuestion.question }}</h3>
            </div>

            <div class="answer-wrapper" v-show="showAnswer">
              <el-divider content-position="left">答案</el-divider>
              <div class="answer" v-html="formatAnswer(currentQuestion.answer)"></div>

              <pre v-if="currentQuestion.code" class="code-block"><code>{{ currentQuestion.code }}</code></pre>

              <el-divider></el-divider>

              <div class="buttons">
                <el-button type="danger" size="large" @click="answer(false)">
                  答错了
                </el-button>
                <el-button type="success" size="large" @click="answer(true)">
                  答对了
                </el-button>
              </div>
            </div>

            <div class="show-answer" v-if="!showAnswer">
              <el-button type="primary" size="large" @click="showAnswer = true">
                查看答案
              </el-button>
            </div>
          </el-card>
        </div>

        <div v-if="finished" class="result">
          <el-card>
            <h2>测验完成！</h2>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总题数">{{ totalQuestions }}</el-descriptions-item>
              <el-descriptions-item label="答对">{{ correctCount }}</el-descriptions-item>
              <el-descriptions-item label="正确率">{{ Math.round((correctCount / totalQuestions) * 100) }}%</el-descriptions-item>
            </el-descriptions>
            <div class="actions">
              <el-button type="primary" @click="resetQuiz">再来一次</el-button>
              <el-button @click="goBack">返回首页</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useKnowledgeStore } from '../store/knowledge'
import { useSettingsStore } from '../store/settings'
import { calculateNextReview } from '../utils/spacedRepetition'
import type { KnowledgeItem } from '../types'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const settingsStore = useSettingsStore()

const started = ref(false)
const finished = ref(false)
const showAnswer = ref(false)
const currentIndex = ref(0)
const correctCount = ref(0)
const quizQuestions = ref<KnowledgeItem[]>([])
const quizConfig = ref({
  numQuestions: 10,
  categoryId: ''
})

const currentQuestion = computed(() => quizQuestions.value[currentIndex.value] || null)
const totalQuestions = computed(() => quizQuestions.value.length)
const progress = computed(() => ((currentIndex.value) / totalQuestions.value) * 100)

const availableCount = computed(() => {
  if (!quizConfig.value.categoryId) {
    return knowledgeStore.allKnowledge.length
  }
  return knowledgeStore.getKnowledgeByCategory(quizConfig.value.categoryId).length
})

const goBack = () => router.push('/')

const startQuiz = () => {
  let pool = [...knowledgeStore.allKnowledge]
  if (quizConfig.value.categoryId) {
    pool = pool.filter(k => k.categoryId === quizConfig.value.categoryId)
  }
  // Fisher-Yates 洗牌
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  quizQuestions.value = pool.slice(0, Math.min(quizConfig.value.numQuestions, pool.length))
  currentIndex.value = 0
  correctCount.value = 0
  started.value = true
  finished.value = false
  showAnswer.value = false
}

const answer = (correct: boolean) => {
  if (correct) {
    correctCount.value++
  }

  // 更新间隔
  const item = currentQuestion.value
  if (item) {
    const { nextReview, newInterval } = calculateNextReview(
      item.difficulty,
      item.interval,
      item.repetitions,
      correct,
      settingsStore.settings.easeFactor
    )
    knowledgeStore.updateKnowledge(item.id, {
      interval: newInterval,
      repetitions: item.repetitions + 1,
      nextReview: nextReview.toISOString()
    })
  }

  currentIndex.value++
  showAnswer.value = false

  if (currentIndex.value >= quizQuestions.value.length) {
    finished.value = true
    started.value = false
  }
}

const resetQuiz = () => {
  started.value = false
  finished.value = false
  quizQuestions.value = []
  currentIndex.value = 0
  correctCount.value = 0
}

const formatAnswer = (answer: string) => {
  return answer.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.quiz {
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
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.settings-card {
  margin-top: 30px;
}

.hint {
  color: #e6a23c;
  font-size: 0.85rem;
  margin-top: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-header .el-progress {
  flex: 1;
}

.question {
  padding: 20px 0;
}

.question h3 {
  margin: 0;
  font-size: 1.4rem;
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

.show-answer {
  text-align: center;
  padding: 20px 0;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.result {
  max-width: 500px;
  margin: 0 auto;
}

.result h2 {
  text-align: center;
  margin-bottom: 20px;
}

.result .actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}
</style>
