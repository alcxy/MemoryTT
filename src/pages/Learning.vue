<template>
  <div class="learning">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回分类
        </el-button>
        <h2>{{ currentCategory?.name }}</h2>
        <div class="header-spacer"></div>
        <el-button type="success" @click="startNewRound">
          <el-icon><Plus /></el-icon>
          学习新知识点
        </el-button>
      </el-header>

      <el-main class="page-content">
        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>知识点列表</span>
                  <el-input
                    v-model="filterText"
                    placeholder="搜索..."
                    :prefix-icon="Search"
                    size="small"
                    clearable
                  />
                </div>
              </template>
              <el-list
                v-model:selected="selectedKnowledgeId"
                :data="filteredKnowledge"
                :render-label="renderKnowledgeItem"
              />
            </el-card>
          </el-col>

          <el-col :xs="24" :md="16">
            <el-card v-if="selectedKnowledge" class="knowledge-card">
              <template #header>
                <div class="card-header">
                  <span>{{ selectedKnowledge.question }}</span>
                  <el-tag :type="getDifficultyType(selectedKnowledge.difficulty)">
                    {{ getDifficultyText(selectedKnowledge.difficulty) }}
                  </el-tag>
                </div>
              </template>

              <div class="knowledge-info">
                <p><strong>下次复习：</strong>{{ formatNextReview(selectedKnowledge.nextReview) }}</p>
                <p><strong>掌握程度：</strong>{{ selectedKnowledge.difficulty }}/{{ selectedKnowledge.interval }}</p>
                <p><strong>记忆阶段：</strong>第 {{ selectedKnowledge.repetitions }} 次重复</p>
              </div>

              <el-divider v-if="selectedKnowledge.answer" content-position="left">答案</el-divider>
              <div v-if="selectedKnowledge.answer" class="answer" v-html="formatAnswer(selectedKnowledge.answer)"></div>

              <el-divider v-if="selectedKnowledge.code" content-position="left">代码示例</el-divider>
              <el-divider v-if="selectedKnowledge.imageUrl" content-position="left">示意图</el-divider>
              <div v-if="selectedKnowledge.imageUrl" class="image-container">
                <img :src="selectedKnowledge.imageUrl" alt="示意图" />
              </div>

              <pre v-if="selectedKnowledge.code" class="code-block"><code>{{ selectedKnowledge.code }}</code></pre>

              <el-divider></el-divider>

              <div class="actions">
                <el-button type="success" @click="markLearned(selectedKnowledge!.id)">
                  <el-icon><Check /></el-icon>
                  已记住
                </el-button>
                <el-button type="warning" @click="markForgot(selectedKnowledge!.id)">
                  <el-icon><Close /></el-icon>
                  没记住
                </el-button>
                <el-button type="primary" @click="editKnowledge(selectedKnowledge!.id)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="danger" @click="confirmDelete(selectedKnowledge!.id)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>

              <div class="ai-analysis" v-if="settingsStore.settings.aiApiKey">
                <el-divider content-position="left">AI 增强</el-divider>
                <el-button type="primary" plain @click="goToAIAnalysis(selectedKnowledge!.id)">
                  <el-icon><MagicStick /></el-icon>
                  AI 分析解释
                </el-button>
              </div>
            </el-card>

            <el-empty v-else description="选择一个知识点查看详情" />
          </el-col>
        </el-row>

        <!-- 添加新知识弹窗 -->
        <el-dialog v-model="addDialogVisible" title="添加新知识" width="600px">
          <el-form :model="newKnowledge" label-width="80px">
            <el-form-item label="问题">
              <el-input v-model="newKnowledge.question" placeholder="请输入问题" />
            </el-form-item>
            <el-form-item label="答案">
              <el-input v-model="newKnowledge.answer" type="textarea" :rows="4" placeholder="请输入答案" />
            </el-form-item>
            <el-form-item label="代码">
              <el-input v-model="newKnowledge.code" type="textarea" :rows="6" placeholder="可选，输入代码示例" />
            </el-form-item>
            <el-form-item label="难度">
              <el-rate v-model="newKnowledge.difficulty" :max="5" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveNewKnowledge">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { ArrowLeft, Plus, Search, Check, Close, Edit, Delete, MagicStick } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useKnowledgeStore } from '../store/knowledge'
import { calculateNextReview } from '../utils/spacedRepetition'
import type { KnowledgeItem } from '../types'
import { useSettingsStore } from '../store/settings'

const router = useRouter()
const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const settingsStore = useSettingsStore()

