import React, { useState } from 'react';
import {
  Button,
  InputNumber,
  Upload,
  message,
} from 'antd';
import { fileUrl, uploadUrl, getToken } from '@/utils/config';
import StandardTable from '@/components/StandardTable';
import { UploadOutlined } from '@ant-design/icons';

const SkuTable = ({
  sku,
  value: list,
  handleSkuTableChange
}) => {
  // console.log(props)
  const [fileList, setFileList] = useState([])
  // console.log(list, 345)

  let columns = sku.map(item => ({ title: item.key, dataIndex: item.key }))
  columns.push(
    {
      title: () => <InputNumber onBlur={handleTitleBlur.bind(this, 'price')} size="small" style={{ width: '100%' }} min={0} precision={2} placeholder="价格" />,
      dataIndex: 'price',
      width: 100,
      render: (val, record, index) => <InputNumber value={val} onBlur={handleInputBlur.bind(this, 'price', index)} size="small" style={{ width: '100%' }} min={0.01} precision={2} placeholder="价格" />
    },
    {
      title: () => <InputNumber onBlur={handleTitleBlur.bind(this, 'num')} size="small" style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />,
      dataIndex: 'num',
      width: 100,
      render: (val, record, index) => <InputNumber value={val} onBlur={handleInputBlur.bind(this, 'num', index)} size="small" style={{ width: '100%' }} min={0} precision={0} placeholder="库存" />
    },
    {
      title: () => (
        <div style={{ maxWidth: 200 }}>
          <Upload
            accept="image/*"
            action={uploadUrl}
            headers={{ token: getToken() }}
            data={{ type: 'commidity' }}
            fileList={fileList}
            onChange={handleTitleUploadChange.bind(this, 'img')}
          >
            <Button size="small">
              <UploadOutlined /> 批量上传图片
            </Button>
          </Upload>
        </div>
      ),
      dataIndex: 'img',
      render: (val, record, index) => (
        <div style={{ maxWidth: 200 }}>
          <Upload
            accept="image/*"
            action={uploadUrl}
            headers={{ token: getToken() }}
            data={{ type: 'commidity' }}
            fileList={val || []}
            onChange={handleUploadChange.bind(this, index, 'img')}
          >
            <Button size="small">
              <UploadOutlined /> 上传图片
            </Button>
          </Upload>
        </div>
      )
    },
  )

  const handleInputBlur = (action, index, val) => {
    list[index][action] = Number(val.target.value)
    handleSkuTableChange([...list])
  }

  const handleTitleBlur = (action, val) => {
    // console.log(action,val.target.value)
    list.forEach(item => {
      if (item[action] === null) {
        item[action] = Number(val.target.value)
      }
    })
    handleSkuTableChange([...list])
  }

  const handleTitleUploadChange = (field, { file, fileList }) => {
    console.log(field)
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && !file.url) {
        file.url = fileUrl + file.response.data;
      }
      return file;
    });
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.code === 200;
      }
      return true;
    });
    fileList = fileList.filter(item => item.status);
    // console.log(fileList)
    list.forEach(item => {
      if (!item[field] || !item[field].length) {
        item[field] = fileList
      }
    })
    handleSkuTableChange([...list])
    setFileList(fileList)
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
  };

  const handleUploadChange = (index, field, { file, fileList }) => {
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && !file.url) {
        // Component will show file.url as link
        file.url = fileUrl + file.response.data;
      }
      return file;
    });
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.code === 200;
      }
      return true;
    });
    fileList = fileList.filter(item => item.status);
    // console.log(fileList)
    list[index][field] = fileList
    handleSkuTableChange([...list])
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
  }
  return (
    <StandardTable
      bordered
      search={false}
      options={false}
      loading={false}
      dataSource={list}
      pagination={false}
      columns={columns}
      columnEmptyText=''
    />
  );
}

export default SkuTable