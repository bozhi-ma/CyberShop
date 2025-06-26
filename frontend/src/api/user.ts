/*
 * 用户相关API接口
 * 包含注册、登录、获取用户信息等
 */

import request from './request';

/**
 * 用户注册
 * @param data 注册表单数据
 * @returns Promise
 */
export function register(data: any) {
  return request.post('/user/register', data);
}

/**
 * 用户登录
 * @param data 登录表单数据
 * @returns Promise
 */
export function login(data: any) {
  return request.post('/user/login', data);
}

/**
 * 获取用户信息
 * @param id 用户ID
 * @returns Promise
 */
export function getUserInfo(id: number) {
  return request.get(`/user/${id}`);
}

/**
 * 更新用户资料
 * @param data 更新后的用户资料
 * @returns Promise
 */
export function updateProfile(data: any) {
  return request.post('/api/user/update', data);
} 