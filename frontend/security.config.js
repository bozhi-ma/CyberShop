/**
 * 安全配置文件
 * 定义内容安全策略、安全头和其他安全相关设置
 */

// 内容安全策略配置
export const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'", // Vue 3 需要
    'https://unpkg.com',
    'https://cdn.jsdelivr.net'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://unpkg.com'
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com',
    'https://unpkg.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  'connect-src': [
    "'self'",
    'https:',
    'wss:',
    'ws:',
    // 在开发环境中允许连接到本地后端
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ],
  'media-src': [
    "'self'",
    'https:',
    'blob:'
  ],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'worker-src': [
    "'self'",
    'blob:'
  ],
  'manifest-src': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

// 安全头配置
export const securityHeaders = {
  // 防止 MIME 类型嗅探
  'X-Content-Type-Options': 'nosniff',
  
  // 防止点击劫持
  'X-Frame-Options': 'DENY',
  
  // XSS 保护
  'X-XSS-Protection': '1; mode=block',
  
  // 引用策略
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // 权限策略
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  
  // 内容安全策略
  'Content-Security-Policy': Object.entries(cspConfig)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
};

// 缓存控制配置
export const cacheConfig = {
  // 静态资源缓存
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'ETag': true
  },
  
  // API 响应缓存
  api: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  
  // HTML 页面缓存
  html: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

// 性能优化配置
export const performanceConfig = {
  // 预加载关键资源
  preload: [
    '/src/main.ts',
    '/src/style.css'
  ],
  
  // 预连接外部域名
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://unpkg.com'
  ],
  
  // DNS 预取
  dnsPrefetch: [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//unpkg.com'
  ]
};

// 不再需要为开发环境单独覆盖整个CSP，因为已经在上面通过三元运算符处理了
// if (process.env.NODE_ENV === 'development') {
//   securityHeaders['Content-Security-Policy'] = 
//     "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: ws: wss:; frame-src 'none'; object-src 'none';";
// } 