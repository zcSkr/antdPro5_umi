import React, { useState } from 'react';
import { Form, Button, Input, Select } from 'antd';
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
      }}
    >
      <FormItem
        name="city"
        label="类别"
        rules={[{ required: true, message: '请选择类别！' }]}
      >
        <Select
          allowClear
          showSearch
          filterOption={(inputValue, option) => option.children.indexOf(inputValue) >= 0}
          placeholder="请选择"
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Option value="0" >电话</Option>
          <Option value="1" >微信</Option>
          <Option value="2" >QQ</Option>
        </Select>
      </FormItem>
      <FormItem
        name="sort"
        label="联系号码"
        rules={[{ required: true, message: '请输入联系号码！' }]}
      >
        <Input style={{ width: '100%' }} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="remark"
        label="备注"
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>

      {renderFooter()}
    </Form>
  );
};

export default UpdateForm;
