import request from '@/utils/request';

export async function query(params) {
  return request('/business/helpTypeList', { params });
}
export async function add(params) {
  return request('/business/helpTypeEdit', { method: 'POST', data: params });
}
export async function update(params) {
  return request('/business/helpTypeEdit', { method: 'POST', data: params });
}
export async function remove(params) {
  return request('/business/helpTypeDel', { method: 'DELETE', params });
}

// 问题列表
export async function queryQuestion(params) {
  return request('/business/helpInfoList', { params });
}
export async function addQuestion(params) {
  return request('/business/helpInfoEdit', { method: 'POST', data: params });
}
export async function updateQuestion(params) {
  return request('/business/helpInfoEdit', { method: 'POST', data: params });
}
export async function removeQuestion(params) {
  return request('/business/helpInfoDel', { method: 'DELETE', params });
}