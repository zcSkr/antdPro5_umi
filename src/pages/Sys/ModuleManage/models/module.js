import * as service_module from '@/services/sys/module';
export default {
  namespace: 'module',

  state: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      const response = yield call(service_module.queryTree, { ...payload });
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            pagination: {
              current: response.data.pageNum,
              pageSize: response.data.pageSize,
              total: response.data.total,
            },
          },
        });
      }
      return response
    },
    *service({ payload, service }, { select, call, put }) {
      const response = yield call(service_module[service], payload);
      return response
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
