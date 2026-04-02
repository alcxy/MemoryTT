<template>
  <div class="settings">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>设置</h2>
      </el-header>

      <el-main class="page-content">
        <el-card class="settings-card">
          <template #header>
            <span>间隔重复设置</span>
          </template>
          <el-form label-width="160px">
            <el-form-item label="初始难度系数">
              <el-slider v-model="settingsStore.settings.easeFactor" :min="1.2" :max="3.0" :step="0.1" />
              <div class="hint">数值越大，间隔增长越快，默认 2.0</div>
            </el-form-item>
            <el-form-item label="初始间隔(天)">
              <el-input-number v-model="settingsStore.settings.initialInterval" :min="1" :max="10" />
              <div class="hint">第一次记住后多少天开始复习</div>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="settings-card" style="margin-top: 20px;">
          <template #header>
            <span>AI 增强设置 (可选)</span>
          </template>
          <el-form label-width="160px">
            <el-form-item label="Anthropic API Key">
              <el-input v-model="settingsStore.settings.aiApiKey" type="password" placeholder="sk-ant-..." show-password />
              <div class="hint">配置后可以使用 Claude AI 分析解释知识点</div>
            </el-form-item>
            <el-form-item label="API 地址">
              <el-input v-model="settingsStore.settings.aiBaseUrl" placeholder="https://api.anthropic.com" />
            </el-form-item>
            <el-form-item label="模型名称">
              <el-select v-model="settingsStore.settings.aiModel">
                <el-option label="claude-3-sonnet-20240229" value="claude-3-sonnet-20240229" />
                <el-option label="claude-3-opus-20240229" value="claude-3-opus-20240229" />
                <el-option label="claude-3-haiku-20240307" value="claude-3-haiku-20240307" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="settings-card" style="margin-top: 20px;">
          <template #header>
            <span>数据管理</span>
          </template>
          <div class="data-actions">
            <el-button type="primary" @click="exportData">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
            <el-button type="warning" @click="importData">
              <el-icon><Upload /></el-icon>
              导入数据
            </el-button>
            <el-button type="danger" @click="clearData" @confirm="confirmClear">
              <el-icon><Delete /></el-icon>
              清空所有进度
            </el-button>
          </div>
          <div class="hint">
            提示：数据会自动保存在浏览器本地，导出备份可以防止数据丢失
          </div>
          <input ref="importInput" type="file" accept=".json" hidden @change="handleImport" />
        </el-card>

        <el-card class="settings-card" style="margin-top: 20px;">
          <template #header>
            <span>关于</span>
          </template>
          <p>程序员知识点记忆 - 基于间隔重复算法的前端离线应用</p>
          <p>数据存储在浏览器本地，可以添加自定义知识点</p>
          <p>支持 PWA，可以安装到手机桌面使用</p>
        </el-card>

        <div class="save-footer">
          <el-button type="primary" size="large" @click="saveSettings">
            保存设置
          </el-button>
          <el-tag v-if="saved" type="success">已保存</el-tag>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Download, Upload, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '../store/settings'
import { useKnowledgeStore } from '../store/knowledge'
import { exportAllData, importAllData } from '../services/storageService'

const router = useRouter()
const settingsStore = useSettingsStore()
const knowledgeStore = useKnowledgeStore()

const saved = ref(false)
const importInput = ref<HTMLInputElement | null>(null)

const goBack = () => router.push('/')

const saveSettings = () => {
  settingsStore.saveSettings()
  saved.value = true
  ElMessage.success('设置已保存')
  setTimeout(() => saved.value = false, 2000)
}

const exportData = () => {
  const data = exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dev-memory-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('数据导出成功')
}

const importData = () => {
  importInput.value?.click()
}

const handleImport = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    importAllData(data)
    knowledgeStore.loadFromStorage()
    ElMessage.success('数据导入成功，页面将刷新')
    setTimeout(() => window.location.reload(), 1000)
  } catch (err) {
    ElMessage.error('导入失败: ' + (err as Error).message)
  }
}

const confirmClear = async () => {
  try {
    await ElMessageBox.confirm(
      '这会清空所有学习进度数据，只保留知识点本身。确定继续吗？',
      '确认清空',
      { type: 'warning' }
    )
    knowledgeStore.clearAllProgress()
    ElMessage.success('已清空所有学习进度')
  } catch {
    // 取消
  }
}

const clearData = () => {
  // 触发 confirm
}
</script>

<style scoped>
.settings {
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
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.hint {
  font-size: 0.85rem;
  color: #909399;
  margin-top: 5px;
}

.data-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.save-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}
</style>
