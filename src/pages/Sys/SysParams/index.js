import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';

const SysParams = ({
  dispatch,
  sysParams: { pagination },
  loading,
  submiting,
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '键',
      dataIndex: 'sort',
    },
    {
      title: '值',
      dataIndex: 'name',
      hideInSearch: true,
      render: (value, record) => record.valueType == 'imgContent' ? '【请点击编辑查看】' : value
    },
    {
      title: '描述',
      dataIndex: 'url',
      ellipsis: true,
      hideInSearch: true,
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
      type: 'sysParams/service',
      service: 'update',
      payload: {
        id: fields.id,
        sort: fields.sort,
        name: fields.name,
        url: fields.url,
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
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return dispatch({ type: 'sysParams/query', payload: { ...params, pageNum: current } })
        }}
        postData={res => res.list}
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

export default connect(({ sysParams, loading }) => ({
  sysParams,
  loading: loading.effects['sysParams/query'],
  submiting: loading.effects['sysParams/service'],
}))(SysParams);
