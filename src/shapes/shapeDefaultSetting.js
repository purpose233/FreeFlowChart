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
  width: 120,
  height: 90,
  shapeName: '数据库'
}
let line = {
  linkerType: 'straight',
  arrowType: 'basic'
}

function getDefaultSetting (type) {
  switch (type) {
    case 'process': return process
    case 'decision': return decision
    case 'terminator': return terminator
    case 'storedData': return storedData
    case 'line': return line
    default: return basic
  }
}

let drawingDefaultSetting = {
  fillStyle: '#FFFFFF',
  strokeStyle: '#000000',
  lineWidth: 2,
  lineDash: []
}

export {getDefaultSetting, drawingDefaultSetting}
