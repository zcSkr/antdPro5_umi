import React, { useState } from 'react';
import { Form, Button, Input, TreeSelect } from 'antd';
import { isEqual, uniqWith, differenceWith, zipWith } from 'lodash';

const FormItem = Form.Item;
const { TextArea } = Input
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const UpdateForm = ({
  handleUpdate, 
  submiting, 
  moduleTreeList,
  values
}) => {
  const moduleIds = zipWith(values.moduleIds?.split(','), values.moduleNames?.split(','), (value,label) => ({value,label}))
  const [formVals, setFormVals] = useState({
    ...values,
    moduleIds,
  });

  const [form] = Form.useForm();

  const handletreeSelectChange = (value, node, extra) => {
    // console.log(value, extra)
    if (moduleTreeList.some(item => item.id == extra.triggerValue)) { //父级
      let children = moduleTreeList.find(item => item.id == extra.triggerValue).children
      if (extra.checked) { //选中
        value = uniqWith(value.concat(children.map(r => ({ value: r.id, label: r.moduleName }))), isEqual)
      } else {//取消选中
        value = differenceWith(value, children.map(r => ({ value: r.id, label: r.moduleName })), isEqual)
      }
    } else { //子级
      moduleTreeList.forEach(item => {
        if (item.children.some(childItem => childItem.id == extra.triggerValue)) {
          let children = item.children
          if (extra.checked) {//选中
            value = uniqWith(value.concat([{ value: item.id, label: item.moduleName }]), isEqual)
          } else if (!children.some(childItem => value.some(r => r.value == childItem.id))) { //取消选中的时候 如果没有任何一个子级被选中
            value = differenceWith(value, [{ value: item.id, label: item.moduleName }], isEqual)
          }
        }
      })
    }
    form.setFieldsValue({ moduleIds: value })
  }



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
        roleName: formVals.roleName,
        description: formVals.description,
        moduleIds: formVals.moduleIds
      }}
    >
      <FormItem
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称！' }]}
      >
        <Input placeholder="请输入" maxLength={50} allowClear />
      </FormItem>
      <FormItem
        name="description"
        label="描述"
      >
        <TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={500} allowClear showCount />
      </FormItem>
      <FormItem
        name="moduleIds"
        label="模块"
        rules={[{ required: true, message: '请选择模块！' }]}
      >
        <TreeSelect
          treeCheckable
          treeCheckStrictly
          allowClear
          showSearch
          filterTreeNode={(inputValue, treeNode) => {
            if (treeNode.title.indexOf(inputValue) >= 0) {
              return true
            }
            if (treeNode.title.indexOf(inputValue) >= 0 || treeNode.children?.some(item => item.title.indexOf(inputValue) >= 0)) {
              return true
            }
            return false
          }}
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          treeData={moduleTreeList}
          onChange={handletreeSelectChange}
        />
      </FormItem>

      {renderFooter()}
    </Form>
  );
};

export default UpdateForm;
