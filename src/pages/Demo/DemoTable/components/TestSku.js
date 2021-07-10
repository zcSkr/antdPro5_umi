import React, { useState, useEffect } from 'react';
import { Form, Button, Input, InputNumber } from 'antd';

import Sku from '@/components/Sku';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const TestSku = ({
  handleUpdate,
  submiting,
  values
}) => {
  const [formVals, setFormVals] = useState({
    ...values
  });

  const [productList, setProductList] = useState([]) //表格回显的数据
  const [sku, setSku] = useState([{ key: '', inputVisible: false, inputValue: '', tags: [] }]) //默认的规格组
  useEffect(() => {
    //请求数据 或者 回显时对productList和sku赋值
    // setProductList()
    // setSku()
  }, []);
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
        <Input placeholder="请输入" allowClear />
      </FormItem>

      {/* 表单校验通过后通过fieldsValue.skuList 和 fieldsValue.sku取值,form必传 */}
      <Sku productList={productList} sku={sku} form={form} />

      {renderFooter()}
    </Form>
  );
};

export default TestSku;
