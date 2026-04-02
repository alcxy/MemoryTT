<template>
  <div class="statistics">
    <el-container>
      <el-header class="page-header">
        <el-button type="primary" plain @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
        <h2>学习统计</h2>
      </el-header>

      <el-main class="page-content">
        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <el-card class="stat-card">
              <div class="stat-number">{{ totalKnowledge }}</div>
              <div class="stat-label">总知识点</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-card class="stat-card">
              <div class="stat-number">{{ learnedCount }}</div>
              <div class="stat-label">已学习</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-card class="stat-card">
              <div class="stat-number">{{ dueToday }}</div>
              <div class="stat-label">今日待复习</div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :xs="24" :md="12">
            <el-card>
              <template #header>
                <span>各分类学习进度</span>
              </template>
              <div class="category-progress" v-for="cat in categoryProgress" :key="cat.id">
                <div class="progress-header">
                  <span>{{ cat.name }}</span>
                  <span>{{ cat.learned }}/{{ cat.total }}</span>
                </div>
                <el-progress
                  :percentage="cat.percent"
                  :color="getProgressColor(cat.percent)"
                />
              </div>
            </el-card>
          </el-col>

          <el-col :xs="24" :md="12">
            <el-card>
              <template #header>
                <span>掌握程度分布</span>
              </template>
              <div class="difficulty-dist">
                <div v-for="(count, diff) in difficultyDistribution" :key="diff" class="diff-item">
                  <span>{{ diff }} 星难度</span>
                  <el-progress :percentage="(count / totalKnowledge) * 100" :show-text="true" />
                  <span class="count">{{ count }} 个</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card>
              <template #header>
                <span>学习日历</span>
              </template>
              <div class="calendar">
                <div class="calendar-day" v-for="day in learningDays" :key="day.date" :class="{ 'has-learning': day.count > 0 }">
                  <div class="day-date">{{ day.date.split('-').slice(1).join('/') }}</div>
                  <div class="day-count">{{ day.count }} 题</div>
                </div>
              </div>
              <div class="calendar-legend">
                <span class="legend-item empty"></span> 无学习
                <span class="legend-item filled"></span> 有学习
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card>
              <template #header>
                <span>学习记录</span>
              </template>
              <el-table :data="recentActivities" style="width: 100%">
                <el-table-column prop="date" label="日期" width="150" />
                <el-table-column prop="question" label="知识点" />
                <el-table-column prop="result" label="结果" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.result === 'correct' ? 'success' : 'danger'">
                      {{ row.result === 'correct' ? '记住' : '忘记' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
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
import { useKnowledgeStore } from '../store/knowledge'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const goBack = () => router.push('/')

const totalKnowledge = computed(() => knowledgeStore.allKnowledge.length)
const learnedCount = computed(() => knowledgeStore.allKnowledge.filter(k => k.repetitions > 0).length)
const dueToday = computed(() => knowledgeStore.dueForReview.length)

const categoryProgress = computed(() => {
  return knowledgeStore.categories.map(cat => {
    const total = knowledgeStore.getKnowledgeByCategory(cat.id).length
    const learned = knowledgeStore.getKnowledgeByCategory(cat.id).filter(k => k.repetitions > 0).length
    return {
      id: cat.id,
      name: cat.name,
      total,
      learned,
      percent: total > 0 ? Math.round((learned / total) * 100) : 0
    }
  })
})

const difficultyDistribution = computed(() => {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  knowledgeStore.allKnowledge.forEach(k => {
    dist[k.difficulty] = (dist[k.difficulty] || 0) + 1
  })
  return dist
})

const getProgressColor = (percent: number) => {
  if (percent < 30) return '#f56c6c'
  if (percent < 60) return '#e6a23c'
  if (percent < 90) return '#409eff'
  return '#67c23a'
}

const learningDays = computed(() => {
  // 最近 30 天的学习统计
  const days: { date: string; count: number }[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const count = knowledgeStore.getActivityCountByDate(dateStr)
    days.push({ date: dateStr, count })
  }
  return days
})

const recentActivities = computed(() => {
  return knowledgeStore.recentActivities.slice(0, 20)
})
</script>

<style scoped>
.statistics {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.stat-card {
  text-align: center;
  padding: 20px 0;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  color: #909399;
  margin-top: 5px;
}

.category-progress {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.difficulty-dist .diff-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.difficulty-dist .diff-item span:first-child {
  width: 80px;
}

.difficulty-dist .diff-item .el-progress {
  flex: 1;
}

.difficulty-dist .diff-item .count {
  width: 50px;
  text-align: right;
  color: #909399;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}

.calendar-day {
  background: #f5f7fa;
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  font-size: 0.8rem;
}

.calendar-day.has-learning {
  background: #67c23a;
  color: white;
}

.day-date {
  font-weight: 500;
}

.day-count {
  font-size: 0.7rem;
  opacity: 0.8;
}

.calendar-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.legend-item {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  border-radius: 3px;
  vertical-align: middle;
}

.legend-item.empty {
  background: #f5f7fa;
}

.legend-item.filled {
  background: #67c23a;
}
</style>
