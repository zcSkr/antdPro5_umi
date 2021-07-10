export const imageControls = [
  'align-left', // 设置图片居左
  'align-center', // 设置图片居中
  'align-right', // 设置图片居右
  // 'size',
  'remove'
]
export const excludeControls = [
  'line-height', 'letter-spacing',
  'superscript', 'subscript', 'remove-styles', 'emoji',
  'text-indent', 'link', 'hr',
  'list-ul', 'list-ol', 'blockquote', 'code',
  'media',
  'clear',
]
export const controls = [ //工具条
  'undo', 'redo', 'separator',
  'font-size', 'separator',
  'headings', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'text-align', 'separator',
  // 'media', 'separator',
  // 'clear'
]

export const tableOptions = {
  defaultColumns: 5, // 默认列数
  defaultRows: 5, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  includeEditors: ['editor-normal', 'editor-oss'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['editor-oss']  // 指定该模块对哪些BraftEditor无效
}