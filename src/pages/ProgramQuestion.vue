<template>
  <div class="program-question">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>编程练习</h2>
        <div class="header-spacer"></div>
        <el-tag v-if="currentQuestion">
          {{ currentIndex + 1 }}/{{ total }}
        </el-tag>
      </el-header>

      <el-main class="page-content">
        <el-empty v-if="programQuestions.length === 0" description="暂无编程题目">
          <el-button type="primary" @click="goBack">返回首页</el-button>
        </el-empty>

        <div v-if="currentQuestion" class="question-card">
          <el-card>
            <template #header>
              <div class="card-header">
                <h3>{{ currentQuestion.title }}</h3>
                <el-tag :type="getDifficultyType(currentQuestion.difficulty)">
                  {{ getDifficultyText(currentQuestion.difficulty) }}
                </el-tag>
              </div>
            </template>

            <div class="description" v-html="formatDescription(currentQuestion.description)"></div>

            <el-divider v-if="currentQuestion.examples && currentQuestion.examples.length > 0" content-position="left">示例</el-divider>
            <div v-if="currentQuestion.examples" class="examples">
              <el-card v-for="(example, idx) in currentQuestion.examples" :key="idx" class="example-card">
                <template #header>示例 {{ idx + 1 }}</template>
                <div><strong>输入：</strong></div>
                <pre>{{ example.input }}</pre>
                <div><strong>输出：</strong></div>
                <pre>{{ example.output }}</pre>
                <div v-if="example.explanation" class="explanation">
                  <strong>解释：</strong>{{ example.explanation }}
                </div>
              </el-card>
            </div>

            <el-divider content-position="left">你的思路</el-divider>
            <div class="answer-section">
              <el-textarea v-model="userAnswer" placeholder="写下你的解答思路...按Ctrl+Enter提交" :rows="12" />

              <div class="actions">
                <el-button type="primary" @click="nextQuestion">
                  下一题
                </el-button>
                <el-button type="success" @click="showAnswer = !showAnswer">
                  {{ showAnswer ? '隐藏答案' : '查看参考解答' }}
                </el-button>
              </div>

              <div v-if="showAnswer && currentQuestion.solution" class="solution">
                <el-divider content-position="left">参考解答</el-divider>
                <pre class="code-block"><code>{{ currentQuestion.solution }}</code></pre>
              </div>
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
import type { ProgramQuestionItem } from '../types'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const programQuestions = ref<ProgramQuestionItem[]>(knowledgeStore.getAllProgramQuestions())
const currentIndex = ref(0)
const showAnswer = ref(false)
const userAnswer = ref('')

const currentQuestion = computed(() => programQuestions.value[currentIndex.value] || null)
const total = computed(() => programQuestions.value.length)

const goBack = () => router.push('/')

const nextQuestion = () => {
  currentIndex.value = (currentIndex.value + 1) % programQuestions.value.length
  showAnswer.value = false
  userAnswer.value = ''
}

const getDifficultyType = (difficulty: number) => {
  if (difficulty <= 2) return 'success'
  if (difficulty <= 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty: number) => {
  return ['', '简单', '简单', '中等', '困难', '很难'][difficulty] || ''
}

const formatDescription = (desc: string) => {
  return desc.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.program-question {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.description {
  line-height: 1.8;
  font-size: 1rem;
  color: #303133;
  margin-bottom: 20px;
}

.example-card {
  margin-bottom: 15px;
}

.example-card pre {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0 15px 0;
}

.explanation {
  color: #606266;
}

.answer-section {
  margin-top: 15px;
}

.answer-section textarea {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  line-height: 1.5;
}
</style>
