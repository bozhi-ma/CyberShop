const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const crypto = require('crypto')

/**
 * 安全中间件配置
 */

// 限流配置
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: '请求过于频繁，请稍后再试',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: '请求过于频繁，请稍后再试',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// 不同路由的限流配置
const authLimiter = createRateLimiter(15 * 60 * 1000, 5) // 登录接口：15分钟内最多5次
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100) // API接口：15分钟内最多100次
const uploadLimiter = createRateLimiter(60 * 60 * 1000, 10) // 上传接口：1小时内最多10次

// CSRF Token 验证
const csrfProtection = (req, res, next) => {
  // 跳过GET请求和OPTIONS请求
  if (req.method === 'GET' || req.method === 'OPTIONS') {
    return next()
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf
  const sessionToken = req.session?.csrfToken

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token 验证失败',
      code: 'CSRF_ERROR'
    })
  }

  next()
}

// 请求签名验证
const signatureVerification = (req, res, next) => {
  const signature = req.headers['x-signature']
  const timestamp = req.headers['x-timestamp']
  const nonce = req.headers['x-nonce']

  // 检查必要参数
  if (!signature || !timestamp || !nonce) {
    return res.status(401).json({
      error: '缺少签名参数',
      code: 'SIGNATURE_MISSING'
    })
  }

  // 检查时间戳（5分钟内有效）
  const now = Date.now()
  const requestTime = parseInt(timestamp)
  if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
    return res.status(401).json({
      error: '请求已过期',
      code: 'SIGNATURE_EXPIRED'
    })
  }

  // 验证签名
  const secret = process.env.API_SECRET || 'your-api-secret'
  const data = `${req.method}${req.path}${timestamp}${nonce}${JSON.stringify(req.body)}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')

  if (signature !== expectedSignature) {
    return res.status(401).json({
      error: '签名验证失败',
      code: 'SIGNATURE_INVALID'
    })
  }

  next()
}

// 输入验证和清理
const inputSanitization = (req, res, next) => {
  // 清理请求体
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // 移除潜在的XSS代码
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim()
      }
    })
  }

  // 清理查询参数
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim()
      }
    })
  }

  next()
}

// 文件上传安全检查
const fileUploadSecurity = (req, res, next) => {
  if (!req.files && !req.file) {
    return next()
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  const files = req.files || [req.file]
  
  for (const file of files) {
    // 检查文件类型
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: '不支持的文件类型',
        code: 'INVALID_FILE_TYPE'
      })
    }

    // 检查文件大小
    if (file.size > maxSize) {
      return res.status(400).json({
        error: '文件大小超过限制',
        code: 'FILE_TOO_LARGE'
      })
    }

    // 检查文件扩展名
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'))
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        error: '不支持的文件扩展名',
        code: 'INVALID_FILE_EXTENSION'
      })
    }
  }

  next()
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('Security Error:', err)

  // 不要暴露敏感信息
  const errorResponse = {
    error: '服务器内部错误',
    code: 'INTERNAL_ERROR'
  }

  // 开发环境可以显示更多信息
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.message
    errorResponse.stack = err.stack
  }

  res.status(500).json(errorResponse)
}

// 安全头配置
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
})

// CORS配置
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://yourdomain.com'
    ]
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('不允许的来源'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Signature',
    'X-Timestamp',
    'X-Nonce'
  ]
}

module.exports = {
  // 基础安全中间件
  securityHeaders,
  cors: cors(corsOptions),
  
  // 限流中间件
  authLimiter,
  apiLimiter,
  uploadLimiter,
  
  // 安全验证中间件
  csrfProtection,
  signatureVerification,
  inputSanitization,
  fileUploadSecurity,
  
  // 错误处理
  errorHandler,
  
  // 工具函数
  createRateLimiter
} 