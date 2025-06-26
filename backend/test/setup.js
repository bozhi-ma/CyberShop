// 测试环境设置
process.env.NODE_ENV = 'test'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// 设置测试超时
jest.setTimeout(10000)

// 清理函数
afterEach(() => {
  jest.clearAllMocks()
}) 