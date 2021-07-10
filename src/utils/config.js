export const requestUrl = 'https://www.ssbpt.com/bg'
export const fileUrl = 'https://cdmaicaiwang.com/clz/'
export const uploadUrl = 'https://cdmaicaiwang.com/clz/sys/file/uploadFile'
export const ossHost = 'https://bg-edu.oss-cn-chengdu.aliyuncs.com'
export const ossSuffix = '?x-oss-process=video/snapshot,t_1000,m_fast' //oss视频链接拼接此后缀即为视频封面图
export const getToken = () => {
  try {
    return sessionStorage.token
  } catch (e) { }
  return null;
}
export const setToken = token => {
  try {
    return sessionStorage.token = token
  } catch (e) { }
  return null;
}
export const getUnionuser = () => {
  try {
    return sessionStorage.unionuser ? JSON.parse(sessionStorage.unionuser) : null
  } catch (e) { }
  return null;
}
export const setUnionuser = unionuser => {
  try {
    return sessionStorage.unionuser = JSON.stringify(unionuser)
  } catch (e) { }
  return null;
}