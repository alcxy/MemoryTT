import type { AIAnalysisResult } from '../types'

// 用于编程题分析（OpenAI，支持图片 OCR）
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export interface AIAnalyzeProgramRequest {
  apiKey: string;
  model: string;
  question: string;
  imageBase64: string;
}

// 构建Prompt
function buildProgramPrompt(question: string): string {
  return `用户上传了一道编程题的手写答案照片。题目是：${question}

请你完成以下任务：
1. OCR识别图片中的代码和文字。如果图片倒置请旋转纠正。
2. 判断答案是否正确解决了题目问题。
3. 给出0-100的分数。
4. 提供改进建议，每条建议简洁明了。
5. 如果有错误，指出错误原因。
6. 如果需要，提供优化后的代码。

请严格以JSON格式返回，不要有其他文字。格式如下：
{
  "ocrText": "这里放识别出的文字内容",
  "isCorrect": true/false,
  "score": 分数数字0-100,
  "feedback": "整体评价，1-2句话",
  "suggestions": ["建议1", "建议2", ...],
  "improvedCode": "优化后的代码，如果不需要改进则留空"
}`
}

export async function analyzeProgramSubmission(request: AIAnalyzeProgramRequest): Promise<AIAnalysisResult> {
  const { apiKey, model, question, imageBase64 } = request

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('请先在设置中配置 OpenAI API Key')
  }

  const prompt = buildProgramPrompt(question)
  const contentType = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: contentType } },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `API请求失败: ${response.status}`)
    }

    const result = await response.json()
    const content = result.choices[0]?.message?.content

    if (!content) {
      throw new Error('AI返回为空')
    }

    // 提取JSON部分（防止AI返回多余文字）
    let jsonStr = content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    try {
      const analysis: AIAnalysisResult = JSON.parse(jsonStr)
      return analysis
    } catch (e) {
      throw new Error(`解析AI返回结果失败: ${(e as Error).message}`)
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e
    }
    throw new Error('AI分析请求失败')
  }
}

// 用于知识点文本分析（Anthropic Claude）
export async function analyzeWithAI(
  prompt: string,
  apiKey: string,
  baseUrl: string = 'https://api.anthropic.com',
  model: string = 'claude-3-sonnet-20240229'
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('请先在设置中配置 Anthropic API Key')
  }

  const url = `${baseUrl.replace(/\/$/, '')}/v1/messages`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `API请求失败: ${response.status}`)
    }

    const result = await response.json()
    const content = result.content?.[0]?.text

    if (!content) {
      throw new Error('AI返回为空')
    }

    return content
  } catch (e) {
    if (e instanceof Error) {
      throw e
    }
    throw new Error('AI分析请求失败')
  }
}
