/*
 * 响应式自定义指令
 * 用于实现元素的响应式行为和样式
 */

import type { Directive, DirectiveBinding } from 'vue';
import { ResponsiveUtils, type Breakpoint } from '../utils/responsive';

// 响应式指令类型
type ResponsiveClasses = {
  [key in Breakpoint]?: string | string[];
};

// 响应式指令
export const responsive: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ResponsiveClasses>) {
    const responsive = ResponsiveUtils.getInstance();
    
    // 应用初始类名
    applyResponsiveClasses(el, binding.value, responsive.getCurrentBreakpoint());
    
    // 监听断点变化
    const updateClasses = (breakpoint: Breakpoint) => {
      applyResponsiveClasses(el, binding.value, breakpoint);
    };
    
    responsive.addListener(updateClasses);
    
    // 存储监听器引用，用于清理
    el._responsiveListener = updateClasses;
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<ResponsiveClasses>) {
    const responsive = ResponsiveUtils.getInstance();
    applyResponsiveClasses(el, binding.value, responsive.getCurrentBreakpoint());
  },
  
  unmounted(el: HTMLElement) {
    const responsive = ResponsiveUtils.getInstance();
    if (el._responsiveListener) {
      responsive.removeListener(el._responsiveListener);
      delete el._responsiveListener;
    }
  }
};

// 应用响应式类名
function applyResponsiveClasses(
  el: HTMLElement, 
  classes: ResponsiveClasses, 
  currentBreakpoint: Breakpoint
) {
  if (!classes) return;
  
  // 清除之前的响应式类名
  el.classList.remove(...getAllResponsiveClasses(classes));
  
  // 应用当前断点的类名
  const currentClasses = classes[currentBreakpoint];
  if (currentClasses) {
    const classArray = Array.isArray(currentClasses) ? currentClasses : [currentClasses];
    el.classList.add(...classArray);
  }
  
  // 应用小于当前断点的类名
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpoints.indexOf(currentBreakpoint);
  
  for (let i = 0; i <= currentIndex; i++) {
    const breakpoint = breakpoints[i] as Breakpoint;
    const breakpointClasses = classes[breakpoint];
    if (breakpointClasses) {
      const classArray = Array.isArray(breakpointClasses) ? breakpointClasses : [breakpointClasses];
      el.classList.add(...classArray);
    }
  }
}

// 获取所有响应式类名
function getAllResponsiveClasses(classes: ResponsiveClasses): string[] {
  const allClasses: string[] = [];
  
  Object.values(classes).forEach(classValue => {
    if (classValue) {
      const classArray = Array.isArray(classValue) ? classValue : [classValue];
      allClasses.push(...classArray);
    }
  });
  
  return allClasses;
}

// 隐藏指令
export const hide: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Breakpoint | Breakpoint[]>) {
    const responsive = ResponsiveUtils.getInstance();
    
    const checkVisibility = (breakpoint: Breakpoint) => {
      const hideBreakpoints = Array.isArray(binding.value) ? binding.value : [binding.value];
      const shouldHide = hideBreakpoints.includes(breakpoint);
      
      if (shouldHide) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    };
    
    checkVisibility(responsive.getCurrentBreakpoint());
    
    const updateVisibility = (breakpoint: Breakpoint) => {
      checkVisibility(breakpoint);
    };
    
    responsive.addListener(updateVisibility);
    el._hideListener = updateVisibility;
  },
  
  unmounted(el: HTMLElement) {
    const responsive = ResponsiveUtils.getInstance();
    if (el._hideListener) {
      responsive.removeListener(el._hideListener);
      delete el._hideListener;
    }
  }
};

// 显示指令
export const show: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Breakpoint | Breakpoint[]>) {
    const responsive = ResponsiveUtils.getInstance();
    
    const checkVisibility = (breakpoint: Breakpoint) => {
      const showBreakpoints = Array.isArray(binding.value) ? binding.value : [binding.value];
      const shouldShow = showBreakpoints.includes(breakpoint);
      
      if (shouldShow) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    };
    
    checkVisibility(responsive.getCurrentBreakpoint());
    
    const updateVisibility = (breakpoint: Breakpoint) => {
      checkVisibility(breakpoint);
    };
    
    responsive.addListener(updateVisibility);
    el._showListener = updateVisibility;
  },
  
  unmounted(el: HTMLElement) {
    const responsive = ResponsiveUtils.getInstance();
    if (el._showListener) {
      responsive.removeListener(el._showListener);
      delete el._showListener;
    }
  }
};

// 条件渲染指令
export const ifResponsive: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<{
    condition: (breakpoint: Breakpoint) => boolean;
    fallback?: string;
  }>) {
    const responsive = ResponsiveUtils.getInstance();
    
    const checkCondition = (breakpoint: Breakpoint) => {
      const shouldShow = binding.value.condition(breakpoint);
      
      if (shouldShow) {
        el.style.display = '';
      } else {
        el.style.display = binding.value.fallback || 'none';
      }
    };
    
    checkCondition(responsive.getCurrentBreakpoint());
    
    const updateCondition = (breakpoint: Breakpoint) => {
      checkCondition(breakpoint);
    };
    
    responsive.addListener(updateCondition);
    el._ifResponsiveListener = updateCondition;
  },
  
  unmounted(el: HTMLElement) {
    const responsive = ResponsiveUtils.getInstance();
    if (el._ifResponsiveListener) {
      responsive.removeListener(el._ifResponsiveListener);
      delete el._ifResponsiveListener;
    }
  }
};

// 网格指令
export const grid: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<{
    [key in Breakpoint]?: number;
  }>) {
    const responsive = ResponsiveUtils.getInstance();
    
    const updateGrid = (breakpoint: Breakpoint) => {
      const columns = binding.value[breakpoint];
      if (columns) {
        el.style.display = 'grid';
        el.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      }
    };
    
    updateGrid(responsive.getCurrentBreakpoint());
    
    const updateGridColumns = (breakpoint: Breakpoint) => {
      updateGrid(breakpoint);
    };
    
    responsive.addListener(updateGridColumns);
    el._gridListener = updateGridColumns;
  },
  
  unmounted(el: HTMLElement) {
    const responsive = ResponsiveUtils.getInstance();
    if (el._gridListener) {
      responsive.removeListener(el._gridListener);
      delete el._gridListener;
    }
  }
};

// 导出所有指令
export const responsiveDirectives = {
  responsive,
  hide,
  show,
  ifResponsive,
  grid
};

// 扩展HTMLElement类型
declare global {
  interface HTMLElement {
    _responsiveListener?: (breakpoint: Breakpoint) => void;
    _hideListener?: (breakpoint: Breakpoint) => void;
    _showListener?: (breakpoint: Breakpoint) => void;
    _ifResponsiveListener?: (breakpoint: Breakpoint) => void;
    _gridListener?: (breakpoint: Breakpoint) => void;
  }
} 