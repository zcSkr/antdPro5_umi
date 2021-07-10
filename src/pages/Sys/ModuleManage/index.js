import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';


const ModuleManage = ({
  dispatch,
  module: { pagination },
  loading,
  submiting,
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: '模块名称',
      dataIndex: 'moduleName',
    },
    {
      title: '请求路径',
      dataIndex: 'requestUrl',
    },
    {
      title: '排序',
      dataIndex: 'number',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (val, record) => record.createTime,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>,
    },
  ];

  const handleUpdate = (fields) => {
    const hide = message.loading('操作中');
    dispatch({
      type: 'module/service',
      service: fields.id ? 'update' : 'add',
      payload: {
        id: fields.id,
        pid: fields.pid,
        moduleName: fields.moduleName,
        requestUrl: fields.requestUrl,
        number: fields.number,
        description: fields.description,
      }
    }).then(res => {
      hide();
      if (res?.code == 200) {
        message.success('操作成功');
        handleUpdateModalVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.msg);
      }
    })
  };

  return (
    <PageContainer>
      <StandardTable
        loading={loading}
        actionRef={actionRef}
        search={false}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return dispatch({ type: 'module/query', payload: { ...params, pageNum: current } })
        }}
        postData={res => res.modules.map(item => ({ ...item, children: item.sonModuleList.length ? item.sonModuleList : undefined }))}
        columns={columns}
        pagination={pagination}
      />
      <GlobalModal
        visible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
          submiting={submiting}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default connect(({ module, loading }) => ({
  module,
  loading: loading.effects['module/query'],
  submiting: loading.effects['module/service'],
}))(ModuleManage);
