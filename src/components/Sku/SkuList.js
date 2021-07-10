import React from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Tag,
  Tooltip, 
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const SkuList = ({
  value: sku,
  handleChangeSku,
}) => {

  const handleClose = (index, removedTag) => {
    sku[index].tags = sku[index].tags.filter(tag => tag != removedTag);
    handleChangeSku(sku)
  };

  const showInput = (index) => {
    sku[index].inputVisible = true;
    handleChangeSku(sku)
  };

  const handleInputChange = (index, e) => {
    sku[index].inputValue = e.target.value;
    handleChangeSku(sku)
  };
  const handleInputConfirm = (index) => {
    let inputValue = sku[index].inputValue
    let tags = sku[index].tags
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    sku[index].tags = tags
    sku[index].inputValue = ''
    sku[index].inputVisible = false
    handleChangeSku(sku)
  };

  const handleAddSku = () => {
    sku.push({ key: '', inputVisible: false, inputValue: '', tags: [] })
    handleChangeSku(sku)
  }

  const handleDeleteSku = (index) => {
    if (sku.length == 1) {
      message.warning('至少有一项规格！')
      return
    }
    sku.splice(index, 1)
    handleChangeSku(sku)
  }

  const handleSpecNameChange = (index, e) => {
    if (sku.some(item => item.key == e.target.value)) {
      sku[index].key = ''
    } else {
      sku[index].key = e.target.value
    }
    handleChangeSku(sku)
  }

  const renderTitle = (item, index) => {
    return (
      <Row type="flex" align="middle" style={{ width: '100%' }}>
        <Col span={3}>规格名</Col>
        <Col span={18}><Input value={item.key} onChange={e => handleSpecNameChange(index, e)} style={{ width: '100%', maxWidth: 200 }} placeholder="请输入规格名" /></Col>
        <Col span={3}><Tag color="#f50" style={{ margin: 0 }} onClick={() => handleDeleteSku(index)}>删除</Tag></Col>
      </Row>
    )
  }

  return (
    <div style={{ border: '1px solid #f0f0f0' }}>
      {sku.map((item, index) => (
        <Card key={index} bordered={false} type="inner" title={renderTitle(item, index)}>
          <Row type="flex" align="middle">
            <Col span={3}>规格值</Col>
            <Col span={21}>
              <div style={{ paddingLeft: '10px', lineHeight: '34px' }}>
                {item.tags?.map((tag, i) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag key={tag} closable={true} onClose={() => handleClose(index, tag)}>
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {item.inputVisible && (
                  <Input
                    type="text"
                    size="small"
                    autoFocus
                    placeholder="请输入规格值"
                    style={{ width: 100 }}
                    value={item.inputValue}
                    onChange={e => handleInputChange(index, e)}
                    onBlur={() => handleInputConfirm(index)}
                    onPressEnter={() => handleInputConfirm(index)}
                  />
                )}
                {!item.inputVisible && (
                  <Tag
                    color="blue"
                    onClick={() => showInput(index)}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <PlusOutlined /> 添加
                  </Tag>
                )}
              </div>
            </Col>
          </Row>
        </Card>
      ))}
      {sku.length < 2 && <div style={{ padding: '12px 24px', background: '#fafafa' }}>
        <Button onClick={handleAddSku}><PlusOutlined />添加规格项</Button>
      </div>}
    </div>
  );
}

export default SkuList