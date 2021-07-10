import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';

const RoleManage = ({ 
  dispatch,
  role: { pagination },
  loading,
  submiting,
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [moduleTreeList, setModuleTreeList] = useState([])
  useEffect(() => {
    dispatch({
      type: 'module/service',
      service: 'queryTree',
      payload: { pageSize: 100 }
    }).then(res => {
      // console.log(res)
      if (res?.code == 200) {
        res.data.modules.forEach(item => {
          item.title = item.moduleName;
          item.key = item.id;
          item.value = item.id;
          item.children = item.sonModuleList;
          item.children ? item.children.forEach(childItem => {
            childItem.title = childItem.moduleName;
            childItem.key = childItem.id;
            childItem.value = childItem.id;
          }) : null
        })
        setModuleTreeList(res.data.modules)
      }
    })
  }, [])
  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色模块',
      dataIndex: 'moduleNames',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
      render: (val, record) => record.createTime,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleUpdate = (fields) => {
    const hide = message.loading('操作中');
    dispatch({
      type: 'role/service',
      service: fields.id ? 'update' : 'add',
      payload: {
        id: fields.id,
        roleName: fields.roleName,
        description: fields.description,
        moduleIds: fields.moduleIds?.map(item => item.value)?.join(',')
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

  const handleDeleteRecord = (record) => {
    const hide = message.loading('正在删除');
    dispatch({
      type: 'role/service',
      service: 'remove',
      payload: { id: record.id }
    }).then(res => {
      hide();
      if (res?.code == 200) {
        message.success("删除成功");
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
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return dispatch({ type: 'role/query', payload: { ...params, pageNum: current } })
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
          moduleTreeList={moduleTreeList}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/query'],
  submiting: loading.effects['role/service'],
}))(RoleManage);
