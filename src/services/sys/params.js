import request from '@/utils/request';


export async function query(params) {
  return request('/mock/demo', { params });
}
export async function update(params) {
  return request('/mock/demo', { method: 'PUT', data: params });
}

// 以下是正常项目标准接口

// export async function query(params) {
//   return request('/v2/code/sys', { params });
// }
// export async function update(params) {
//   return request('/v2/code/sys', { method: 'PUT', data: params });
// }