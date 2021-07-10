import { DownCircleTwoTone } from '@ant-design/icons';
import {
  Button,
  message,
  Empty,
  Select,
  Input,
  Form,
  Checkbox,
  Timeline,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import GlobalUploadOss from '@/components/GlobalUpload/Oss';
import moment from 'moment'

const TimeItem = Timeline.Item;
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const UploadApp = ({
  dispatch,
  uploadApp: { list, pagination: { current, pageSize, total } },
  loading,
  submiting,
}) => {
  const [activeKey, setActiveKey] = useState('member')
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({ type: 'uploadApp/query', payload: { updatePort: activeKey, pageNum: 1 } })
  }, [activeKey]);

  const handleUpdate = (fields) => {
    console.log(fields)
    // return
    const hide = message.loading('操作中');
    dispatch({
      type: 'uploadApp/service',
      service: 'add',
      payload: {
        isConstraint: fields.isConstraint ? 1 : 0,
        newVersion: fields.newVersion,
        updateLog: fields.updateLog,
        updatePort: fields.updatePort,
        apkFileUrl: fields.apkFileUrl[0]?.url,
        targetSize: parseFloat(fields.apkFileUrl[0].size / 1024 / 1024).toFixed(2) + 'Mb',
        newMd5: 'app'
      },
    }).then((res) => {
      hide();
      if (res?.code == 200) {
        message.success('操作成功');
        form.resetFields()
        dispatch({ type: 'uploadApp/query', payload: { updatePort: activeKey, pageNum: 1 } })
      } else {
        message.error(res.msg);
      }
    });
  };

  const renderFooter = () => {
    return (
      <FormItem wrapperCol={24}>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" loading={submiting} htmlType="submit">
            提交
          </Button>
        </div>
      </FormItem>
    );
  };

  // 一般项目只有一个端，那么修改tabs数组和去掉端口下拉选择传参写固定值即可
  const tabs = [{ key: 'member', title: '用户端' }, { key: 'shop', title: '商家端' }, { key: 'server', title: '服务端' }]
  return (
    <PageContainer>
      <ProCard>
        <Form
          onFinish={fieldsValue => handleUpdate({ ...fieldsValue })}
          {...formLayout}
          form={form}
          initialValues={{
            isConstraint: false,
          }}
        >
          <FormItem
            name="updatePort"
            label="端口"
            rules={[{ required: true, message: '请选择端口！' }]}
          >
            <Select
              allowClear
              placeholder="请选择"
              style={{ width: '100%' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            >
              <Option value="member">用户端</Option>
              <Option value="shop">商家端</Option>
              <Option value="server">服务端</Option>
            </Select>
          </FormItem>
          <FormItem
            name="apkFileUrl"
            label="安装包"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true, message: '请上传.apk文件！' }]}
          >
            <GlobalUploadOss
              accept='.apk'
              listType="text"
              data={{ type: 'APK' }}
              totalNum={1}
              onChange={({ key, fileList }) => form.setFieldsValue({ [key]: fileList })}
            />
          </FormItem>
          <FormItem
            name="newVersion"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号！' }]}
          >
            <Input placeholder="请输入版本号（例1.0.0）" maxLength={50} allowClear />
          </FormItem>
          <FormItem
            name="isConstraint"
            label="是否强制更新"
            valuePropName="checked"
          >
            <Checkbox>是</Checkbox>
          </FormItem>
          <FormItem
            name="updateLog"
            label="更新描述"
            rules={[{ required: true, message: '请输入更新描述！' }]}
          >
            <TextArea placeholder="请输入更新描述！" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} showCount allowClear />
          </FormItem>
          {renderFooter()}
        </Form>
      </ProCard>
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          
          onChange: activeKey => setActiveKey(activeKey)
        }}
      >
        {
          tabs.map(item => (
            <ProCard.TabPane loading={loading} key={item.key} tab={item.title}>
              <Timeline>
                {
                  list.length > 0 ?
                  list.map((item, index) => (
                  <TimeItem key={item.id}>
                    {moment(item.createTime).format("YYYY/MM/DD")}
                    <span style={{ margin: 20 }}>{item.updateLog} </span> 
                    Size:{item.targetSize} 
                    <br />
                    版本号:{item.newVersion}
                  </TimeItem>
                )) : <Empty />
                }
              </Timeline>
              {current * pageSize < total && (
                <DownCircleTwoTone
                  onClick={() => dispatch({ type: 'uploadApp/query', payload: { updatePort: activeKey, pageNum: current + 1 } })}
                  style={{ fontSize: 48, color: "#1890FF", cursor: " pointer" }}
                />
              )}
            </ProCard.TabPane>
          ))
        }
      </ProCard>
    </PageContainer>
  );
};

export default connect(({ uploadApp, loading }) => ({
  uploadApp,
  loading: loading.effects['uploadApp/query'],
  submiting: loading.effects['uploadApp/service'],
}))(UploadApp);
