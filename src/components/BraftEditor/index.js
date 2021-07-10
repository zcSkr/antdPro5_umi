import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import React, { useState, useRef, useReducer, useEffect } from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { Upload, message, Spin } from 'antd'
import { PictureFilled } from '@ant-design/icons'
import { imageControls, excludeControls, controls, tableOptions } from './config'
import { getToken, fileUrl, uploadUrl } from '@/utils/config';
import Table from 'braft-extensions/dist/table'

const BraftEditorComponent = ({
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
  const [editorState, dispatchReducer] = useReducer(editorReducer, BraftEditor.createEditorState(value, { editorId: 'editor-normal', blockImportFn, blockExportFn }));
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef()
  const timer = useRef();
  useEffect(() => {
    dispatchReducer({ type: 'default', payload: BraftEditor.createEditorState(value, { editorId: 'editor-normal', blockImportFn, blockExportFn }) })
    return () => {
      clearTimeout(timer.current)
    };
  }, [value]);

  const uploadProps = {
    name: 'file',
    accept: "image/*",
    multiple: true,
    showUploadList: false,
    action: uploadUrl,
    headers: { token: getToken() },
    data: { type: 'BraftEditor' },
    onChange: ({ file, fileList, event }) => {
      if (file.status === 'uploading') {
        // console.log(file, fileList);
        setUploading(true)
      } else if (file.status === 'error') {
        message.error('图片上传失败')
        setUploading(false)
      } else if (file.status === 'done') {
        setUploading(false)
        if (file.response?.code == 200) {
          let src = fileUrl + file.response.data
          dispatchReducer({ type: 'insertImage', payload: src })
        }
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
          id="editor-normal"
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

export default BraftEditorComponent