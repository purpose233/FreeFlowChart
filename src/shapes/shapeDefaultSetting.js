import colors from '../common/colors'

let basic = {
  width: 120,
  height: 90
}
let process = {
  width: 120,
  height: 90,
  shapeName: '流程'
}
let decision = {
  width: 110,
  height: 90,
  shapeName: '判定'
}
let terminator = {
  width: 120,
  height: 70,
  shapeName: '开始/结束'
}
let storedData = {
  width: 150,
  height: 90,
  shapeName: '数据库'
}

function getDefaultSetting (type) {
  switch (type) {
    case 'process': return process
    case 'decision': return decision
    case 'terminator': return terminator
    case 'storedData': return storedData
    default: return basic
  }
}

let drawingDefaultSetting = {
  fillStyle: colors.defaultFillStyle,
  strokeStyle: colors.defaultStrokeStyle,
  lineWidth: 2,
  lineDash: []
}

let textDefaultSetting = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  fontFamily: 'Arial',
  fontSize: '12px',
  color: colors.textDefaultColor
}

let defaultPadding = 10

export {getDefaultSetting, drawingDefaultSetting, textDefaultSetting, defaultPadding}
