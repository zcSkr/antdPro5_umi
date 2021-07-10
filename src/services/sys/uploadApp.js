import request from '@/utils/request';

export async function query(params) {
  return request('/v2/app/app/update', { params });
}
export async function add(params) {
  return request('/v2/app/app/update', { method: 'POST', data: params });
}
export async function remove(params) {
  return request('/v2/app/app/update', { method: 'DELETE', params });
}