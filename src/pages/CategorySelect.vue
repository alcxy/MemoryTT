<template>
  <div class="category-select">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>选择知识分类</h2>
      </el-header>

      <el-main class="page-content">
        <el-row :gutter="20" v-for="(group, key) in categorizedCategories" :key="key">
          <el-col :span="24">
            <h3 class="group-title">{{ getGroupLabel(key) }}</h3>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" v-for="category in group" :key="category.id">
            <el-card
              class="category-card"
              shadow="hover"
              :class="{ 'is-learned': category.progress > 0 }"
            >
              <div class="category-header" @click="enterCategory(category.id)">
                <h4>{{ category.name }}</h4>
                <el-tag size="small" :type="getProgressType(category.progress)">{{ category.progress }}%</el-tag>
              </div>
              <p class="category-desc">{{ category.description }}</p>
              <div class="category-footer">
                <el-progress
                  :percentage="category.progress"
                  :show-text="false"
                  :stroke-width="8"
                />
                <span class="item-count">{{ category.total }} 个知识点</span>
              </div>
              <div class="category-actions" v-if="category.progress === 0 && hasPresetData(category.id)">
                <el-button type="success" size="small" @click.stop="importPresetData(category.id)">
                  导入题库
                </el-button>
                <div class="difficulty-hint">
                  <el-tag size="small" type="success">低</el-tag>
                  <el-tag size="small" type="warning">中</el-tag>
                  <el-tag size="small" type="danger">高</el-tag>
                  已分级
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useKnowledgeStore } from '../store/knowledge'
import type { Category, KnowledgeItem } from '../types'
import { loadPresetKnowledge } from '../utils/presetLoader'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const categorizedCategories = computed(() => {
  const groups: Record<string, Category[]> = {
    languages: [],
    frameworks: [],
    databases: [],
    other: []
  }
  knowledgeStore.categories.forEach(cat => {
    if (groups[cat.group]) {
      groups[cat.group].push(cat)
    } else {
      groups.other.push(cat)
    }
  })
  return groups
})

const getGroupLabel = (group: string) => {
  const labels: Record<string, string> = {
    languages: '编程语言',
    frameworks: '框架',
    databases: '数据库',
    other: '其他'
  }
  return labels[group] || group
}

const getProgressType = (progress: number) => {
  if (progress === 0) return 'info'
  if (progress < 30) return 'warning'
  if (progress < 70) return ''
  return 'success'
}

const hasPresetData = (categoryId: string): boolean => {
  // 检查是否有预置数据
  return ['csharp', 'python', 'aspnetcore', 'mysql', 'vue'].includes(categoryId)
}

const importPresetData = async (categoryId: string) => {
  try {
    const items = await loadPresetKnowledge(categoryId)
    let count = 0
    items.forEach(item => {
      // 检查是否已存在
      const exists = knowledgeStore.allKnowledge.find(k => k.question === item.question && k.categoryId === categoryId)
      if (!exists) {
        const newItem: KnowledgeItem = {
          ...item,
          id: `${categoryId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          categoryId,
          created: new Date().toISOString(),
          interval: 0,
          repetitions: 0,
          nextReview: new Date().toISOString()
        }
        knowledgeStore.addKnowledge(newItem)
        count++
      }
    })
    if (count > 0) {
      ElMessage.success(`成功导入 ${count} 个知识点`)
    } else {
      ElMessage.info('该分类下知识点已经全部导入了')
    }
  } catch (e) {
    ElMessage.error('导入失败: ' + (e as Error).message)
  }
}

const goBack = () => router.push('/')
const enterCategory = (categoryId: string) => router.push(`/learning/${categoryId}`)
</script>

<style scoped>
.category-select {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: auto !important;
  padding: 15px 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #303133;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.group-title {
  margin: 20px 0 15px 0;
  color: #606266;
  font-size: 1.1rem;
  border-left: 4px solid #667eea;
  padding-left: 10px;
}

.category-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-3px);
}

.category-card.is-learned {
  border-color: #67c23a;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #303133;
}

.category-desc {
  color: #909399;
  font-size: 0.9rem;
  margin: 0 0 15px 0;
}

.category-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-footer .el-progress {
  flex: 1;
}

.item-count {
  font-size: 0.8rem;
  color: #909399;
  white-space: nowrap;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.category-actions {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty-hint {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 0.75rem;
  color: #909399;
}
</style>
