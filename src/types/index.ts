// 知识点分类
export interface Category {
  id: string;
  name: string;
  group: 'languages' | 'frameworks' | 'databases' | 'other';
  description: string;
  total: number;
  progress: number;
  icon?: string;
}

// 知识点（新简化版）
export interface KnowledgeItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  code?: string;
  difficulty: number; // 1-5，越大越难
  imageUrl?: string;
  created: string;
  // 间隔重复相关
  interval: number;         // 当前间隔天数
  repetitions: number;      // 重复次数
  nextReview: string;       // 下次复习日期 ISO
}

// 知识点（原版 SM-2）
export interface KnowledgePoint {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  // 间隔重复相关
  memoryStage: number;      // 记忆阶段 0-5
  easeFactor: number;       // 容易因子
  interval: number;         // 间隔天数
  lastReviewed: string | null; // 上次复习日期
  nextReview: string | null;   // 下次复习日期
  reviewCount: number;      // 复习次数
}

// 编程题
export interface ProgramQuestionItem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  solution?: string;
}

// 活动记录
export interface ActivityItem {
  id: string;
  question: string;
  result: 'correct' | 'wrong';
  date: string;
}

// 应用设置
export interface AppSettings {
  easeFactor: number;
  initialInterval: number;
  aiApiKey: string;
  aiBaseUrl: string;
  aiModel: string;
}

// 测验题目
export interface QuizQuestion {
  id: string;
  knowledgePointId: string;
  type: 'single' | 'multiple' | 'fill' | 'program';
  question: string;
  options?: string[];
  correctAnswers: number[] | string;
  explanation?: string;
}

// 程序题提交记录
export interface ProgramSubmission {
  id: string;
  questionId: string;
  imageBase64: string;
  timestamp: string;
  aiAnalysis: AIAnalysisResult | null;
}

// AI分析结果
export interface AIAnalysisResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
  improvedCode?: string;
  ocrText: string;
}

// 用户设置（旧版兼容）
export interface UserSettings {
  openaiApiKey: string;
  openaiModel: string;
  dailyNewCards: number;
  dailyReviews: number;
}

// 复习统计
export interface ReviewStats {
  totalCards: number;
  learnedCards: number;
  dueToday: number;
  reviewedToday: number;
  cardsByStage: Record<number, number>;
}
