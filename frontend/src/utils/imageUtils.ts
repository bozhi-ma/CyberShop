/**
 * 图片工具类
 * 提供图片处理、默认图片获取、图片验证等功能
 */

// 默认图片映射
const DEFAULT_IMAGES: Record<string, string> = {
  // 新的英文类别
  'beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
  'fragrances': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
  'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
  'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
  'home-decoration': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  'kitchen-accessories': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'laptops': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'mens-shirts': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
  'mens-shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
  'mens-watches': 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
  'mobile-accessories': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  
  // 保留原有的中文类别映射（向后兼容）
  '手机': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  '笔记本': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  '耳机': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
  '平板': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  '相机': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  '游戏': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop',
  '智能手表': 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
  '无人机': 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400&h=400&fit=crop',
  
  // 其他通用类别
  'digital': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
  'computer': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'appliance': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
  'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
};

// 通用默认图片
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';

/**
 * 根据商品分类获取默认图片
 * @param category 商品分类
 * @returns 默认图片URL
 */
export function getDefaultImage(category?: string): string {
  if (!category) return FALLBACK_IMAGE;
  return DEFAULT_IMAGES[category] || FALLBACK_IMAGE;
}

/**
 * 验证图片URL是否有效
 * @param url 图片URL
 * @returns Promise<boolean>
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * 获取图片加载状态
 * @param url 图片URL
 * @returns Promise<{success: boolean, url: string}>
 */
export function loadImage(url: string): Promise<{success: boolean, url: string}> {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ success: false, url: FALLBACK_IMAGE });
      return;
    }

    const img = new Image();
    img.onload = () => resolve({ success: true, url });
    img.onerror = () => resolve({ success: false, url: FALLBACK_IMAGE });
    img.src = url;
  });
}

/**
 * 批量验证图片URL
 * @param urls 图片URL数组
 * @returns Promise<{url: string, valid: boolean}[]>
 */
export async function validateImageUrls(urls: string[]): Promise<{url: string, valid: boolean}[]> {
  const results = await Promise.all(
    urls.map(async (url) => ({
      url,
      valid: await validateImageUrl(url)
    }))
  );
  return results;
}

/**
 * 获取图片尺寸
 * @param url 图片URL
 * @returns Promise<{width: number, height: number} | null>
 */
export function getImageDimensions(url: string): Promise<{width: number, height: number} | null> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * 生成缩略图URL（适用于Unsplash）
 * @param url 原始图片URL
 * @param width 宽度
 * @param height 高度
 * @returns 缩略图URL
 */
export function generateThumbnailUrl(url: string, width: number = 400, height: number = 400): string {
  if (!url) return FALLBACK_IMAGE;
  
  // 如果是Unsplash图片，添加参数
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&h=${height}&fit=crop`;
  }
  
  return url;
}

/**
 * 图片预加载
 * @param urls 图片URL数组
 * @returns Promise<void>
 */
export function preloadImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });
  });
  
  return Promise.all(promises).then(() => {});
}

/**
 * 获取所有默认图片URL
 * @returns 默认图片URL数组
 */
export function getAllDefaultImages(): string[] {
  return Object.values(DEFAULT_IMAGES);
}

/**
 * 检查是否为有效的图片格式
 * @param url 图片URL
 * @returns boolean
 */
export function isValidImageFormat(url: string): boolean {
  if (!url) return false;
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  
  return validExtensions.some(ext => urlLower.includes(ext)) || 
         urlLower.includes('unsplash.com') ||
         urlLower.includes('images.unsplash.com');
} 