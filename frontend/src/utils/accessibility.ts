/**
 * 无障碍访问工具函数
 * 提供键盘导航、焦点管理、屏幕阅读器支持等功能
 */

/**
 * 焦点管理类
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = [];
  private currentIndex = 0;

  /**
   * 获取所有可聚焦的元素
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return Array.from(container.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];
  }

  /**
   * 设置焦点循环
   */
  setupFocusTrap(container: HTMLElement): void {
    this.focusableElements = this.getFocusableElements(container);
    
    if (this.focusableElements.length === 0) return;

    // 设置第一个元素为焦点
    this.focusableElements[0].focus();
    this.currentIndex = 0;

    // 监听键盘事件
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        
        if (event.shiftKey) {
          this.focusPrevious();
        } else {
          this.focusNext();
        }
      } else if (event.key === 'Escape') {
        // 关闭模态框或菜单
        this.closeModal(container);
      }
    };

    container.addEventListener('keydown', handleKeydown);
    
    // 保存清理函数
    container.dataset.focusTrapCleanup = 'true';
  }

  /**
   * 聚焦下一个元素
   */
  focusNext(): void {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex].focus();
  }

  /**
   * 聚焦上一个元素
   */
  focusPrevious(): void {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = this.currentIndex === 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1;
    this.focusableElements[this.currentIndex].focus();
  }

  /**
   * 关闭模态框
   */
  private closeModal(container: HTMLElement): void {
    // 触发关闭事件
    const closeEvent = new CustomEvent('close-modal', { bubbles: true });
    container.dispatchEvent(closeEvent);
  }

  /**
   * 清理焦点陷阱
   */
  cleanup(container: HTMLElement): void {
    if (container.dataset.focusTrapCleanup) {
      delete container.dataset.focusTrapCleanup;
    }
  }
}

/**
 * 屏幕阅读器通知工具
 */
export class ScreenReader {
  private notificationContainer: HTMLElement | null = null;

  /**
   * 初始化通知容器
   */
  init(): void {
    this.notificationContainer = document.getElementById('notifications');
    if (!this.notificationContainer) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'notifications';
      this.notificationContainer.setAttribute('role', 'status');
      this.notificationContainer.setAttribute('aria-live', 'polite');
      this.notificationContainer.setAttribute('aria-atomic', 'true');
      this.notificationContainer.className = 'sr-only';
      document.body.appendChild(this.notificationContainer);
    }
  }

  /**
   * 发送通知给屏幕阅读器
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.notificationContainer) {
      this.init();
    }

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.setAttribute('aria-live', priority);
    
    this.notificationContainer!.appendChild(notification);
    
    // 清理通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 1000);
  }

  /**
   * 更新页面标题
   */
  updatePageTitle(title: string): void {
    document.title = title;
    this.announce(`页面标题已更新为：${title}`);
  }

  /**
   * 更新页面描述
   */
  updatePageDescription(description: string): void {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }
}

/**
 * 键盘导航工具
 */
export class KeyboardNavigation {
  /**
   * 设置箭头键导航
   */
  static setupArrowNavigation(
    container: HTMLElement,
    selector: string,
    onSelect?: (element: HTMLElement) => void
  ): void {
    const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    let currentIndex = -1;

    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (!target.matches(selector)) return;

      const index = elements.indexOf(target);
      if (index === -1) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          currentIndex = (index + 1) % elements.length;
          elements[currentIndex].focus();
          if (onSelect) onSelect(elements[currentIndex]);
          break;
        
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          currentIndex = index === 0 ? elements.length - 1 : index - 1;
          elements[currentIndex].focus();
          if (onSelect) onSelect(elements[currentIndex]);
          break;
        
        case 'Home':
          event.preventDefault();
          currentIndex = 0;
          elements[currentIndex].focus();
          if (onSelect) onSelect(elements[currentIndex]);
          break;
        
        case 'End':
          event.preventDefault();
          currentIndex = elements.length - 1;
          elements[currentIndex].focus();
          if (onSelect) onSelect(elements[currentIndex]);
          break;
      }
    };

    container.addEventListener('keydown', handleKeydown);
  }

  /**
   * 设置回车键和空格键激活
   */
  static setupActivation(
    container: HTMLElement,
    selector: string,
    onActivate: (element: HTMLElement) => void
  ): void {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (!target.matches(selector)) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate(target);
      }
    };

    container.addEventListener('keydown', handleKeydown);
  }
}

