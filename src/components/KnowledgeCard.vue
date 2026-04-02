<template>
  <div class="card knowledge-card" :class="{ flipped: showAnswer }">
    <div class="card-inner">
      <!-- 正面 - 问题 -->
      <div class="card-front">
        <div class="question">
          {{ point.question }}
        </div>
        <div class="footer">
          <el-tag :type="getDifficultyType">{{ getDifficultyText }}</el-tag>
          <span class="stage">重复: {{ point.repetitions }}</span>
        </div>
      </div>

      <!-- 背面 - 答案 -->
      <div class="card-back">
        <div class="answer" v-html="formattedAnswer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KnowledgeItem } from '../types'

interface Props {
  point: KnowledgeItem;
  showAnswer: boolean;
}

const props = withDefaults(defineProps<Props>(), {})

const getDifficultyType = computed(() => {
  const d = props.point.difficulty
  if (d <= 2) return 'success'
  if (d <= 3) return 'warning'
  return 'danger'
})

const getDifficultyText = computed(() => {
  const d = props.point.difficulty
  return ['', '极简单', '简单', '中等', '难', '极难'][d] || ''
})

// 把换行转成<br>方便显示
const formattedAnswer = computed(() => {
  return props.point.answer.replace(/\n/g, '<br>')
})
</script>

<style scoped>
.knowledge-card {
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  perspective: 1000px;
  cursor: pointer;
  margin: 0 auto;
  padding: 0;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 300px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-front {
  background: white;
  color: #333;
}

.card-back {
  background: #f0f9ff;
  color: #333;
  transform: rotateY(180deg);
}

.question {
  font-size: 18px;
  line-height: 1.6;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.answer {
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
  overflow-y: auto;
  max-height: 100%;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.stage {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .knowledge-card {
    min-height: 260px;
  }
  .card-front,
  .card-back {
    min-height: 260px;
    padding: 16px;
  }
  .question {
    font-size: 16px;
  }
  .answer {
    font-size: 14px;
  }
}
</style>
