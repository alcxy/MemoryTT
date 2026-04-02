<template>
  <div class="photo-uploader">
    <div v-if="!imageData" class="controls">
      <el-button type="primary" @click="startCamera" :icon="Camera">
        拍照
      </el-button>
      <el-button @click="selectFromGallery" :icon="Picture">
        从相册选择
      </el-button>
    </div>

    <div v-if="isCameraOpen" class="camera-container">
      <video ref="videoRef" autoplay playsinline class="video"></video>
      <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" style="display: none"></canvas>
      <div class="camera-controls">
        <el-button type="danger" @click="stopCamera">取消</el-button>
        <el-button type="primary" @click="capture" :icon="Camera">拍摄</el-button>
      </div>
    </div>

    <div v-if="imageData" class="preview">
      <img :src="imageDataUrl" alt="预览" class="preview-image" />
      <div class="preview-controls">
        <el-button @click="retake">重新拍摄</el-button>
        <el-button type="primary" @click="confirm">确认上传</el-button>
      </div>
    </div>

    <el-progress v-if="loading" :percentage="uploadProgress" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, Picture } from '@element-plus/icons-vue'
import { captureFromCanvas, compressImage, openFileSelector } from '../utils/imageUtils'

interface Props {
  onConfirm: (base64: string) => void;
}

const props = withDefaults(defineProps<Props>(), {})

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isCameraOpen = ref(false)
const imageData = ref<string | null>(null)
const imageDataUrl = computed(() => {
  return imageData.value ? `data:image/jpeg;base64,${imageData.value}` : ''
})
const loading = ref(false)
const uploadProgress = ref(0)
const streamRef = ref<MediaStream | null>(null)

const canvasWidth = ref(800)
const canvasHeight = ref(600)

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    streamRef.value = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    isCameraOpen.value = true

    // 获取实际视频尺寸
    videoRef.value?.addEventListener('loadedmetadata', () => {
      if (videoRef.value) {
        const vw = videoRef.value.videoWidth
        const vh = videoRef.value.videoHeight
        // 按比例缩小
        const maxWidth = 800
        if (vw > maxWidth) {
          const ratio = maxWidth / vw
          canvasWidth.value = maxWidth
          canvasHeight.value = Math.round(vh * ratio)
        } else {
          canvasWidth.value = vw
          canvasHeight.value = vh
        }
      }
    })
  } catch (e) {
    ElMessage.error('无法访问摄像头，请检查权限')
    console.error('Camera access error:', e)
  }
}

function stopCamera() {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop())
    streamRef.value = null
  }
  isCameraOpen.value = false
}

function capture() {
  if (!videoRef.value || !canvasRef.value) return
  const base64 = captureFromCanvas(videoRef.value, canvasRef.value)
  imageData.value = base64
  stopCamera()
}

async function selectFromGallery() {
  const file = await openFileSelector('image/*')
  if (!file) return
  loading.value = true
  try {
    const base64 = await compressImage(file, 800, 0.8)
    imageData.value = base64
  } catch (e) {
    ElMessage.error('处理图片失败')
    console.error(e)
  } finally {
    loading.value = false
  }
}

function retake() {
  imageData.value = null
}

function confirm() {
  if (imageData.value) {
    props.onConfirm(imageData.value)
  }
}

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.photo-uploader {
  width: 100%;
}

.controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 40px;
}

.camera-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.video {
  width: 100%;
  border-radius: 8px;
  background: #000;
}

.camera-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.preview {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.preview-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
</style>
