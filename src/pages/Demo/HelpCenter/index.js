import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Popconfirm,
  DatePicker,
  Switch,
  Select,
  Image,
  Input,
  Tag,
  Radio,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal';
import moment from 'moment';
import UpdateForm from './components/UpdateForm';
import UpdateQuestion from './components/UpdateQuestion';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HelpCenter = ({
  dispatch,
  helpCenter: { list, pagination },
  loading,
  tableLoading,
  submiting,
}) => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [typeModalVisible, handleTypeModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [firstId, setFirstId] = useState();
  const actionRef = useRef();

  useEffect(() => {
    // 查询问题类型
    dispatch({ type: 'helpCenter/query' });
  }, []);

  let columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '排序权重',
      hideInSearch: true,
      dataIndex: 'sort',
    },
    {
      title: '问题描述',
      dataIndex: 'issue',
      ellipsis: true,
      render: (text, record) => <div style={{ maxWidth: 150 }}>{text}</div>,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (val, record) => record.createTime
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除?"
            onConfirm={() => handleDeleteRecord(record)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#f50' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleRadioChange = e => {
    setFirstId(e.target.value)
    actionRef.current?.reload()
  }


  const handleUpdate = (fields) => {
    // 编辑问题
    console.log(fields)
    const hide = message.loading('操作中');
    dispatch({
      type: 'helpCenter/service',
      service: fields.id ? 'updateQuestion' : 'addQuestion',
      payload: {
        id: fields.id,
        sort: fields.sort,
        typeId: fields.typeId,
        issue: fields.issue,
        answer: fields.answer,
      },
    }).then((res) => {
      hide();
      console.log(res)
      if (res?.code == 200) {
        message.success('操作成功');
        handleUpdateModalVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDeleteRecord = (record) => {
    // 删除问题
    const hide = message.loading('正在删除');
    dispatch({
      type: 'helpCenter/service',
      service: 'removeQuestion',
      payload: { infoId: record.id },
    }).then((res) => {
      hide();
      if (res?.code == 200) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleUpdateType = (field) => {
    // 编辑问题类型
    const hide = message.loading('操作中');
    dispatch({
      type: 'helpCenter/service',
      service: field.id ? 'update' : 'add',
      payload: {
        id: field.id,
        sort: field.sort,
        name: field.name,
      },
    }).then((res) => {
      hide();
      if (res?.code == 200) {
        message.success('操作成功');
        handleTypeModalVisible(false);
        //刷新列表
        dispatch({ type: 'helpCenter/query' })
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDeleteRecordType = (record) => {
    // 删除问题类型
    dispatch({
      type: 'helpCenter/service',
      service: 'remove',
      payload: { typeId: record.id },
    }).then((res) => {
      if (res?.code == 200) {
        message.success('删除成功！');
        dispatch({ type: 'helpCenter/query' }) // 重新查询一级数组
        if (firstId == record.id) {
          setFirstId();
          actionRef.current?.reload()
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <PageContainer>
      <ProCard gutter={8}>
        <ProCard
          title="问题类型"
          loading={loading}
          colSpan={8}
          bordered
          extra={<Tag color="#108ee9" style={{ margin: 0 }} onClick={() => handleTypeModalVisible(true)}><PlusOutlined />新增</Tag>}
          bodyStyle={{ padding: 0 }}
        >
          <Radio.Group
            onChange={(e) => handleRadioChange(e)}
            value={firstId}
            style={{ width: '100%' }}
          >
            <ProList
              rowKey={(record, index) => record.key || record.id}
              showActions="hover" //hover always
              dataSource={list}
              metas={{
                title: {
                  render: (_, record) => <Space>
                    <Radio value={record.id}></Radio>
                    <div>{record.sort}</div>
                    <div>{record.name}</div>
                  </Space>
                },
                actions: {
                  render: (_, record) => [
                    <a
                      key='edit'
                      onClick={() => {
                        handleTypeModalVisible(true);
                        setStepFormValues(record);
                      }}
                    >
                      编辑
                    </a>,
                    <Popconfirm
                      key='delete'
                      title="确定删除?"
                      onConfirm={() => handleDeleteRecordType(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a style={{ color: '#f50' }}>删除</a>
                    </Popconfirm>,
                  ]
                }
              }}
            />
          </Radio.Group>
        </ProCard>

        <ProCard
          colSpan={16}
          bordered
          bodyStyle={{ padding: 0 }}
        >
          <StandardTable
            headerTitle="问题列表"
            loading={tableLoading}
            search={false}
            size="small"
            actionRef={actionRef}
            toolBarRender={() => firstId ? [<Button type="primary" onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}>
              <PlusOutlined /> 新增
              </Button>] : []}
            request={({ current, ...params }) => {
              // console.log(params)//查询参数，pageNum用current特殊处理
              return dispatch({
                type: 'helpCenter/queryQuestion',
                payload: { typeId: firstId },
              });
            }}
            postData={(res) => res}
            columns={columns}
            pagination={false}
          />
        </ProCard>
      </ProCard>

      {/* 问题类型的弹窗 */}
      <GlobalModal
        visible={typeModalVisible}
        onCancel={() => {
          handleTypeModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
      >
        <UpdateForm values={stepFormValues} handleUpdate={handleUpdateType} submiting={submiting} />
      </GlobalModal>

      <GlobalModal
        visible={updateModalVisible}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        title={stepFormValues.id ? '编辑' : '新增'}
        width={1000}
      >
        <UpdateQuestion
          values={stepFormValues}
          handleUpdate={handleUpdate}
          submiting={submiting}
          typeList={list}
        />
      </GlobalModal>

    </PageContainer>
  );
};

export default connect(({ helpCenter, loading }) => ({
  helpCenter,
  loading: loading.effects['helpCenter/query'],
  tableLoading: loading.effects['helpCenter/queryQuestion'],
  submiting: loading.effects['helpCenter/service'],
}))(HelpCenter);
