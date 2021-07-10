import React, { useState } from 'react';
import { Form, Button, Input, InputNumber, Select, Cascader, Image } from 'antd';
import BraftEditorOSS from '@/components/BraftEditor/Oss';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateQuestion = ({
  handleUpdate,
  submiting,
  values,
  typeList,
}) => {
  const [formVals, setFormVals] = useState({ ...values });

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
        typeId: formVals.typeId,
        answer: formVals.answer,
        issue: formVals.issue,
      }}
    >
      <FormItem
        name="typeId"
        label="类型"
        rules={[{ required: true, message: '请选择类型！' }]}
      >
        <Select
          allowClear
          showSearch
          filterOption={(inputValue, option) => option.children.indexOf(inputValue) >= 0}
          placeholder="请选择类型"
          style={{ width: '100%' }}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        >
          {
            typeList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      </FormItem>
      <FormItem
        name="sort"
        label="排序权重"
        rules={[{ required: true, message: '请输入排序权重！' }]}
      >
        <InputNumber style={{ width: '100%' }} min={1} precision={0} placeholder="请输入" />
      </FormItem>
      <FormItem
        name="issue"
        label="问题描述"
        rules={[{ required: true, message: '请输入问题描述！' }]}
      >
        <Input placeholder="请输入问题描述" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="answer"
        label="回复内容"
        validateTrigger="onBlur"
        rules={[{ required: true, message: '请输入内容！' }]}
      >
        <BraftEditorOSS handleBraftEditor={(value, id) => form.setFieldsValue({ [id]: value })} />
      </FormItem>
      {renderFooter()}
    </Form>
  );
};

export default UpdateQuestion;
