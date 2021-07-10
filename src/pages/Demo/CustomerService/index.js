import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Divider } from 'antd';
import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import GlobalModal from '@/components/GlobalModal'
import UpdateForm from './components/UpdateForm';


const CustomerService = ({
    dispatch,
    customer: { pagination },
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
            title: '类别',
            dataIndex: 'moduleName',
        },
        {
            title: '号码',
            dataIndex: 'moduleName',
        },
        {
            title: '备注',
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
            render: (_, record) => <>
                <a onClick={() => { handleUpdateModalVisible(true); setStepFormValues(record); }}>编辑</a>
                <Divider type='vertical' />
                <Popconfirm title="确定删除?" onConfirm={() => handleDeleteRecord(record)} okText="确定" cancelText="取消">
                    <a style={{ color: '#f50' }}>删除</a>
                </Popconfirm>
            </>
        },
    ];
    const handleDeleteRecord = (record) => {
        const hide = message.loading('正在删除');
        dispatch({
            type: 'customer/service',
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
    const handleUpdate = (fields) => {
        const hide = message.loading('操作中');
        dispatch({
            type: 'customer/service',
            service: fields.id ? 'update' : 'add',
            payload: {
                id: fields.id,
                type: fields.type,
                remark: fields.remark
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
                    return dispatch({ type: 'customer/query', payload: { ...params, pageNum: current } })
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

export default connect(({ customer, loading }) => ({
    customer,
    loading: loading.effects['customer/query'],
    submiting: loading.effects['customer/service'],
}))(CustomerService);
