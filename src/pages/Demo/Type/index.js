import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { PlusOutlined } from '@ant-design/icons';
import {
  Radio,
  Popconfirm,
  Tag,
  Image,
  message,
  Space,
} from 'antd';

import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';


const Type = ({
  dispatch,
  type: { list, list2, list3, pagination1, pagination2, pagination3 },
  level1Loading,
  level2Loading,
  level3Loading,
  submiting,
}) => {
  const [firstId, setFirstId] = useState();
  const [secondId, setSecondId] = useState();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});

  useEffect(() => {
    dispatch({ type: 'type/query' })
    return () => {
      dispatch({
        type: 'type/save', 
        payload: {
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
        }
      })
    }
  }, []);

  const handleRadioChange = (action, e) => {
    switch (action) {
      case 'level1':
        setFirstId(e.target.value);
        setSecondId();
        dispatch({ type: 'type/queryLevel2' })//查询第二级的数组
        break;
      case 'level2':
        setSecondId(e.target.value);
        dispatch({ type: 'type/queryLevel3' })//查询第二级的数组
        break;
      default: break;
    }
  }

  const handleDeleteRecord = (action, record) => {
    switch (action) {
      case 'level1':
        // 删除逻辑
        dispatch({
          type: 'type/service',
          service: 'remove',
          payload: { id: record.id }
        }).then(res => {
          if (res?.code == 200) {
            message.success('删除成功！')
            // dispatch({ type: 'type/query' }) // 重新查询一级数组
            if (firstId == record.id) {
              setFirstId();
              setSecondId();
              dispatch({ //重置第二三级的数据
                type: 'type/save',
                payload: {
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
                }
              })
            } else {
              dispatch({ type: 'type/query' })
            }
          } else {
            message.error(res.msg)
          }
        })
        break;
      case 'level2':
        dispatch({
          type: 'type/service',
          service: 'remove',
          payload: { id: record.id }
        }).then(res => {
          if (res?.code == 200) {
            message.success('删除成功！')
            // dispatch({ type: 'type/queryLevel2' }) // 重新查询二级数组
            if (secondId == record.id) {
              setSecondId();
              dispatch({ //重置第三级的数据
                type: 'type/save',
                payload: {
                  list3: [],
                  pagination3: {
                    current: 1,
                    pageSize: 10,
                    total: 0
                  }
                }
              })
            } else {
              dispatch({ type: 'type/queryLevel2' })
            }
          } else {
            message.error(res.msg)
          }
        })
        break;
      case 'level3':
        dispatch({
          type: 'type/service',
          service: 'remove',
          payload: { id: record.id }
        }).then(res => {
          if (res?.code == 200) {
            message.success('删除成功！')
            dispatch({ type: 'type/queryLevel3' }) // 重新查询三级数组
          } else {
            message.error(res.msg)
          }
        })
        break;
      default: break;
    }
  }

  const handleUpdate = field => {
    const hide = message.loading('操作中');
    dispatch({
      type: 'type/service',
      service: field.id ? 'update' : 'add',
      payload: {
        id: field.id,
        sort: field.sort,
        name: field.name,
      }
    }).then(res => {
      hide();
      if (res?.code == 200) {
        message.success('操作成功');
        handleUpdateModalVisible(false)
        //刷勋列表
      } else {
        message.error(res.msg);
      }
    })
  }

  const handlePaginationChange = (action, current, pageSize) => {
    const params = {
      pageNum: current,
      pageSize,
    };
    switch (action) {
      case 'level1': dispatch({ type: 'type/query', payload: params }); break;
      case 'level2': dispatch({ type: 'type/queryLevel2', payload: params }); break;
      case 'level3': dispatch({ type: 'type/queryLevel3', payload: params }); break;
      default: break;
    }
  }

  const listFake = [...new Array(20).keys()].map(item => ({
    id: item + 1,
    sort: item + 1,
    name: `name_${item + 1}`,
  }));

  const extraDom = (level) => <Tag color="#108ee9" style={{ margin: 0 }} onClick={() => { setStepFormValues({}); handleUpdateModalVisible(true) }}><PlusOutlined />新增</Tag>
  return (
    <PageContainer>
      <ProCard gutter={8}>
        <ProCard
          title="一级分类"
          loading={level1Loading}
          colSpan={8}
          bordered
          extra={extraDom('level1')}
          bodyStyle={{ padding: 0 }}
        >
          <Radio.Group onChange={e => handleRadioChange('level1', e)} value={firstId} style={{ width: '100%' }}>
            <ProList
              pagination={{
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
                size: 'small',
                onChange: handlePaginationChange.bind(this, 'level1'),
                ...pagination1
              }}
              rowKey={(record, index) => record.key || record.id}
              showActions="hover" //hover always
              dataSource={list}
              metas={{
                title: { 
                  render: (text, record) => (
                    <Space>
                      <Radio value={record.id}></Radio>
                      <div>{record.sort}</div>
                      <Image width={20} height={20} src={record.img} />
                      <div>{record.name}</div>
                    </Space>
                  )
                },
                actions: {
                  render: (text, record) => [
                    <a key='edit' onClick={() => { handleUpdateModalVisible(true); setStepFormValues({ ...record, level: 'level1' }); }}>编辑</a>,
                    <Popconfirm key='delete' title="确定删除?" onConfirm={() => handleDeleteRecord('level1', record)} okText="确定" cancelText="取消">
                      <a style={{ color: '#f50' }}>删除</a>
                    </Popconfirm>
                  ]
                },
              }}
            />
          </Radio.Group>
        </ProCard>
        <ProCard title="二级分类"
          loading={level2Loading}
          colSpan={8}
          bordered
          extra={firstId && extraDom('level2')}
          bodyStyle={{ padding: 0 }}
        >
          <Radio.Group onChange={e => handleRadioChange('level2', e)} value={secondId} style={{ width: '100%' }}>
            <ProList
              pagination={{
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条`,
                size: 'small',
                onChange: handlePaginationChange.bind(this, 'level2'),
                ...pagination2
              }}
              rowKey={(record, index) => record.key || record.id}
              showActions="hover" //hover always
              dataSource={list2}
              metas={{
                title: {
                  render: (text, record) => (
                    <Space>
                      <Radio value={record.id}></Radio>
                      <div>{record.sort}</div>
                      <div>{record.name}</div>
                    </Space>
                  )
                },
                actions: {
                  render: (text, record) => [
                    <a key='edit' onClick={() => { handleUpdateModalVisible(true); setStepFormValues({ ...record, level: 'level2' }); }}>编辑</a>,
                    <Popconfirm key='delete' title="确定删除?" onConfirm={() => handleDeleteRecord('level2', record)} okText="确定" cancelText="取消">
                      <a style={{ color: '#f50' }}>删除</a>
                    </Popconfirm>
                  ]
                },
              }}
            />
          </Radio.Group>
        </ProCard>
        <ProCard title="三级分类"
          loading={level3Loading}
          colSpan={8}
          bordered
          extra={secondId && extraDom('level3')}
          bodyStyle={{ padding: 0 }}
        >
          <ProList
            pagination={{
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              size: 'small',
              onChange: handlePaginationChange.bind(this, 'level3'),
              ...pagination3
            }}
            rowKey={(record, index) => record.key || record.id}
            showActions="hover" //hover always
            dataSource={list3}
            metas={{
              title: {
                render: (text, record) => (
                  <Space>
                    <div>{record.sort}</div>
                    <div>{record.name}</div>
                  </Space>
                )
              },
              actions: {
                render: (text, record) => [
                  <a key='edit' onClick={() => { handleUpdateModalVisible(true); setStepFormValues({ ...record, level: 'level3' }); }}>编辑</a>,
                  <Popconfirm key='delete' title="确定删除?" onConfirm={() => handleDeleteRecord('level3', record)} okText="确定" cancelText="取消">
                    <a style={{ color: '#f50' }}>删除</a>
                  </Popconfirm>
                ]
              },
            }}
          />
        </ProCard>
      </ProCard>
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
  )
}

export default connect(({ type, loading }) => ({
  type,
  level1Loading: loading.effects['type/query'],
  level2Loading: loading.effects['type/queryLevel2'],
  level3Loading: loading.effects['type/queryLevel3'],
  submiting: loading.effects['type/service'],
}))(Type)