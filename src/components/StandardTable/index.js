import { Form, Input } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import ProTable from '@ant-design/pro-table';
import './index.less'

const FormItem = Form.Item
const StandardTable = (props) => {
  let { columns, handleSave, pagination } = props

  const EditableContext = React.createContext();
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    renderEditCell,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async e => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave(dataIndex,{ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <FormItem
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}是必填项！`,
            },
          ]}
        >
          {
            renderEditCell ?
              renderEditCell(inputRef, save) :
              <Input ref={inputRef} onPressEnter={save} onBlur={save} placeholder="请输入" size="small" style={{ width: '100%' }} />
          }
        </FormItem>
      ) : (
          <div className="editable-cell-value-wrap" onClick={toggleEdit}>
            {children}
          </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  columns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        renderEditCell: col.renderEditCell,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <ProTable
      rowKey={record => record.key || record.id}
      search={{ labelWidth: 100 }}
      dateFormatter={false}
      {...props}
      components={components}
      columns={columns}
      rowClassName={() => 'editable-row'}
      pagination={
        typeof pagination == 'boolean' ? pagination :
          {
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            ...pagination
          }
      }
    />
  );
};
export default StandardTable
