import * as service_oss from '@/services/oss';
export default {
  namespace: 'oss',
  state: {},
  effects: {
    *getSTSInfo({ payload }, { select, call, put }) {
      const response = yield call(service_oss.getSTSInfo);
      return response
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  },
};
