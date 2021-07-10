import * as service_helpCenter from '@/services/demo/helpCenter';
export default {
  namespace: 'helpCenter',

  state: {
    list: []
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      const response = yield call(service_helpCenter.query, { ...payload });
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            list: response.data,
          },
        });
      }
      return response;
    },
    *queryQuestion({ payload }, { select, call, put }) {
      const response = yield call(service_helpCenter.queryQuestion, { ...payload });
      return response;
    },
    *service({ payload, service }, { select, call, put }) {
      const response = yield call(service_helpCenter[service], payload);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
