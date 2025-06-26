/// <reference types="node" />
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 全局测试配置
config.global.stubs = {
  'el-icon': true,
  'el-button': true,
  'el-input': true,
  'el-select': true,
  'el-menu': true,
  'el-menu-item': true,
  'el-card': true,
  'el-pagination': true,
  'el-dialog': true,
  'el-form': true,
  'el-form-item': true,
  'el-checkbox': true,
  'el-radio': true,
  'el-slider': true,
  'el-switch': true,
  'el-tag': true,
  'el-badge': true,
  'el-tooltip': true,
  'el-popover': true,
  'el-dropdown': true,
  'el-dropdown-menu': true,
  'el-dropdown-item': true
}

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn(),
    alert: vi.fn(),
    prompt: vi.fn()
  }
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/'
  })
}))

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  createPinia: vi.fn()
}))

// 全局测试工具函数
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})) 