import React, { useEffect, useState } from 'react';
import { Upload, message, Button, Image, Space, Checkbox, Tag } from 'antd';
import { ossHost } from '@/utils/config';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useDispatch } from 'umi';
import ImgCrop from 'antd-img-crop';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import styles from './index.less';

import encBase64 from 'crypto-js/enc-base64';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import encUtf8 from 'crypto-js/enc-utf8';
import md5 from 'md5';
const GlobalUploadOss = (props) => {
  const dispatch = useDispatch()
  const { maxCount = 1, onChange, onRemove, title, accept = 'image/*', value = [], id, crop, data: { type = 'default' }, listType, supportSort } = props;
  const [previewSrc, setPreviewSrc] = useState()
  const [ossSTSInfo, setOssSTSInfo] = useState();
  useEffect(() => {
    getOSSData().then(res => setOssSTSInfo(res))
  }, [])
  const beforeUpload = (file, fileList) => {
    //上传前文件重命名
    file.ossName = accept == '.apk' ? 'APK/android' : `${type}/${md5(Date.parse(new Date()) + md5(file.name))}`
    return Promise.resolve(file)
  }

  const getOSSData = async () => {
    const { data } = await dispatch({ type: 'oss/getSTSInfo' })
    if (!data?.Credentials) return null
    const policyText = {
      expiration: data.Credentials.Expiration, // 设置policy过期时间。
      conditions: [
        // 限制上传大小。
        ["content-length-range", 0, 500 * 1024 * 1024], //不写会oss报错400，默认500MB
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

  const handleUploadChange = ({ file, fileList }) => {
    // console.log(file,fileList)
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.response = { code: 200, data: file.ossName }
      fileList.forEach(item => {
        if (item.uid == file.uid) {
          item.response = file.response
        }
      })
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }

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
      data={file => {
        const fileName = accept == '.apk' ? 'APK/android' : `${type}/${md5(Date.parse(new Date()) + md5(file.name))}`
        return ({
          key: fileName,
          ...ossSTSInfo,
          'success_action_status': '200' //让服务端返回200,不然，默认会返回204
        })
      }}
      action={ossHost}
      multiple={maxCount > 1}
      fileList={value}
      onChange={handleUploadChange}
      beforeUpload={beforeUpload}
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

  const SortableItem = SortableElement(({ item }) => {
    return (
      <Checkbox
        onChange={(e) => {
          const newValue = value.map(record => {
            if (record.url == item.url) {
              record.checked = e.target.checked
            }
            return record
          })
          onChange({ key: id, fileList: newValue })
        }}
        checked={item.checked}
      >
        <Image style={{ cursor: 'move' }} preview={false} width={50} height={50} src={item.url} />
      </Checkbox>
    )
  });
  const SortableList = SortableContainer(() => {
    return (
      <Space className={styles.SortContainer}>
        <div>
          {value.map((item, index) => (
            <SortableItem key={`item-${index}`} disabled={false} index={index} item={item} />
          ))}
        </div>
      </Space>
    );
  });
  const SortableComponent = () => {
    //.uploadImg_sort的样式写在主要是定义zIndex为1000+，因为antd的modal层级为1000.目的是为了解决拖拽时元素看不见的问题
    return (
      <>
        <SortableList
          helperClass="uploadImg_sort"
          lockOffset={0}
          transitionDuration={500} //拖拽过度动画时长
          lockToContainerEdges={true}
          axis="xy"
          onSortEnd={({ oldIndex, newIndex }) => onChange({ key: id, fileList: arrayMove(value, oldIndex, newIndex) })}
        />
        <Tag color="#f50" onClick={() => onChange({ key: id, fileList: value.filter(item => !item.checked) })}>批量删除</Tag>
      </>
    )
  }

  return (
    <div style={{ overflow: 'hidden' }} className={styles.uploadWrap}>
      {
        !!crop ?
          <>
            <ImgCrop rotate>
              {uploadComponent}
            </ImgCrop>
            {supportSort && value?.length > 1 ? <SortableComponent /> : null}
          </>
          :
          <>
            {uploadComponent}
            {supportSort && value?.length > 1 ? <SortableComponent /> : null}
          </>
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

export default GlobalUploadOss