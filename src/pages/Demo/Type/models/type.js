import * as service_type from '@/services/demo/demoTable';
export default {
  namespace: 'type',

  state: {
    list: [],
    pagination1: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    list2: [],
    pagination2: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    list3: [],
    pagination3: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      const response = yield call(service_type.query, { ...payload });
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            list: response.data.list,
            pagination1: {
              current: response.data.pageNum,
              pageSize: response.data.pageSize,
              total: response.data.total,
            },
          },
        });
      }
      return response
    },
    *queryLevel2({ payload }, { select, call, put }) {
      const response = yield call(service_type.query, { ...payload });
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            list2: response.data.list,
            pagination2: {
              current: response.data.pageNum,
              pageSize: response.data.pageSize,
              total: response.data.total,
            },
          },
        });
      }
      return response
    },
    *queryLevel3({ payload }, { select, call, put }) {
      const response = yield call(service_type.query, { ...payload });
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            list3: response.data.list,
            pagination3: {
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
      const response = yield call(service_type[service], payload);
      return response
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
