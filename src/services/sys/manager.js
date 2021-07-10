import request from '@/utils/request';



export async function query(params) {
  return request('/mock/demo', { params });
}
export async function add(params) {
  return request('/mock/demo', { method: 'POST', data: params });
}
export async function update(params) {
  return request('/mock/demo', { method: 'PUT', data: params });
}
export async function remove(params) {
  return request('/mock/demo', { method: 'DELETE', params });
}


export async function updatePsd(params) {
  return request('/mock/demo', { method: 'PUT', data: params });
}


// 以下是正常项目标准接口
// export async function query(params) {
//   return request('/v2/sub/administrator', { params });
// }
// export async function add(params) {
//   return request('/v2/sub/administrator', { method: 'POST', data: params });
// }
// export async function update(params) {
//   return request('/v2/sub/administrator', { method: 'PUT', data: params });
// }
// export async function remove(params) {
//   return request('/v2/sub/administrator', { method: 'DELETE', params });
// }


// export async function updatePsd(params) {
//   return request('/v2/sub/administrator', { method: 'PUT', data: params });
// }