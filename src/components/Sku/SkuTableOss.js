import React, { useState, useEffect } from 'react';
import { useDispatch } from 'umi';
import {
  Button,
  InputNumber,
  Upload,
  message,
} from 'antd';
import { ossHost } from '@/utils/config';
import StandardTable from '@/components/StandardTable';
import { UploadOutlined } from '@ant-design/icons';

import encBase64 from 'crypto-js/enc-base64';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import encUtf8 from 'crypto-js/enc-utf8';
import md5 from 'md5';

const SkuTableOss = ({ 
  sku,
  value: list,
  handleSkuTableChange
}) => {
  // console.log(props)
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState([])
  const [ossSTSInfo, setOssSTSInfo] = useState();

  useEffect(() => {
    getOSSData().then(res => setOssSTSInfo(res))
  }, [])

  const getOSSData = async () => {
    const { data } = await dispatch({ type: 'oss/getSTSInfo' })
    if (!data?.Credentials) return null
    const policyText = {
      expiration: data.Credentials.Expiration, // 设置policy过期时间。
      conditions: [
        // 限制上传大小。
        ["content-length-range", 0, 10 * 1024 * 1024], //10Mb
      ],
    };
    const policy = encBase64.stringify(encUtf8.parse(JSON.stringify(policyText))) // policy必须为base64的string。
    // 计算签名。
    function computeSignature(accessKeySecret, canonicalString) {
      return encBase64.stringify(HmacSHA1(canonicalString, accessKeySecret));
    }
    const signature = computeSignature(data.Credentials.AccessKeySecret, policy)
    const formData = {
      OSSAccessKeyId: data.Credentials.AccessKeyId,
      signature,
      policy,
      'x-oss-security-token': data.Credentials.SecurityToken
    }
    // console.log(formData)
    return formData
  }

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
            name='file'
            accept="image/*"
            action={ossHost}
            data={file => ({
              key: file.name,
              ...ossSTSInfo,
              'success_action_status': '200' //让服务端返回200,不然，默认会返回204
            })}
            beforeUpload={(file, fileList) => { //上传前文件重命名
              const fileName = `Spu/${md5(Date.parse(new Date()) + md5(file.name))}`
              const newFile = new File([file], fileName, { type: file.type });
              newFile.uid = file.uid
              return Promise.resolve(newFile)
            }}
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
            name='file'
            accept="image/*"
            action={ossHost}
            data={file => ({
              key: file.name,
              ...ossSTSInfo,
              'success_action_status': '200' //让服务端返回200,不然，默认会返回204
            })}
            beforeUpload={(file, fileList) => {
              const fileName = `Spu/${md5(Date.parse(new Date()) + md5(file.name))}`
              const newFile = new File([file], fileName, { type: file.type });
              newFile.uid = file.uid
              return Promise.resolve(newFile)
            }}
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
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.response = { code: 200, data: file.name }
      fileList.forEach(item => {
        if (item.uid == file.uid) {
          item.response = file.response
        }
      })
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }

    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && !file.url) {
        file.url = ossHost + '/' + file.response.data;
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
  };

  const handleUploadChange = (index, field, { file, fileList }) => {
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.response = { code: 200, data: file.name }
      fileList.forEach(item => {
        if (item.uid == file.uid) {
          item.response = file.response
        }
      })
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response && !file.url) {
        // Component will show file.url as link
        file.url = ossHost + '/' + file.response.data;
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

export default SkuTableOss