/**
 * 颜色对比度检查工具
 */
export class ColorContrast {
  /**
   * 计算颜色对比度
   */
  static getContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 计算颜色亮度
   */
  private static getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const { r, g, b } = rgb;
    
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rL = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gL = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bL = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
  }

  /**
   * 十六进制颜色转RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * 检查对比度是否满足WCAG标准
   */
  static meetsWCAG(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA', size: 'normal' | 'large' = 'normal'): boolean {
    const ratio = this.getContrastRatio(color1, color2);
    
    if (level === 'AA') {
      return size === 'large' ? ratio >= 3 : ratio >= 4.5;
    } else {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }
  }
}

/**
 * 无障碍访问检查工具
 */
export class AccessibilityChecker {
  /**
   * 检查图片是否有alt属性
   */
  static checkImages(): { element: HTMLImageElement; issue: string }[] {
    const images = document.querySelectorAll('img');
    const issues: { element: HTMLImageElement; issue: string }[] = [];

    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push({ element: img, issue: '缺少alt属性或aria-label' });
      }
    });

    return issues;
  }

  /**
   * 检查表单元素是否有标签
   */
  static checkFormLabels(): { element: HTMLElement; issue: string }[] {
    const formElements = document.querySelectorAll('input, select, textarea');
    const issues: { element: HTMLElement; issue: string }[] = [];

    formElements.forEach(element => {
      const input = element as HTMLInputElement;
      const id = input.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) as HTMLLabelElement | null : null;
      const ariaLabel = input.getAttribute('aria-label');
      const placeholder = input.placeholder;

      if (!label && !ariaLabel && !placeholder) {
        issues.push({ element: input, issue: '缺少标签、aria-label或placeholder' });
      }
    });

    return issues;
  }

  /**
   * 检查按钮是否有可识别的文本
   */
  static checkButtons(): { element: HTMLButtonElement; issue: string }[] {
    const buttons = document.querySelectorAll('button');
    const issues: { element: HTMLButtonElement; issue: string }[] = [];

    buttons.forEach(button => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const title = button.getAttribute('title');

      if (!text && !ariaLabel && !title) {
        issues.push({ element: button, issue: '缺少可识别的文本' });
      }
    });

    return issues;
  }

  /**
   * 生成无障碍访问报告
   */
  static generateReport(): {
    images: { element: HTMLImageElement; issue: string }[];
    forms: { element: HTMLElement; issue: string }[];
    buttons: { element: HTMLButtonElement; issue: string }[];
    totalIssues: number;
  } {
    const images = this.checkImages();
    const forms = this.checkFormLabels();
    const buttons = this.checkButtons();
    const totalIssues = images.length + forms.length + buttons.length;

    return {
      images,
      forms,
      buttons,
      totalIssues
    };
  }
}

/**
 * 导出工具实例
 */
export const focusManager = new FocusManager();
export const screenReader = new ScreenReader();

/**
 * 初始化无障碍访问功能
 */
export function initAccessibility(): void {
  // 初始化屏幕阅读器
  screenReader.init();
  
  // 设置页面语言
  document.documentElement.lang = 'zh-CN';
  
  // 添加无障碍访问相关的meta标签
  if (!document.querySelector('meta[name="accessibility"]')) {
    const meta = document.createElement('meta');
    meta.name = 'accessibility';
    meta.content = 'accessible';
    document.head.appendChild(meta);
  }
  
  // 监听路由变化，更新页面标题
  const updatePageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/': 'CyberShop - 首页',
      '/products': 'CyberShop - 商品列表',
      '/analysis': 'CyberShop - 数据分析',
      '/compare': 'CyberShop - 商品对比',
      '/ar': 'CyberShop - AR试用',
      '/user': 'CyberShop - 用户中心',
      '/login': 'CyberShop - 登录',
      '/register': 'CyberShop - 注册'
    };
    
    const title = titles[path] || 'CyberShop - 未来购物体验';
    screenReader.updatePageTitle(title);
  };
  
  // 初始页面标题
  updatePageTitle(window.location.pathname);
  
  // 监听popstate事件（浏览器前进后退）
  window.addEventListener('popstate', () => {
    updatePageTitle(window.location.pathname);
  });
} 