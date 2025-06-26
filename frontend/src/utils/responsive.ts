/*
 * 响应式工具函数集合
 * 提供断点、设备检测、动态样式等功能
 */

// 响应式断点定义
export const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1200,
  xl: 1920
} as const;

// 断点类型
export type Breakpoint = keyof typeof BREAKPOINTS;

// 响应式工具类
export class ResponsiveUtils {
  private static instance: ResponsiveUtils;
  private currentBreakpoint: Breakpoint = 'lg';
  private listeners: Array<(breakpoint: Breakpoint) => void> = [];

  private constructor() {
    this.init();
  }

  static getInstance(): ResponsiveUtils {
    if (!ResponsiveUtils.instance) {
      ResponsiveUtils.instance = new ResponsiveUtils();
    }
    return ResponsiveUtils.instance;
  }

  private init() {
    this.updateBreakpoint();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    const newBreakpoint = this.calculateCurrentBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.notifyListeners();
    }
  }

  private calculateCurrentBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    
    if (width < BREAKPOINTS.xs) return 'xs';
    if (width < BREAKPOINTS.sm) return 'sm';
    if (width < BREAKPOINTS.md) return 'md';
    if (width < BREAKPOINTS.lg) return 'lg';
    return 'xl';
  }

  private updateBreakpoint() {
    this.currentBreakpoint = this.calculateCurrentBreakpoint();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentBreakpoint));
  }

  // 获取当前断点
  getCurrentBreakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }

  // 检查是否大于指定断点
  isGreaterThan(breakpoint: Breakpoint): boolean {
    const currentIndex = Object.keys(BREAKPOINTS).indexOf(this.currentBreakpoint);
    const targetIndex = Object.keys(BREAKPOINTS).indexOf(breakpoint);
    return currentIndex > targetIndex;
  }

  // 检查是否小于指定断点
  isLessThan(breakpoint: Breakpoint): boolean {
    const currentIndex = Object.keys(BREAKPOINTS).indexOf(this.currentBreakpoint);
    const targetIndex = Object.keys(BREAKPOINTS).indexOf(breakpoint);
    return currentIndex < targetIndex;
  }

  // 检查是否等于指定断点
  isEqualTo(breakpoint: Breakpoint): boolean {
    return this.currentBreakpoint === breakpoint;
  }

  // 检查是否在指定断点范围内
  isBetween(min: Breakpoint, max: Breakpoint): boolean {
    return this.isGreaterThan(min) && this.isLessThan(max);
  }

  // 添加断点变化监听器
  addListener(listener: (breakpoint: Breakpoint) => void) {
    this.listeners.push(listener);
  }

  // 移除断点变化监听器
  removeListener(listener: (breakpoint: Breakpoint) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 获取屏幕尺寸信息
  getScreenInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      breakpoint: this.currentBreakpoint,
      isMobile: this.isLessThan('md'),
      isTablet: this.isBetween('sm', 'lg'),
      isDesktop: this.isGreaterThan('md'),
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  }

  // 销毁实例
  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.listeners = [];
  }
}

// 响应式组合式函数
import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsive() {
  const responsive = ResponsiveUtils.getInstance();
  const currentBreakpoint = ref<Breakpoint>(responsive.getCurrentBreakpoint());
  const screenInfo = ref(responsive.getScreenInfo());

  const updateInfo = () => {
    currentBreakpoint.value = responsive.getCurrentBreakpoint();
    screenInfo.value = responsive.getScreenInfo();
  };

  onMounted(() => {
    responsive.addListener(updateInfo);
  });

  onUnmounted(() => {
    responsive.removeListener(updateInfo);
  });

  return {
    currentBreakpoint,
    screenInfo,
    isGreaterThan: responsive.isGreaterThan.bind(responsive),
    isLessThan: responsive.isLessThan.bind(responsive),
    isEqualTo: responsive.isEqualTo.bind(responsive),
    isBetween: responsive.isBetween.bind(responsive)
  };
}

