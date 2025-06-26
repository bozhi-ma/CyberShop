/**
 * AR智能试用页面
 * 包含虚拟试戴、3D商品展示、AR拍照、尺寸测量等多模态AR体验
 */

<template>
  <div class="ar-page">
    <NavBar />
    <div class="ar-content">
      <h1 class="ar-title">AR智能试用</h1>
      <!-- 新增：打开摄像头按钮 -->
      <el-button type="primary" @click="openCamera" style="margin-bottom: 16px;">打开摄像头</el-button>
      <!-- 始终渲染摄像头和画布元素 -->
      <video ref="videoRef" autoplay playsinline width="640" height="480" style="display:block; margin-bottom: 8px;"></video>
      <canvas ref="canvasRef" width="640" height="480" class="tryon-canvas" style="display:none"></canvas>
      <div class="ar-features">
        <el-card class="feature-card" @click="currentFeature = 'try-on'">
          <div class="feature-icon">
            <el-icon><Camera /></el-icon>
          </div>
          <h3>虚拟试戴</h3>
          <p>通过摄像头试戴眼镜、手表等配饰</p>
        </el-card>
        <el-card class="feature-card" @click="currentFeature = '3d-view'">
          <div class="feature-icon">
            <el-icon><View /></el-icon>
          </div>
          <h3>3D商品展示</h3>
          <p>360度查看商品细节和功能</p>
        </el-card>
        <el-card class="feature-card" @click="currentFeature = 'ar-photo'">
          <div class="feature-icon">
            <el-icon><Picture /></el-icon>
          </div>
          <h3>AR拍照</h3>
          <p>将商品虚拟放置到真实环境中</p>
        </el-card>
        <el-card class="feature-card" @click="currentFeature = 'size-fit'">
          <div class="feature-icon">
            <el-icon><Operation /></el-icon>
          </div>
          <h3>尺寸测量</h3>
          <p>AR测量商品尺寸和空间适配</p>
        </el-card>
      </div>
      <div v-if="currentFeature === 'try-on'" class="ar-experience">
        <div class="experience-header">
          <h2>虚拟试戴</h2>
          <el-button @click="currentFeature = null" type="info">返回</el-button>
        </div>
        <div class="tryon-container">
          <!-- 这里不再渲染 video/canvas，只保留商品选择UI -->
          <div class="product-selector">
            <div
              v-for="product in arProducts"
              :key="product.id"
              :class="['product-item', { active: selectedProduct?.id === product.id }]"
              @click="selectProduct(product)"
            >
              <img :src="product.image" :alt="product.name" />
              <p>{{ product.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 说明卡片 -->
      <div v-if="!currentFeature" class="instructions">
        <el-card>
          <template #header>
            <h3>AR试用使用说明</h3>
          </template>
          <div class="instruction-content">
            <div class="instruction-item">
              <h4>虚拟试戴</h4>
              <p>通过摄像头实时试戴眼镜、手表等配饰，体验真实佩戴效果。</p>
            </div>
            <div class="instruction-item">
              <h4>3D商品展示</h4>
              <p>360度旋转查看商品细节，支持缩放和多角度浏览。</p>
            </div>
            <div class="instruction-item">
              <h4>AR拍照</h4>
              <p>将商品虚拟放置到真实环境中，拍摄创意照片。</p>
            </div>
            <div class="instruction-item">
              <h4>尺寸测量</h4>
              <p>通过AR测量商品尺寸，辅助空间适配。</p>
            </div>
          </div>
        </el-card>
      </div>
      <!-- AR体验区域 -->
      <div v-if="currentFeature" class="ar-experience">
        <div class="experience-header">
          <h2>{{ featureTitle }}</h2>
          <el-button @click="currentFeature = null" type="info">返回</el-button>
        </div>

        <!-- 3D商品展示 -->
        <div v-if="currentFeature === '3d-view'" class="d-view-section">
          <div ref="threeMountPoint" class="d-placeholder">
            <div v-if="!isThreeJsInitialized" class="placeholder-content">
              <el-icon><Box /></el-icon>
              <p>正在加载3D模型...</p>
            </div>
          </div>
          
          <div class="d-product-info">
            <h3>3D商品信息</h3>
            <div class="product-details">
              <div class="detail-item">
                <span class="label">商品名称：</span>
                <span class="value">复古胶片相机</span>
              </div>
              <div class="detail-item">
                <span class="label">尺寸：</span>
                <span class="value">140 x 90 x 85 mm</span>
              </div>
              <div class="detail-item">
                <span class="label">重量：</span>
                <span class="value">约 650g</span>
              </div>
              <div class="detail-item">
                <span class="label">材质：</span>
                <span class="value">镁合金机身</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AR拍照 -->
        <div v-if="currentFeature === 'ar-photo'" class="ar-photo-section">
          <div class="photo-container">
            <div class="photo-placeholder">
              <el-icon><Camera /></el-icon>
              <p>AR拍照区域</p>
              <p class="small">将商品虚拟放置到环境中</p>
            </div>
            <div class="ar-elements">
              <div class="ar-element" v-for="element in furnitureProducts" :key="element.id">
                <img :src="element.image" :alt="element.name" />
                <p>{{ element.name }}</p>
              </div>
            </div>
          </div>
          
          <div class="photo-controls">
            <el-button type="primary" @click="takePhoto">拍照</el-button>
            <el-button @click="resetPhoto">重置</el-button>
            <el-button type="success" @click="savePhoto">保存</el-button>
          </div>
        </div>

        <!-- 尺寸测量 -->
        <div v-if="currentFeature === 'size-fit'" class="size-fit-section">
          <div class="measurement-container">
            <div class="measurement-placeholder">
              <el-icon><Operation /></el-icon>
              <p>AR测量区域</p>
              <p class="small">点击屏幕进行尺寸测量</p>
            </div>
            <div class="measurement-overlay">
              <div class="measurement-line" v-for="line in measurementLines" :key="line.id">
                <span class="measurement-text">{{ line.distance }}cm</span>
              </div>
            </div>
          </div>
          
          <div class="measurement-info">
            <h3>测量结果</h3>
            <div class="measurement-results">
              <div class="result-item">
                <span class="label">长度：</span>
                <span class="value">{{ measurements.length }}cm</span>
              </div>
              <div class="result-item">
                <span class="label">宽度：</span>
                <span class="value">{{ measurements.width }}cm</span>
              </div>
              <div class="result-item">
                <span class="label">高度：</span>
                <span class="value">{{ measurements.height }}cm</span>
              </div>
              <div class="result-item">
                <span class="label">面积：</span>
                <span class="value">{{ measurements.area }}cm²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { 
  Camera, 
  View, 
  Picture, 
  Operation, 
  Box 
} from '@element-plus/icons-vue';
import { useNotificationStore } from '../store/notification';
import NavBar from '../components/NavBar.vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';

const notificationStore = useNotificationStore();
const { addNotification } = notificationStore;

const currentFeature = ref<string | null>(null);
const threeMountPoint = ref<HTMLElement | null>(null);
const isThreeJsInitialized = ref(false);
let cleanupThreeJs: (() => void) | null = null;

const featureTitle = computed(() => {
  const titles: { [key: string]: string } = {
    'try-on': '虚拟试戴',
    '3d-view': '3D商品展示',
    'ar-photo': 'AR拍照',
    'size-fit': '尺寸测量'
  };
  return titles[currentFeature.value || ''] || '';
});

const arProducts = ref([
   { id: 1, name: 'Ray-Ban 墨镜', image: '/assets/glasses.png', type: 'glasses' },
   { id: 2, name: 'Apple Watch', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop', type: 'watch' },
   { id: 3, name: 'AirPods Pro', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', type: 'earphones' },
   { id: 4, name: '项链', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', type: 'necklace' }
]);

const furnitureProducts = ref([
   { id: 1, name: '沙发', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
   { id: 2, name: '桌子', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop' },
   { id: 3, name: '椅子', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop' },
   { id: 4, name: '装饰品', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop' }
]);

const selectedProduct = ref<any>(null);

const selectProduct = (product: any) => {
  selectedProduct.value = product;
};

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let camera: MediaPipeCamera | null = null;
let faceMesh: FaceMesh | null = null;
const glassesImg = new window.Image();
glassesImg.src = arProducts.value[0].image;

// 新增：打开摄像头方法
async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();
    }
  } catch (error: any) {
    addNotification({ message: '无法访问摄像头，请检查权限设置', type: 'error' });
  }
}

onMounted(async () => {
  await nextTick();
  // 页面加载时自动尝试打开摄像头
  openCamera();
  // 检查摄像头权限
  const hasPermission = await checkCameraPermission();
  if (!hasPermission) {
    // 没权限就不继续初始化
    return;
  }
  faceMesh = new FaceMesh({
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  faceMesh.onResults(onResults);

  if (videoRef.value) {
    camera = new MediaPipeCamera(videoRef.value, {
      onFrame: async () => {
        await faceMesh!.send({ image: videoRef.value! });
      },
      width: 640,
      height: 480
    });
    camera.start();
  }
});

onUnmounted(() => {
  camera?.stop();
});

function onResults(results: any) {
  console.log('onResults', results)
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.image) {
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  }
  if (
    results.multiFaceLandmarks &&
    results.multiFaceLandmarks.length > 0 &&
    selectedProduct.value.type === 'glasses'
  ) {
    const landmarks = results.multiFaceLandmarks[0];
    // 取左右眼角点
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const center = landmarks[168]; // 鼻梁中点

    // 计算眼镜宽度和角度
    const dx = (rightEye.x - leftEye.x) * canvas.width;
    const dy = (rightEye.y - leftEye.y) * canvas.height;
    const glassesWidth = Math.sqrt(dx * dx + dy * dy) * 1.4; // 适当放大
    const angle = Math.atan2(dy, dx);

    // 计算眼镜中心点
    const centerX = center.x * canvas.width;
    const centerY = center.y * canvas.height;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.drawImage(glassesImg, -glassesWidth / 2, -glassesWidth / 4, glassesWidth, glassesWidth / 2);
    ctx.restore();
  }
}

const initThreeJs = () => {
  if (!threeMountPoint.value || isThreeJsInitialized.value) return null;

  const mountEl = threeMountPoint.value;
  mountEl.innerHTML = '';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(75, mountEl.clientWidth / mountEl.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
  mountEl.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);
  
  camera.position.set(0, 1, 4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);

  let model: THREE.Group | null = null;
  const loader = new GLTFLoader();
  loader.load(
    '/models/scene.gltf',
    (gltf) => {
      model = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      
      model.scale.set(scale, scale, scale);
      model.position.sub(center.multiplyScalar(scale));

      scene.add(model);
      isThreeJsInitialized.value = true;
    },
    undefined,
    (error) => {
      console.error('模型加载失败:', error);
      mountEl.innerHTML = `<div class="placeholder-content" style="color: red;">无法加载3D模型，请确认 public/models/ 目录下包含 scene.gltf, scene.bin, 和 textures 文件夹。</div>`;
    }
  );

  let animationFrameId: number;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.005;
    }
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    if (mountEl) {
      camera.aspect = mountEl.clientWidth / mountEl.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    }
  };
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(animationFrameId);
    renderer.dispose();
    if (mountEl && renderer.domElement) {
      mountEl.removeChild(renderer.domElement);
    }
    isThreeJsInitialized.value = false;
  };
};

watch(currentFeature, async (newFeature, oldFeature) => {
  // Cleanup previous feature
  if (oldFeature === '3d-view' && cleanupThreeJs) {
    cleanupThreeJs();
    cleanupThreeJs = null;
  }

  // Initialize new feature
  if (newFeature === '3d-view') {
    await nextTick();
    cleanupThreeJs = initThreeJs();
  }
});

onUnmounted(() => {
  if (cleanupThreeJs) {
    cleanupThreeJs();
  }
});

const takePhoto = () => {
  addNotification({ message: 'AR拍照完成！', type: 'success' });
};

const resetPhoto = () => {
  addNotification({ message: '已重置AR场景', type: 'info' });
};

const savePhoto = () => {
  addNotification({ message: 'AR照片已保存到相册', type: 'success' });
};

const measurementLines = ref([
   { id: 1, distance: 50 },
   { id: 2, distance: 30 },
   { id: 3, distance: 20 }
]);

const measurements = ref({
   length: 50,
   width: 30,
   height: 20,
   area: 1500
});

// 新增：封装摄像头权限检测
async function checkCameraPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true;
  } catch (error: any) {
    // 详细输出错误信息
    let msg = '摄像头权限获取失败：';
    if (error.name) msg += error.name + ' - ';
    if (error.message) msg += error.message;
    else msg += error.toString();
    addNotification({ message: msg, type: 'error' });
    return false;
  }
}
</script>

<style scoped>
.ar-page {
  min-height: 100vh;
  padding: 20px;
  background: #1a1a2e;
}
.ar-content {
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
}
.ar-title {
  color: #00fff7;
  font-size: 2.5rem;
  margin-bottom: 40px;
}
.ar-features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}
.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 247, 0.2);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 255, 247, 0.1);
}
.feature-icon {
  font-size: 2.5rem;
  color: #00fff7;
  margin-bottom: 16px;
}
h3 {
  color: #fff;
  margin-bottom: 8px;
}
p {
  color: #ccc;
  font-size: 0.9rem;
}
.instructions {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 12px;
}
.instruction-content {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
.ar-experience {
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
}
.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.experience-header h2 {
  color: #00fff7;
  font-size: 1.8rem;
  margin: 0;
}
.tryon-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.tryon-canvas {
  border-radius: 8px;
  background: #111;
}
.product-selector {
  width: 200px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.product-item {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  text-align: center;
}
.product-item.active {
  border-color: #00fff7;
}
.product-item img {
  width: 100%;
  border-radius: 4px;
}
.product-item p {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #fff;
}
.d-view-section {
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
}
.d-placeholder {
  width: 100%;
  height: 400px;
  background: #111;
  border-radius: 12px;
  margin-bottom: 24px;
}
.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}
.d-product-info {
  background: rgba(0,0,0,0.2);
  padding: 16px;
  border-radius: 8px;
  color: #fff;
}
.product-details {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.label {
  font-weight: bold;
}
.value {
  margin-top: 8px;
}
.ar-photo-section {
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
}
.photo-container {
  min-height: 400px;
  background: #111;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.5rem;
  position: relative;
}
.photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ar-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ar-element {
  margin-bottom: 16px;
}
.ar-element img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
.ar-element p {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #fff;
}
.photo-controls {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.size-fit-section {
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.2);
  padding: 24px;
  border-radius: 12px;
}
.measurement-container {
  min-height: 400px;
  background: #111;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.5rem;
  position: relative;
}
.measurement-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.measurement-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  will-change: transform;
  transform-origin: 0 0;
  visibility: hidden;
  transition: visibility 0.2s;
}
.measurement-line {
  width: 100%;
  height: 2px;
  background: rgba(0, 255, 247, 0.2);
  margin-bottom: 8px;
}
.measurement-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
}
.measurement-info {
  background: rgba(0,0,0,0.2);
  padding: 16px;
  border-radius: 8px;
  color: #fff;
}
.measurement-results {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}
.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style> 