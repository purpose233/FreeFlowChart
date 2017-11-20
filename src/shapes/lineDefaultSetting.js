import colors from '../common/colors'

let lineSetting = {
  linkerType: 'straight',
  arrowType: 'solid'
}

let drawingDefaultSetting = {
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

export {lineSetting, drawingDefaultSetting, textDefaultSetting, defaultPadding}
