/*
 * 商品列表全局状态管理（Pinia）
 * 管理商品列表、商品详情等
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductList } from '../api/product'
import type { Product } from '../types/product'

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string;
  minRating?: number;
  keyword?: string;
}

export const useProductStore = defineStore('product', () => {
  // 商品列表ref
  const products = ref<Product[]>([])
  // 当前商品详情ref
  const productDetail = ref<Product | null>(null)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  async function fetchProducts(params: FetchProductsParams = {}) {
    const queryParams = {
      page: params.page || page.value,
      limit: params.limit || pageSize.value,
      sortBy: params.sortBy,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      categories: params.categories,
      minRating: params.minRating,
      keyword: params.keyword
    };

    const res = await getProductList(queryParams);
    products.value = res.list;
    total.value = res.total;
    page.value = queryParams.page;
    pageSize.value = queryParams.limit;
  }

  /**
   * 设置商品列表
   * @param list 商品数组
   */
  function setProductList(list: Product[]) {
    products.value = list
  }

  /**
   * 设置商品详情
   * @param detail 商品详情对象
   */
  function setProductDetail(detail: Product | null) {
    productDetail.value = detail
  }

  return { products, total, page, pageSize, fetchProducts, setProductList, setProductDetail }
}) 