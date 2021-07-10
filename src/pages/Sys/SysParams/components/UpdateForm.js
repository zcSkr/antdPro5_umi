import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import BraftEditor from '@/components/BraftEditor';
import GlobalUpload from '@/components/GlobalUpload';

const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate,
  submiting,
  values,
}) => {
  const [formVals, setFormVals] = useState({
    ...values,
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
        name: formVals.name,
        textArea: formVals.textArea,
        content: formVals.content,
      }}
    >
      <FormItem label="键">
        {formVals.sort}
      </FormItem>
      {
        formVals.valueType == 'txt' || !formVals.valueType ?
          <FormItem
            name="name"
            label="值"
            rules={[{ required: true, message: '请输入值！' }]}
          >
            <Input placeholder="请输入" maxLength={50} allowClear />
          </FormItem> : null
      }
      {
        formVals.valueType == 'imgContent' ?
          <FormItem
            name="content"
            label="值"
            validateTrigger="onBlur"
            rules={[{ required: true, message: '请输入内容！' }]}
          >
            <BraftEditor handleBraftEditor={(value, id) => form.setFieldsValue({ [id]: value })} />
          </FormItem> : null
      }
      {
        formVals.valueType == 'file' ? 
          <FormItem
            name="logo"
            label="值"
            getValueFromEvent={e => e.fileList}
            rules={[{ required: true, message: '请上传文件！' }]}
          >
            <GlobalUpload
              accept='*'
              listType="text"
              data={{ type: 'paramsFile' }}
              onChange={({ key, fileList }) => form.setFieldsValue({ [key]: fileList })}
            />
          </FormItem> : null
      }
      <FormItem
        name="textArea"
        label="描述"
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      
      {renderFooter()}
    </Form>
  );
};

export default UpdateForm;
