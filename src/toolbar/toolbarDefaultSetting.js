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

const selectableColors = [
  [255,255,255],[229,229,229],[207,207,207],[184,184,184],[161,161,161],[138,138,138],[115,115,115],[92,92,92],[69,69,69],[50,50,50],[23,23,23],[0,0,0],
  [255,204,204],[255,230,204],[255,255,204],[230,255,204],[204,255,204],[204,255,230],[204,255,255],[204,229,255],[204,204,255],[229,204,255],[255,204,255],[255,204,230],
  [255,153,153],[255,204,153],[255,255,153],[204,255,153],[153,255,153],[153,255,204],[153,255,255],[153,204,255],[153,153,255],[204,153,255],[255,153,255],[255,153,204],
  [255,102,102],[255,179,102],[255,255,102],[179,255,102],[102,255,102],[102,255,179],[102,255,255],[102,178,255],[102,102,255],[178,102,255],[255,102,255],[255,102,179],
  [255,51,51],[255,153,51],[255,255,51],[153,255,51],[51,255,51],[51,255,153],[51,255,255],[51,153,255],[51,51,255],[153,51,255],[255,51,255],[255,51,153],
  [255,0,0],[255,128,0],[255,255,0],[128,255,0],[0,255,0],[0,255,128],[0,255,255],[0,127,255],[0,0,255],[127,0,255],[255,0,255],[255,0,128],
  [204,0,0],[204,102,0],[204,204,0],[102,204,0],[0,204,0],[0,204,102],[0,204,204],[0,102,204],[0,0,204],[102,0,204],[204,0,204],[204,0,102],
  [153,0,0],[153,76,0],[153,153,0],[77,153,0],[0,153,0],[0,153,77],[0,153,153],[0,76,153],[0,0,153],[76,0,153],[153,0,153],[153,0,77],
  [102,0,0],[102,51,0],[102,102,0],[51,102,0],[0,102,0],[0,102,51],[0,102,102],[0,51,102],[0,0,102],[51,0,102],[102,0,102],[102,0,51],
  [51,0,0],[51,26,0],[51,51,0],[26,51,0],[0,51,0],[0,51,26],[0,51,51],[0,25,51],[0,0,51],[25,0,51],[51,0,51],[51,0,26]
]

export {tools, simplyToolTypes, selectableColors}
