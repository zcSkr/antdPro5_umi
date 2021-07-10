import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { Upload, message, Spin } from 'antd'
import { PictureFilled } from '@ant-design/icons'
import { imageControls, excludeControls, controls, tableOptions } from './config'
import { connect } from 'umi';
import { ossHost } from '@/utils/config';
import Table from 'braft-extensions/dist/table'

import encBase64 from 'crypto-js/enc-base64';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import encUtf8 from 'crypto-js/enc-utf8';
import md5 from 'md5';

const BraftEditorComponentOSS = ({
  dispatch,
  handleBraftEditor,
  value,
  id,
  readOnly, //仅读模式
}) => {
  // BraftEditor.use(Table(tableOptions)) //表格插入拓展,需要时放开
  const editorReducer = (state, action) => {
    switch (action.type) {
      case 'insertImage':
        return ContentUtils.insertMedias(state, [{
          type: 'IMAGE',
          url: action.payload
        }])
      case 'default': return action.payload
      default:
        return state
    }
  }
  const blockImportFn = Table()[2].importer;
  const blockExportFn = Table()[2].exporter;//解决回显表格不展示问题 issues链接 https://github.com/margox/braft-extensions/issues/58
  const [editorState, dispatchReducer] = useReducer(editorReducer, BraftEditor.createEditorState(value, { editorId: 'editor-oss', blockImportFn, blockExportFn }));
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef()
  const timer = useRef();
  const [ossSTSInfo, setOssSTSInfo] = useState();
  useEffect(() => {
    getOSSData().then(res => setOssSTSInfo(res))
    return () => {
      clearTimeout(timer.current)
    };
  }, [])

  useEffect(() => {
    dispatchReducer({ type: 'default', payload: BraftEditor.createEditorState(value, { editorId: 'editor-oss', blockImportFn, blockExportFn }) })
  }, [value]);
  // console.log(123)

  const getOSSData = async () => {
    const { data } = await dispatch({ type: 'oss/getSTSInfo' })
    if (!data?.Credentials) return null
    const policyText = {
      expiration: data.Credentials.Expiration, // 设置policy过期时间。
      conditions: [
        // 限制上传大小。
        ["content-length-range", 0, 10 * 1024 * 1024], //wx.uploadFile 接口有大小限制（10M） 文档地址https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/uploader.html
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
  const uploadProps = {
    name: 'file',
    accept: "image/*",
    multiple: true,
    showUploadList: false,
    action: ossHost,
    data: (file) => {
      const fileName = `BraftEditor/${md5(Date.parse(new Date()) + md5(file.name))}`
      return {
        key: fileName,
        ...ossSTSInfo,
        'success_action_status': '200' //让服务端返回200,不然，默认会返回204
      }
    },
    beforeUpload: (file, fileList) => {//上传前文件重命名
      file.ossName = `BraftEditor/${md5(Date.parse(new Date()) + md5(file.name))}`
      return Promise.resolve(file)
    },
    onChange: ({ file, fileList, event }) => {
      if (file.status === 'uploading') {
        setUploading(true)
      } else if (file.status === 'error') {
        message.error('图片上传失败')
        setUploading(false)
      } else if (file.status === 'done') {
        setUploading(false)
        let src = ossHost + '/' + file.ossName
        dispatchReducer({ type: 'insertImage', payload: src })
      }
    }
  }

  const extendControls = [ //额外的工具条
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload {...uploadProps}>
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            <PictureFilled />
          </button>
        </Upload>
      )
    },
  ]

  const handleBlur = (editorState) => {
    handleBraftEditor && handleBraftEditor(/^(<p>\s*<\/p>)*$/g.test(editorState.toHTML()) ? undefined : editorState.toHTML(), id)
  }

  return (
    <div className="editor-wrapper" style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
      <Spin spinning={uploading} tip="图片上传中">
        <BraftEditor
          id="editor-oss"
          ref={editorRef}
          value={editorState}
          placeholder="请输入内容"
          // onChange={handleChange}
          onBlur={handleBlur}
          readOnly={!!readOnly}
          // controls={controls} //不要全屏就配置controls
          excludeControls={excludeControls} //excludeControls
          extendControls={extendControls}
          imageControls={imageControls}
          fontSizes={[12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48]}
          contentStyle={{ height: 500 }}
          onSave={() => editorRef.current?.getDraftInstance().blur()} //ctrl+s保存的回调
        />
      </Spin>
    </div>
  )
}

export default connect()(BraftEditorComponentOSS)