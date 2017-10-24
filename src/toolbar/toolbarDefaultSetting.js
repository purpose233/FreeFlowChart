const tools = ['undo', 'redo',
  'bold', 'italic', 'underline',
  'fontName', 'fontSize', 'fontColor',
  'fillStyle', 'strokeStyle', 'lineWidth', 'lineDash',
  'linkerType', 'arrowType'
]

const toolsGroup = [
  ['undo', 'redo'],
  ['bold', 'italic', 'underline'],
  ['fontName', 'fontSize', 'fontColor'],
  ['fillStyle', 'strokeStyle', 'lineWidth', 'lineDash'],
  ['linkerType', 'arrowType']
]

const simplyToolTypes = [
  'undo', 'redo',
  'bold', 'italic', 'underline'
]

const hintData = {
  'undo' : '撤销', 'redo': '重做',
  'bold' : '加粗', 'italic' : '斜体', 'underline' : '下划线',
  'fontName' : '字体', 'fontSize' : '文字大小', 'fontColor' : '文字颜色',
  'fillStyle' : '填充颜色', 'strokeStyle' : '线条颜色', 'lineWidth' : '线条宽度', 'lineDash' : '线条样式',
  'linkerType' : '连线类型', 'arrowType' : '箭头类型'
}

export {tools, toolsGroup, simplyToolTypes, hintData}