import request from '@/utils/request';

export async function query(params) {
  return request('/mock/demo', { params });
}

// 默认表单提交，post将参数写在data里，get将参数写在params里面
export async function add(params) {
  return request('/mock/demo', { method: 'POST', data: params });
}
// json提交，传requestType: 'json', 去看文档https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
export async function add_json(params) {
  return request('/mock/demo', { method: 'POST', data: params, requestType: 'json' });
}

export async function update(params) {
  return request('/mock/demo', { method: 'PUT', data: params });
}

export async function remove(params) {
  return request('/mock/demo', { method: 'DELETE', params });
}