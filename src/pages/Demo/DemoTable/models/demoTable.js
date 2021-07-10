import * as service_demoTable from '@/services/demo/demoTable';
export default {
  namespace: 'demoTable',

  state: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      const response = yield call(service_demoTable.query, { ...payload });
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
      const response = yield call(service_demoTable[service], payload);
      return response
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
