import request from '@/utils/request';

export async function login(params) {
  return request('/mock/login', { method: 'POST', data: params });
}