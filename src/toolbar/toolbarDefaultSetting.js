import {drawingDefaultSetting, textDefaultSetting} from "../shapes/shapeDefaultSetting";

const tools = {
  'undo': {
    hint: '撤销',
    className: 'undo',
    styleName: null,
    styleValue: null
  },
  'redo': {
    hint: '重做',
    className: 'redo',
    styleName: null,
    styleValue: null
  },
  // For simple tools, the default value is the value with index 0.
  'bold' : {
    hint: '加粗',
    className: 'bold',
    styleName: 'fontWeight',
    styleValue: ['normal', 'bold'],
  },
  'italic' : {
    hint: '斜体',
    className: 'italic',
    styleName: 'fontStyle',
    styleValue: ['normal', 'italic'],
  },
  'underline' : {
    hint: '下划线',
    className: 'underline',
    styleName: 'textDecoration',
    styleValue: ['none', 'underline'],
  },
  'fontFamily' : {
    hint: '字体',
    className: 'font-family',
    styleName: 'fontFamily',
    styleValue: ['Arial', 'Times New Roman'],
    defaultValue: 'Arial'
  },
  'fontSize' : {
    hint: '文字大小',
    className: 'font-size',
    styleName: 'fontSize',
    styleValue: ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px'],
    defaultValue: '12px'
  },
  'fontColor' : {
    hint: '文字颜色',
    className: 'font-color',
    styleName: 'color',
    styleValue: [textDefaultSetting.color]
  },
  'fillStyle' : {
    hint: '填充颜色',
    className: 'fill-style',
    styleName: 'fillStyle',
    styleValue: [drawingDefaultSetting.fillStyle]
  },
  'strokeStyle' : {
    hint: '线条颜色',
    className: 'stroke-style',
    styleName: 'strokeStyle',
    styleValue: [drawingDefaultSetting.strokeStyle]
  },
  /*
  'lineWidth' : {
    hint: '线条宽度',
    className: ,
    styleName: ,
    styleValue:
  },
  'lineDash' : {
    hint: '线条样式',
    className: ,
    styleName: ,
    styleValue:
  },
  'linkerType' : {
    hint: '连线类型',
    className: ,
    styleName: ,
    styleValue:
  },
  'arrowType' : {
    hint: '箭头类型',
    className: ,
    styleName: ,
    styleValue:
  }*/
}
const simplyToolTypes = [
  'undo', 'redo',
  'bold', 'italic', 'underline'
]

export {tools, simplyToolTypes}