const categoryId = route.params.categoryId as string
const currentCategory = computed(() => knowledgeStore.categories.find(c => c.id === categoryId))
const knowledgeList = computed(() => knowledgeStore.getKnowledgeByCategory(categoryId))

const filterText = ref('')
const selectedKnowledgeId = ref<string | null>(null)
const addDialogVisible = ref(false)
const newKnowledge = ref<Partial<KnowledgeItem>>({
  question: '',
  answer: '',
  code: '',
  difficulty: 1
})

const filteredKnowledge = computed(() => {
  if (!filterText.value) return knowledgeList.value
  const text = filterText.value.toLowerCase()
  return knowledgeList.value.filter(
    k => k.question.toLowerCase().includes(text) ||
         (k.answer && k.answer.toLowerCase().includes(text))
  )
})

const selectedKnowledge = computed(() => {
  if (!selectedKnowledgeId.value) return null
  return knowledgeStore.allKnowledge.find(k => k.id === selectedKnowledgeId.value)
})

const goBack = () => router.push('/categories')

const startNewRound = () => {
  addDialogVisible.value = true
}

const getDifficultyType = (difficulty: number) => {
  if (difficulty <= 2) return 'success'
  if (difficulty <= 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty: number) => {
  return ['', '极简单', '简单', '中等', '难', '极难'][difficulty] || ''
}

const formatAnswer = (answer: string) => {
  return answer.replace(/\n/g, '<br>')
}

const formatNextReview = (dateStr: string) => {
  if (!dateStr) return '随时'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const renderKnowledgeItem = (item: KnowledgeItem) => {
  const now = new Date()
  const next = new Date(item.nextReview)
  const isDue = next <= now
  return `${isDue ? '🔴 ' : ''}${item.question}`
}

const markLearned = (id: string) => {
  const item = knowledgeStore.allKnowledge.find(k => k.id === id)
  if (!item) return
  const { nextReview, newInterval } = calculateNextReview(
    item.difficulty,
    item.interval,
    item.repetitions,
    true,
    settingsStore.settings.easeFactor
  )
  knowledgeStore.updateKnowledge(id, {
    interval: newInterval,
    repetitions: item.repetitions + 1,
    nextReview: nextReview.toISOString()
  })
  ElMessage.success('已标记为记住，下次复习安排在 ' + nextReview.toLocaleDateString('zh-CN'))
  if (selectedKnowledgeId.value === id) {
    selectedKnowledgeId.value = null
  }
}

const markForgot = (id: string) => {
  const item = knowledgeStore.allKnowledge.find(k => k.id === id)
  if (!item) return
  const { nextReview, newInterval } = calculateNextReview(
    item.difficulty,
    item.interval,
    item.repetitions,
    false,
    settingsStore.settings.easeFactor
  )
  knowledgeStore.updateKnowledge(id, {
    interval: newInterval,
    repetitions: item.repetitions + 1,
    nextReview: nextReview.toISOString()
  })
  ElMessage.warning('已标记为忘记，将提前安排复习')
  if (selectedKnowledgeId.value === id) {
    selectedKnowledgeId.value = null
  }
}

const editKnowledge = (_id: string) => {
  ElMessage.info('编辑功能待实现')
}

const confirmDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个知识点吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    knowledgeStore.deleteKnowledge(id)
    ElMessage.success('删除成功')
    selectedKnowledgeId.value = null
  } catch {
    // 用户取消
  }
}

const saveNewKnowledge = () => {
  if (!newKnowledge.value.question || !newKnowledge.value.answer) {
    ElMessage.warning('问题和答案不能为空')
    return
  }
  knowledgeStore.addKnowledge({
    ...newKnowledge,
    id: Date.now().toString(),
    categoryId,
    created: new Date().toISOString(),
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString()
  } as unknown as KnowledgeItem)
  ElMessage.success('添加成功')
  addDialogVisible.value = false
  newKnowledge.value = {
    question: '',
    answer: '',
    code: '',
    difficulty: 1
  }
}

const goToAIAnalysis = (id: string) => {
  router.push(`/ai-analysis/${id}`)
}
</script>

<style scoped>
.learning {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.knowledge-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.knowledge-info p {
  margin: 0;
  font-size: 0.9rem;
}

.answer {
  line-height: 1.8;
  color: #606266;
}

.image-container img {
  max-width: 100%;
  border-radius: 4px;
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ai-analysis {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .knowledge-info {
    grid-template-columns: 1fr;
  }
}
</style>
