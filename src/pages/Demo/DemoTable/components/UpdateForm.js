import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image, Space } from 'antd';
import BraftEditor from '@/components/BraftEditor';
import BraftEditorOSS from '@/components/BraftEditor/Oss';
import GlobalUpload from '@/components/GlobalUpload';
import GlobalUploadOss from '@/components/GlobalUpload/Oss';
import QQMap from '@/components/QQMap';
import BMap from '@/components/BMap';

const FormItem = Form.Item;
const { Option } = Select
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  submiting,
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values,
    logo: values.logo?.split(',').map((item, index) => (
      {
        uid: 'img' + index,
        name: item.split('/')[2],
        status: 'done',
        url: item,
        response: { data: item, code: 200 }
      }
    )),
    logo1: values.logo1?.split(',').map((item, index) => (
      {
        uid: 'img' + index,
        name: item.split('/')[2],
        status: 'done',
        url: item,
        response: { data: item, code: 200 }
      }
    )),
    imgs: values.imgs || [],
  });

  const [form] = Form.useForm();

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
  return (
    <Form
      onFinish={fieldsValue => handleUpdate({ ...formVals, ...fieldsValue })}
      {...formLayout}
      form={form}
      initialValues={{
        sort: formVals.sort,
        name: formVals.name,
        url: formVals.url,
        logo: formVals.logo,
        logo1: formVals.logo1,
        content: formVals.content,
        content1: formVals.content1,
        cascader: formVals.cascader,
        select: formVals.select,
        textArea: formVals.textArea,
      }}
    >
      <FormItem
        name="sort"
        label="排序权重"
        rules={[{ required: true, message: '请输入排序权重！' }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="name"
        label="文本"
        rules={[{ required: true, message: '请输入文本！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="url"
        label="链接"
        rules={[{ required: true, message: '请输入链接！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="textArea"
        label="文本域"
        rules={[{ required: true, message: '请输入文本！' }]}
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      <FormItem
        name="cascader"
        label="Cascader示例"
        rules={[{ required: true, message: '请选择xx！' }]}
      >
        <Cascader
          allowClear
          showSearch
          expandTrigger='hover'
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          options={[
            {
              value: 'zhejiang',
              label: '浙江',
              children: [
                {
                  value: 'hangzhou',
                  label: '杭州',
                  children: [
                    {
                      value: 'xihu',
                      label: '西湖',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: '江苏',
              children: [
                {
                  value: 'nanjing',
                  label: '南京',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: '中华门',
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </FormItem>
      <FormItem
        name="select"
        label="select示例"
        rules={[{ required: true, message: '请选择xx！' }]}
      >
        <Select
          allowClear
          showSearch
          filterOption={(inputValue, option) => option.children.indexOf(inputValue) >= 0}
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">我擦</Option>
        </Select>
      </FormItem>
      <FormItem
        name="logo"
        label="上传示例"
        getValueFromEvent={e => e.fileList}
        rules={[{ required: true, message: '请上传图片！' }]}
      >
        <GlobalUpload
          data={{ type: 'img' }}
          onChange={({ key, fileList }) => form.setFieldsValue({ [key]: fileList })}
        />
      </FormItem>
      <FormItem
        name="logo1"
        label="oss上传示例"
        getValueFromEvent={e => e.fileList}
        rules={[{ required: true, message: '请上传图片！' }]}
      >
        <GlobalUploadOss
          data={{ type: 'test' }}
          maxCount={2}
          onChange={({ key, fileList }) => form.setFieldsValue({ [key]: fileList })}
        />
      </FormItem>
      <FormItem
        name="address"
        label="腾讯地图示例"
        rules={[{ required: true, message: '请选择定位！' }]}
      >
        <QQMap circle={{ radius: 1000 }} onClick={(value, id) => form.setFieldsValue({ [id]: value })} />
      </FormItem>
      <FormItem
        name="address1"
        label="百度地图示例"
        rules={[{ required: true, message: '请选择定位！' }]}
      >
        <BMap onClick={(value, id) => form.setFieldsValue({ [id]: value })} />
      </FormItem>
      <FormItem label="图片纯展示示例">
        <Image.PreviewGroup>
          <Space wrap>
            {
              formVals.imgs.map(item => <Image key={item.id} width={100} height={100} src={item.src} style={{ margin: '0 8px 8px 0' }} />)
            }
          </Space>
        </Image.PreviewGroup>
      </FormItem>
      <FormItem
        name="content"
        label="富文本示例"
        validateTrigger="onBlur"
        rules={[{ required: true, message: '请输入内容！' }]}
      >
        <BraftEditor handleBraftEditor={(value, id) => form.setFieldsValue({ [id]: value })} />
      </FormItem>
      <FormItem
        name="content1"
        label="oss富文本示例"
        validateTrigger="onBlur"
        rules={[{ required: true, message: '请输入内容！' }]}
      >
        <BraftEditorOSS handleBraftEditor={(value, id) => form.setFieldsValue({ [id]: value })} />
      </FormItem>
      {renderFooter()}
    </Form>
  );
};

export default UpdateForm;
