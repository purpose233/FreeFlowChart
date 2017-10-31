import {drawingDefaultSetting, textDefaultSetting} from "../shapes/shapeDefaultSetting";

const tools = {
  'undo': {
    hint: '撤销',
    faClass: 'fa-undo',
    styleName: null,
    styleValue: null
  },
  'redo': {
    hint: '重做',
    faClass: 'fa-repeat',
    styleName: null,
    styleValue: null
  },
  'bold' : {
    hint: '加粗',
    faClass: 'fa-bold',
    styleName: 'fontWeight',
    styleValue: ['normal', 'bold']
  },
  'italic' : {
    hint: '斜体',
    faClass: 'fa-italic',
    styleName: 'fontStyle',
    styleValue: ['normal', 'italic']
  },
  'underline' : {
    hint: '下划线',
    faClass: 'fa-underline',
    styleName: 'textDecoration',
    styleValue: ['none', 'underline']
  },
  'fontFamily' : {
    hint: '字体',
    faClass: 'fa-font',
    styleName: 'fontFamily',
    styleValue: ['Arial', 'Sans']
  },
  'fontSize' : {
    hint: '文字大小',
    faClass: 'fa-text-height',
    styleName: 'fontSize',
    styleValue: ['x-small', 'x-normal', 'x-large']
  },
  'fontColor' : {
    hint: '文字颜色',
    faClass: 'fa-pencil',
    styleName: 'color',
    styleValue: [textDefaultSetting.color]
  },
  'fillStyle' : {
    hint: '填充颜色',
    faClass: 'fa-square',
    styleName: 'fillStyle',
    styleValue: [drawingDefaultSetting.fillStyle]
  },
  'strokeStyle' : {
    hint: '线条颜色',
    faClass: 'fa-paint-brush',
    styleName: 'strokeStyle',
    styleValue: [drawingDefaultSetting.strokeStyle]
  },
  /*
  'lineWidth' : {
    hint: '线条宽度',
    faClass: ,
    styleName: ,
    styleValue:
  },
  'lineDash' : {
    hint: '线条样式',
    faClass: ,
    styleName: ,
    styleValue:
  },
  'linkerType' : {
    hint: '连线类型',
    faClass: ,
    styleName: ,
    styleValue:
  },
  'arrowType' : {
    hint: '箭头类型',
    faClass: ,
    styleName: ,
    styleValue:
  }*/
}

const toolsGroup = [
  ['undo', 'redo'],
  ['bold', 'italic', 'underline'],
  ['fontFamily', 'fontSize', 'fontColor'],
  ['fillStyle', 'strokeStyle', 'lineWidth', 'lineDash'],
  ['linkerType', 'arrowType']
]

const simplyToolTypes = [
  'undo', 'redo',
  'bold', 'italic', 'underline'
]

export {tools, toolsGroup, simplyToolTypes}
