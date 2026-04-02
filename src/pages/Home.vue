<template>
  <div class="home">
    <el-container>
      <el-header class="home-header">
        <h1>程序员知识点记忆</h1>
        <p class="subtitle">基于艾宾浩斯遗忘曲线的高效记忆法</p>
      </el-header>

      <el-main class="home-content">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToCategories">
              <div class="card-icon">
                <el-icon :size="40"><Notebook /></el-icon>
              </div>
              <h3>开始学习</h3>
              <p>选择知识点分类，开始你的记忆之旅</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToReview">
              <div class="card-icon">
                <el-icon :size="40"><Calendar /></el-icon>
              </div>
              <h3>今日复习</h3>
              <p>{{ reviewCount }} 个知识点待复习</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToQuiz">
              <div class="card-icon">
                <el-icon :size="40"><QuestionFilled /></el-icon>
              </div>
              <h3>随机测验</h3>
              <p>检验你的记忆成果</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToProgram">
              <div class="card-icon">
                <el-icon :size="40"><Document /></el-icon>
              </div>
              <h3>编程题</h3>
              <p>练习编程题目</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToStatistics">
              <div class="card-icon">
                <el-icon :size="40"><DataLine /></el-icon>
              </div>
              <h3>统计数据</h3>
              <p>查看学习进度和统计</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="home-card" shadow="hover" @click="goToSettings">
              <div class="card-icon">
                <el-icon :size="40"><Setting /></el-icon>
              </div>
              <h3>设置</h3>
              <p>自定义学习参数</p>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">学习进度概览</el-divider>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <el-descriptions :column="2" :bordered="false">
                <el-descriptions-item label="已学习知识点">{{ totalLearned }}</el-descriptions-item>
                <el-descriptions-item label="掌握程度">{{ masteryPercent }}%</el-descriptions-item>
                <el-descriptions-item label="连续学习">{{ consecutiveDays }} 天</el-descriptions-item>
                <el-descriptions-item label="总学习天数">{{ totalDays }} 天</el-descriptions-item>
              </el-descriptions>
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
import {
  Notebook,
  Calendar,
  QuestionFilled,
  Document,
  DataLine,
  Setting
} from '@element-plus/icons-vue'
import { useKnowledgeStore } from '../store/knowledge'
import { useReviewStore } from '../store/review'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const reviewStore = useReviewStore()

const reviewCount = computed(() => reviewStore.dueReviewCount)
const totalLearned = computed(() => knowledgeStore.totalLearned)
const masteryPercent = computed(() => knowledgeStore.masteryPercent)
const consecutiveDays = computed(() => knowledgeStore.consecutiveDays)
const totalDays = computed(() => knowledgeStore.totalStudyDays)

const goToCategories = () => router.push('/categories')
const goToReview = () => router.push('/review')
const goToQuiz = () => router.push('/quiz')
const goToProgram = () => router.push('/program')
const goToStatistics = () => router.push('/statistics')
const goToSettings = () => router.push('/settings')
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

.home-header {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  height: auto !important;
}

.home-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.subtitle {
  margin: 10px 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.home-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  padding: 20px;
}

.home-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  margin-bottom: 15px;
  color: #667eea;
}

.home-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.25rem;
  color: #303133;
}

.home-card p {
  margin: 0;
  color: #909399;
}
</style>
