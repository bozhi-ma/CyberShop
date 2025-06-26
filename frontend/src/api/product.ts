/**
 * 商品相关API接口
 * 包含获取商品列表、商品详情、添加商品等
 */

import request from './request';

/**
 * 获取商品列表
 * @param page 页码
 * @param pageSize 每页数量
 * @returns Promise
 */
export async function getProductList(params: any) {
  const response = await request.get('/products', { params });
  return response.data;
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise
 */
export async function getProductDetail(id: number) {
  const response = await request.get(`/products/${id}`);
  return response.data;
}

/**
 * 添加商品
 * @param data 商品数据
 * @returns Promise
 */
export async function addProduct(data: any) {
  const response = await request.post('/products', data);
  return response.data;
}

/**
 * 搜索商品
 * @param keyword 关键词
 * @param page 页码
 * @param pageSize 每页数量
 * @returns Promise
 */
export async function searchProducts(keyword: string, page = 1, pageSize = 12) {
  const response = await request.get('/products', {
    params: {
      keyword,
      page,
      limit: pageSize
    }
  });
  return response.data;
} 