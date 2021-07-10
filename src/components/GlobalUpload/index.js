import React, { useState } from 'react';
import { Upload, message, Button, Image } from 'antd';
import { fileUrl, uploadUrl, getToken } from '@/utils/config';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import styles from './index.less';

const GlobalUpload = (props) => {
  const { maxCount = 1, onChange, onRemove, title, accept = 'image/*', value = [], id, crop, listType } = props;
  const [previewSrc, setPreviewSrc] = useState()

  const handleUploadChange = ({ file, fileList }) => {
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
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
    onChange({ key: id, fileList: fileList.length ? fileList : undefined })
  }

  let previewProps = {}
  if (!accept || accept?.indexOf('image') != -1) { //目前仅针对图片利用Image组件4.7.0的新特性实现自定义预览
    previewProps = {
      onPreview: file => setPreviewSrc(file.url)
    }
  }
  const uploadComponent = (
    <Upload
      name='file'
      accept="image/*"
      listType="picture-card"
      maxCount={maxCount}
      {...props}
      action={uploadUrl}
      headers={{ token: getToken() }}
      multiple={maxCount >= 1}
      fileList={value}
      onChange={handleUploadChange}
      onRemove={file => onRemove && onRemove(file)}
      {...previewProps}
    >
      {
        value.length >= maxCount ? null :
          (
            ['text', 'picture'].includes(listType) ?
              <Button icon={<UploadOutlined />}>上传文件</Button> :
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传{accept.indexOf('video') != -1 ? '视频' : '图片'}{maxCount ? `(${value.length}/${maxCount})` : ''}</div>
                {title ? <div>{title}</div> : null}
              </div>
          )
      }
    </Upload>
  )
  return (
    <div style={{ overflow: 'hidden' }} className={styles.uploadWrap}>
      {
        !!crop ?
          <ImgCrop rotate>
            {uploadComponent}
          </ImgCrop>
          :
          uploadComponent
      }
      <Image
        width={0}
        height={0}
        src={previewSrc}
        preview={{
          visible: Boolean(previewSrc),
          onVisibleChange: (visible, prevVisible) => setPreviewSrc(undefined)
        }}
      />
    </div>
  )
}

export default GlobalUpload