// 响应式工具函数
export const responsiveUtils = {
  // 获取设备类型
  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < BREAKPOINTS.sm) return 'mobile';
    if (width < BREAKPOINTS.lg) return 'tablet';
    return 'desktop';
  },

  // 检查是否为移动设备
  isMobile(): boolean {
    return window.innerWidth < BREAKPOINTS.sm;
  },

  // 检查是否为平板设备
  isTablet(): boolean {
    return window.innerWidth >= BREAKPOINTS.sm && window.innerWidth < BREAKPOINTS.lg;
  },

  // 检查是否为桌面设备
  isDesktop(): boolean {
    return window.innerWidth >= BREAKPOINTS.lg;
  },

  // 检查是否为触摸设备
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // 获取视口尺寸
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },

  // 检查是否为横屏
  isLandscape(): boolean {
    return window.innerWidth > window.innerHeight;
  },

  // 检查是否为竖屏
  isPortrait(): boolean {
    return window.innerHeight > window.innerWidth;
  },

  // 获取像素密度
  getPixelRatio(): number {
    return window.devicePixelRatio || 1;
  },

  // 检查是否支持高分辨率显示
  isHighDPI(): boolean {
    return this.getPixelRatio() > 1;
  },

  // 获取安全区域信息（用于移动设备）
  getSafeArea() {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0'),
      right: parseInt(style.getPropertyValue('--sar') || '0'),
      bottom: parseInt(style.getPropertyValue('--sab') || '0'),
      left: parseInt(style.getPropertyValue('--sal') || '0')
    };
  },

  // 设置CSS变量
  setCSSVariables() {
    const root = document.documentElement;
    const { width, height } = this.getViewportSize();
    const deviceType = this.getDeviceType();
    const isTouch = this.isTouchDevice();
    const pixelRatio = this.getPixelRatio();

    root.style.setProperty('--viewport-width', `${width}px`);
    root.style.setProperty('--viewport-height', `${height}px`);
    root.style.setProperty('--device-type', deviceType);
    root.style.setProperty('--is-touch', isTouch ? '1' : '0');
    root.style.setProperty('--pixel-ratio', pixelRatio.toString());
  }
};

// 响应式媒体查询工具
export const mediaQueries = {
  xs: `@media (max-width: ${BREAKPOINTS.xs - 1}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.xs}px) and (max-width: ${BREAKPOINTS.sm - 1}px)`,
  md: `@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  
  // 向上断点
  smUp: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  mdUp: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  lgUp: `@media (min-width: ${BREAKPOINTS.md}px)`,
  xlUp: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  
  // 向下断点
  xsDown: `@media (max-width: ${BREAKPOINTS.xs - 1}px)`,
  smDown: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  mdDown: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  lgDown: `@media (max-width: ${BREAKPOINTS.lg - 1}px)`,
  
  // 特殊查询
  touch: '@media (hover: none) and (pointer: coarse)',
  noTouch: '@media (hover: hover) and (pointer: fine)',
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)'
};

// 响应式类名生成器
export const responsiveClasses = {
  // 隐藏类
  hidden: {
    xs: 'hidden-xs',
    sm: 'hidden-sm',
    md: 'hidden-md',
    lg: 'hidden-lg',
    xl: 'hidden-xl'
  },
  
  // 显示类
  visible: {
    xs: 'visible-xs',
    sm: 'visible-sm',
    md: 'visible-md',
    lg: 'visible-lg',
    xl: 'visible-xl'
  },
  
  // 网格类
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    cols6: 'grid-cols-6',
    cols12: 'grid-cols-12'
  },
  
  // 间距类
  spacing: {
    p0: 'p-0',
    p1: 'p-1',
    p2: 'p-2',
    p3: 'p-3',
    p4: 'p-4',
    p5: 'p-5',
    m0: 'm-0',
    m1: 'm-1',
    m2: 'm-2',
    m3: 'm-3',
    m4: 'm-4',
    m5: 'm-5'
  }
};

// 导出默认实例
export default ResponsiveUtils.getInstance(); 