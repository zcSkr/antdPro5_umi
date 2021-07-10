import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, DatePicker, Switch, Select, Image, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import GlobalDrawer from '@/components/GlobalDrawer'
import moment from 'moment'
import UpdateForm from './components/UpdateForm';
import Info from './components/Info'
import TestSku from './components/TestSku'


const { RangePicker } = DatePicker;
const { Option } = Select

const DemoTable = ({ 
  dispatch,
  demoTable: { pagination },
  loading,
  submiting, 
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [infoModalVisible, handleInfoModalVisible] = useState(false);
  const [skuModalVisible, handleSkuModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '排序权重',
      dataIndex: 'sort',
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text, record) => <Switch onChange={() => handleSwicthChange(record)} checkedChildren="启用" unCheckedChildren="冻结" checked={!!Number(text)} />,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            allowClear
            showSearch
            filterOption={(inputValue, option) => option.children.indexOf(inputValue) >= 0}
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
      title: '枚举示例', 
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '图片示例',
      dataIndex: 'img',
      hideInSearch: true,
      render: (text, record) => <Image width={20} height={20} src={text} />
    },
    {
      title: '单元格编辑',
      dataIndex: 'name',
      hideInSearch: true,
      editable: true,
      renderEditCell: (ref, save) => <Input size='small' maxLength={50} ref={ref} onPressEnter={save} onBlur={save} /> //传了会覆盖可编辑单元格的默认Input,比如传入一个InputNumber
    },
    {
      title: '链接',
      dataIndex: 'url',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (val, record) => record.createTime,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <RangePicker
            disabledDate={current => current > moment().endOf('day')}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            onChange={value => form.setFieldsValue({ createTime: value })}
            defaultPickerValue={[moment().subtract(1, 'month'), moment()]}
            placeholder={['开始时间', '结束时间']}
          />
        )
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => { handleSkuModalVisible(true); setStepFormValues(record); }}>规格</a>
          <Divider type="vertical" />
          <a onClick={() => { handleInfoModalVisible(true); setStepFormValues(record); }}>详情</a>
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
      type: 'demoTable/service',
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
      type: 'demoTable/service',
      service: fields.id ? 'update' : 'add',
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

  const handleDeleteRecord = (record) => {
    const hide = message.loading('正在删除');
    dispatch({
      type: 'demoTable/service',
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
  
  const handleSave = (dataIndex,record) => {
    // console.log(dataIndex,record)
    const hide = message.loading('操作中');
    dispatch({
      type: 'demoTable/service',
      service: 'update',
      payload: {
        id: record.id,
        [dataIndex]: record[dataIndex]
      }
    }).then(res => {
      hide();
      if (res?.code == 200) {
        message.success('操作成功');
        actionRef.current?.reload();
      } else {
        message.error(res.msg);
      }
    })
  }

  return (
    <PageContainer>
      <StandardTable 
        handleSave={handleSave}
        loading={loading}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key='add' type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={({ current, ...params }) => {
          // console.log(params)//查询参数，pageNum用current特殊处理
          return dispatch({ type: 'demoTable/query', payload: { ...params, pageNum: current } })
        }}
        beforeSearchSubmit={params => {
          params.createTime && params.createTime[0] ? params.minTime = params.createTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
          params.createTime && params.createTime[1] ? params.maxTime = params.createTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
          delete params.createTime
          return params
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
        width={1000}
      >
        <UpdateForm
          values={stepFormValues}
          handleUpdate={handleUpdate}
          submiting={submiting}
        />
      </GlobalModal>
      {/* 弹出层又有表格用Drawer抽屉，普通提交表单用Modal */}
      <GlobalDrawer
        visible={infoModalVisible}
        onCancel={() => {
          handleInfoModalVisible(false);
          setStepFormValues({});
        }}
      >
        <Info/>
      </GlobalDrawer>
      <GlobalModal
        visible={skuModalVisible}
        onCancel={() => {
          handleSkuModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
        width={1000}
      >
        <TestSku 
          values={stepFormValues}
          handleUpdate={handleUpdate}
          submiting={submiting}
        />
      </GlobalModal>
    </PageContainer>
  );
};

export default connect(({ demoTable, loading }) => ({
  demoTable,
  loading: loading.effects['demoTable/query'],
  submiting: loading.effects['demoTable/service'],
}))(DemoTable);
