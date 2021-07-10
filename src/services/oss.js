import request from '@/utils/request';

// 获取STS认证信息
export async function getSTSInfo(params) {
  return request('/common/api/getOssInfo', { params })
}