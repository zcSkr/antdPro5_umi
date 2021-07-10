import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Switch, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';
import UpdatePsd from '@/components/UpdatePsd'
const { Option } = Select;

const ChildManage = ({
  dispatch,
  manager: { pagination },
  loading,
  submiting,
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [psdModalVisible, handlePsdModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [roleList, setRoleList] = useState([])
  useEffect(() => {
    dispatch({
      type: 'role/service',
      service: 'query',
      payload: { pageSize: 100 }
    }).then(res => {
      if (res?.code == 200) {
        setRoleList(res.data.list)
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
      title: '登录账号',
      dataIndex: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '拥有角色',
      dataIndex: 'roleNames',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInSearch: true,
      render: (text, record) => <Switch onChange={() => handleSwicthChange(record)} checkedChildren="启用" unCheckedChildren="冻结" checked={!!Number(text)} />,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            placeholder="请选择"
            style={{ width: '100%' }}
            onChange={value => form.setFieldsValue({ [item.dataIndex]: value })}
          >
            <Option>全部</Option>
            <Option value={1}>启用</Option>
            <Option value={0}>冻结</Option>
          </Select>
        )
      }
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
          <a onClick={() => { handlePsdModalVisible(true); setStepFormValues(record); }}>修改密码</a>
          <Divider type="vertical" />
          <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSwicthChange = (record) => {
    console.log(record)
    const hide = message.loading('操作中');
    dispatch({
      type: 'manager/service',
      service: 'update',
      payload: {
        id: record.id,
        state: Number(record.state) ? 0 : 1
      }
    }).then(res => {
      hide()
      if (res?.code == 200) {
        message.success('操作成功');
      } else {
        message.error(res.msg);
      }
      actionRef.current?.reload();
    })
  }

  const handleUpdate = (fields) => {
    const hide = message.loading('操作中');
    dispatch({
      type: 'manager/service',
      service: fields.id ? 'update' : 'add',
      payload: {
        id: fields.id,
        account: fields.account,
        nickname: fields.nickname,
        roleIds: fields.roleIds,
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
      type: 'manager/service',
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

  const handleUpdatePsd = fields => {
    const hide = message.loading('操作中');
    dispatch({
      type: 'manager/service',
      service: 'updatePsd',
      payload: { id: stepFormValues.id, password: fields.password }
    }).then(res => {
      hide();
      if (res?.code == 200) {
        message.success("操作成功");
        handlePsdModalVisible(false)
      } else {
        message.error(res.msg);
      }
    })
  }

  return (
    <PageContainer>
      <StandardTable
        loading={loading}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() =>{ setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return dispatch({ type: 'manager/query', payload: { ...params, pageNum: current } })
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
          roleList={roleList}
        />
      </GlobalModal>
      <GlobalModal
        visible={psdModalVisible}
        onCancel={() => {
          handlePsdModalVisible(false);
          setStepFormValues({});
        }}
        title='修改密码'
      >
        <UpdatePsd
          handleUpdate={handleUpdatePsd}
          submiting={submiting}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default connect(({ manager, loading }) => ({
  manager,
  loading: loading.effects['manager/query'],
  submiting: loading.effects['manager/service'],
}))(ChildManage);
