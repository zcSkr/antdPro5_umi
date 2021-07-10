import * as service_uploadApp from '@/services/sys/uploadApp';
export default {
  namespace: 'uploadApp',

  state: {
    list: [],
    pagination: {
      current: 1,
      pagSize: 10,
      total: 0
    },
  },
  effects: {
    *query({ payload }, { select, call, put }) {
      const { list, pagination } = yield select(store => store.uploadApp)
      const { current, pageSize } = pagination
      const response = yield call(service_uploadApp.query, { pageNum: current, pageSize, ...payload });
      // console.log(response)
      if (response?.code == 200) {
        yield put({
          type: 'save',
          payload: {
            list: payload?.pageNum > 1 ? list.concat(response.data.list) : response.data.list,
            pagination: {
              current: response.data.pageNum,
              pageSize: response.data.pageSize,
              total: response.data.total
            }
          },
        });
      }
      return response;
    },
    *service({ payload, service }, { select, call, put }) {
      console.log(payload)
      const response = yield call(service_uploadApp[service], payload);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
