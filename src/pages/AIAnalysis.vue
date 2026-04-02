<template>
  <div class="ai-analysis">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2>AI 智能分析</h2>
      </el-header>

      <el-main class="page-content">
        <el-alert
          v-if="!settingsStore.settings.aiApiKey"
          title="未配置 AI API"
          description="请先在设置页面配置 Anthropic API Key 才能使用 AI 分析功能"
          type="warning"
          show-icon
          class="alert"
        >
          <template #footer>
            <el-button size="small" type="warning" @click="goToSettings">去配置</el-button>
          </template>
        </el-alert>

        <div v-if="knowledgeItem" class="question-info">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>知识点</span>
              </div>
            </template>
            <p><strong>问题：</strong>{{ knowledgeItem.question }}</p>
            <p><strong>现有答案：</strong></p>
            <pre class="existing-answer">{{ knowledgeItem.answer }}</pre>
          </el-card>
        </div>

        <div class="analysis-options">
          <el-card>
            <template #header>
              <span>选择分析类型</span>
            </template>
            <el-checkbox-group v-model="selectedOptions" direction="vertical">
              <el-checkbox label="explain">更详细的解释</el-checkbox>
              <el-checkbox label="example">更多实际例子</el-checkbox>
              <el-checkbox label="common-mistakes">常见错误和误区</el-checkbox>
              <el-checkbox label="related">相关知识点链接</el-checkbox>
              <el-checkbox label="memory-tips">记忆技巧</el-checkbox>
            </el-checkbox-group>
            <div class="generate-button">
              <el-button
                type="primary"
                size="large"
                @click="generateAnalysis"
                :loading="loading"
                :disabled="!settingsStore.settings.aiApiKey"
              >
                <el-icon><MagicStick /></el-icon>
                生成 AI 分析
              </el-button>
            </div>
          </el-card>
        </div>

        <div v-if="analysisResult" class="result">
          <el-card>
            <template #header>
              <span>AI 分析结果</span>
            </template>
            <div class="markdown-content" v-html="formattedResult"></div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useKnowledgeStore } from '../store/knowledge'
import { useSettingsStore } from '../store/settings'
import { analyzeWithAI } from '../services/aiService'

const router = useRouter()
const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const settingsStore = useSettingsStore()

const knowledgeId = route.params.id as string
const knowledgeItem = computed(() => knowledgeStore.allKnowledge.find(k => k.id === knowledgeId))

const loading = ref(false)
const analysisResult = ref('')
const selectedOptions = ref<string[]>([
  'explain',
  'example',
  'common-mistakes',
  'related',
  'memory-tips'
])

const formattedResult = computed(() => {
  // 简单的 markdown 转 html
  let text = analysisResult.value
  text = text.replace(/\n/g, '<br>')
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  text = text.replace(/`(.*?)`/g, '<code>$1</code>')
  return text
})

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goToSettings = () => router.push('/settings')

const generateAnalysis = async () => {
  if (!knowledgeItem.value) return
  if (!settingsStore.settings.aiApiKey) {
    ElMessage.error('请先配置 API Key')
    return
  }

  loading.value = true
  try {
    const prompt = buildPrompt()
    const result = await analyzeWithAI(
      prompt,
      settingsStore.settings.aiApiKey,
      settingsStore.settings.aiBaseUrl
    )
    analysisResult.value = result
  } catch (e) {
    ElMessage.error('AI 分析失败: ' + (e as Error).message)
  } finally {
    loading.value = false
  }
}

const buildPrompt = () => {
  const item = knowledgeItem.value!
  const options: string[] = []
  if (selectedOptions.value.includes('explain')) options.push('- 给出更详细通俗的解释，帮助理解')
  if (selectedOptions.value.includes('example')) options.push('- 提供更多实际应用的例子')
  if (selectedOptions.value.includes('common-mistakes')) options.push('- 指出新手容易犯的错误和理解误区')
  if (selectedOptions.value.includes('related')) options.push('- 列举相关的知识点，帮助建立知识体系')
  if (selectedOptions.value.includes('memory-tips')) options.push('- 给一些记忆这个知识点的技巧')

  return `
我正在学习编程知识点，需要你帮助我分析这个知识点：

问题：${item.question}
现有答案：${item.answer}
${item.code ? `代码：${item.code}` : ''}

请帮我分析这个知识点，需要包含以下内容：
${options.join('\n')}

请用中文回答，格式清晰。
`.trim()
}

onMounted(() => {
  if (!knowledgeItem.value) {
    ElMessage.error('知识点不存在')
    router.push('/')
  }
})
</script>

<style scoped>
.ai-analysis {
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

.page-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.alert {
  margin-bottom: 20px;
}

.question-info {
  margin-bottom: 20px;
}

.existing-answer {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
}

.analysis-options {
  margin-bottom: 20px;
}

.generate-button {
  text-align: center;
  margin-top: 20px;
}

.result {
  margin-top: 20px;
}

.markdown-content {
  line-height: 1.8;
}

.markdown-content br {
  line-height: 1.8;
}

.markdown-content code {
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
