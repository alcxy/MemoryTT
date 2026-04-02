// 图片压缩工具
export async function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 按比例缩小
        if (width > maxWidth) {
          const ratio = maxWidth / width
          width = maxWidth
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('无法获取canvas上下文'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        // 获取压缩后的base64
        const base64 = canvas.toDataURL('image/jpeg', quality)
        // 移除data:image/jpeg;base64,前缀
        const pureBase64 = base64.split(',')[1]
        resolve(pureBase64)
      }
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }
    reader.readAsDataURL(file)
  })
}

// 从canvas拍照获取压缩后的base64
export function captureFromCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法获取canvas上下文')
  }

  // 设置canvas尺寸匹配视频
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // 绘制当前帧
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  // 压缩
  const base64 = canvas.toDataURL('image/jpeg', 0.8)
  return base64.split(',')[1]
}

// 打开文件选择器
export function openFileSelector(accept: string = 'image/*'): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0] || null
      resolve(file)
    }
    input.click()
  })
}
