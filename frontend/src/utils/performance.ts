/**
 * 性能监控和分析工具
 */

export interface PerformanceMetrics {
  // 页面加载性能
  pageLoadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  
  // 资源加载性能
  resourceLoadTime: number
  imageLoadTime: number
  scriptLoadTime: number
  
  // 内存使用
  memoryUsage: number
  memoryLimit: number
  
  // 网络性能
  networkLatency: number
  bandwidth: number
  
  // 用户交互性能
  interactionTime: number
  renderTime: number
}

export interface PerformanceEvent {
  name: string
  startTime: number
  endTime: number
  duration: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private events: PerformanceEvent[] = []
  private observers: Map<string, PerformanceObserver> = new Map()
  private metrics: Partial<PerformanceMetrics> = {}
  private isInitialized = false

  constructor() {
    this.init()
  }

  /**
   * 初始化性能监控
   */
  private init() {
    if (this.isInitialized || typeof window === 'undefined') return

    this.isInitialized = true
    
    // 监听页面加载性能
    this.observePageLoad()
    
    // 监听资源加载性能
    this.observeResourceTiming()
    
    // 监听用户交互性能
    this.observeUserInteractions()
    
    // 监听内存使用
    this.observeMemoryUsage()
    
    // 监听网络性能
    this.observeNetworkPerformance()
    
    // 定期收集性能数据
    this.startPeriodicCollection()
  }

  /**
   * 监听页面加载性能
   */
  private observePageLoad() {
    if (!('PerformanceObserver' in window)) return

    try {
      // 监听 Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.largestContentfulPaint = lastEntry.startTime
        this.reportMetric('LCP', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('lcp', lcpObserver)

      // 监听 First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime
          this.reportMetric('FID', this.metrics.firstInputDelay)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.set('fid', fidObserver)

      // 监听 Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })
        this.reportMetric('CLS', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('cls', clsObserver)

    } catch (error) {
      console.warn('性能监控初始化失败:', error)
    }
  }

  /**
   * 监听资源加载性能
   */
  private observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          const resourceEntry = entry as PerformanceResourceTiming
          this.trackResourceLoad(resourceEntry)
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.set('resource', resourceObserver)
    } catch (error) {
      console.warn('资源性能监控初始化失败:', error)
    }
  }

  /**
   * 监听用户交互性能
   */
  private observeUserInteractions() {
    if (!('PerformanceObserver' in window)) return

    try {
      const interactionObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          const interactionEntry = entry as PerformanceEventTiming
          this.trackUserInteraction(interactionEntry)
        })
      })
      interactionObserver.observe({ entryTypes: ['interaction'] })
      this.observers.set('interaction', interactionObserver)
    } catch (error) {
      console.warn('交互性能监控初始化失败:', error)
    }
  }

  /**
   * 监听内存使用
   */
  private observeMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize
      this.metrics.memoryLimit = memory.jsHeapSizeLimit
    }
  }

  /**
   * 监听网络性能
   */
  private observeNetworkPerformance() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        this.metrics.networkLatency = connection.rtt || 0
        this.metrics.bandwidth = connection.downlink || 0
      }
    }
  }

  /**
   * 开始定期收集性能数据
   */
  private startPeriodicCollection() {
    setInterval(() => {
      this.collectMetrics()
    }, 30000) // 每30秒收集一次
  }

  /**
   * 收集性能指标
   */
  private collectMetrics() {
    // 收集页面加载时间
    if (performance.timing) {
      const timing = performance.timing
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
    }

    // 收集 First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      this.metrics.firstContentfulPaint = fcpEntry.startTime
    }

    // 更新内存使用
    this.observeMemoryUsage()

    // 发送性能数据
    this.sendPerformanceData()
  }

  /**
   * 跟踪资源加载
   */
  private trackResourceLoad(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.startTime
    
    if (entry.initiatorType === 'img') {
      this.metrics.imageLoadTime = duration
    } else if (entry.initiatorType === 'script') {
      this.metrics.scriptLoadTime = duration
    }

    this.metrics.resourceLoadTime = duration

    // 记录慢资源
    if (duration > 3000) {
      this.reportSlowResource(entry.name, duration)
    }
  }

  /**
   * 跟踪用户交互
   */
  private trackUserInteraction(entry: PerformanceEventTiming) {
    this.metrics.interactionTime = entry.duration
    this.metrics.renderTime = entry.processingEnd - entry.processingStart

    // 记录慢交互
    if (entry.duration > 100) {
      this.reportSlowInteraction(entry.name, entry.duration)
    }
  }

  /**
   * 手动标记性能事件
   */
  mark(name: string, metadata?: Record<string, any>) {
    const startTime = performance.now()
    const event: PerformanceEvent = {
      name,
      startTime,
      endTime: 0,
      duration: 0,
      metadata
    }
    this.events.push(event)
    return event
  }

  /**
   * 结束性能事件标记
   */
  endMark(name: string) {
    const event = this.events.find(e => e.name === name && e.endTime === 0)
    if (event) {
      event.endTime = performance.now()
      event.duration = event.endTime - event.startTime
      
      // 记录慢事件
      if (event.duration > 100) {
        this.reportSlowEvent(name, event.duration)
      }
    }
  }

  /**
   * 测量函数执行时间
   * @returns a promise that resolves with the function's return value
   */
  async measureFunction<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      return await fn();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.reportMetric(name, duration);
      this.events.push({ name, startTime, endTime, duration });
    }
  }

  /**
   * 报告性能指标
   */
  private reportMetric(name: string, value: number) {
    console.log(`Performance Metric - ${name}:`, value)
    
    // 发送到分析服务
    this.sendMetric(name, value)
  }

  /**
   * 报告慢资源
   */
  private reportSlowResource(url: string, duration: number) {
    console.warn(`Slow Resource: ${url} took ${duration}ms`)
    this.sendMetric('slow_resource', duration, { url })
  }

  /**
   * 报告慢交互
   */
  private reportSlowInteraction(name: string, duration: number) {
    console.warn(`Slow Interaction: ${name} took ${duration}ms`)
    this.sendMetric('slow_interaction', duration, { name })
  }

  /**
   * 报告慢事件
   */
  private reportSlowEvent(name: string, duration: number) {
    console.warn(`Slow Event: ${name} took ${duration}ms`)
    this.sendMetric('slow_event', duration, { name })
  }

  /**
   * 发送性能指标到服务器
   */
  private sendMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metricData = {
      name,
      value,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // 发送到后端API
    fetch('/api/performance/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metricData)
    }).catch(console.error)
  }

  /**
   * 发送性能数据
   */
  private sendPerformanceData() {
    const data = {
      metrics: this.metrics,
      events: this.events,
      timestamp: Date.now(),
      url: window.location.href
    }

    fetch('/api/performance/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error)
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  /**
   * 获取性能事件
   */
  getEvents(): PerformanceEvent[] {
    return [...this.events]
  }

  /**
   * 清理资源
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.events = []
    this.isInitialized = false
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 导出便捷方法
export const mark = (name: string, metadata?: Record<string, any>) => 
  performanceMonitor.mark(name, metadata)

export const endMark = (name: string) => 
  performanceMonitor.endMark(name)

export const measureFunction = <T>(name: string, fn: () => T | Promise<T>) => 
  performanceMonitor.measureFunction(name, fn)

export const getPerformanceReport = () => 
  performanceMonitor.getPerformanceReport()

export const getEvents = () => 
  performanceMonitor.getEvents() 