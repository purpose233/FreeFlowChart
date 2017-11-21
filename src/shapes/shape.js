import {getDefaultSetting, drawingDefaultSetting, textDefaultSetting, defaultPadding} from './shapeDefaultSetting'
import _ from '../common/util'
import {tools} from "../toolbar/toolbarDefaultSetting";
import drawText from '../draw/text'

let shapeId = 0

const shapeProps = ['left', 'top', 'width', 'height'
  , 'drawStyle', 'textStyle', 'relativeLines']

function getPropDefault (prop, type) {
  let defaultSetting = getDefaultSetting(type)

  switch (prop) {
    case 'left': return 0
    case 'top': return 0
    case 'width': return defaultSetting.width
    case 'height': return defaultSetting.height
    case 'drawStyle': return _.clone(drawingDefaultSetting)
    case 'textStyle': return _.clone(textDefaultSetting)
    case 'relativeLines': return []
  }
}

class Shape {
  constructor (el, type, settings) {
    this.id = 'shape' + shapeId++
    this.el = el
    this.canvas = el.getElementsByTagName('canvas')[0]
    this.shapeText = el.getElementsByClassName('shape-text')[0]
    this.context = this.canvas.getContext('2d')
    this.type = type
    this.shapeName = getDefaultSetting(this.type).shapeName

    for (let i = 0; i < shapeProps.length; i++) {
      this[shapeProps[i]] = (settings && typeof settings[shapeProps[i]] !== 'undefined')
        ? _.clone(settings[shapeProps[i]], true) : getPropDefault(shapeProps[i], this.type)
    }
    if (this.shapeText && settings) {
      this.shapeText.value = settings.text ? settings.text : ''
    }

    // Although the padding is a member variable of shape,
    // it cannot be reset. The only reason why it is a member variable
    // is that it need to be used in child class.
    this.padding = defaultPadding

    this.init()
  }
  destruct () {
    this.remove()
    this.callLinesToDetach()
  }
  init () {
    this.el.style.width = this.width + 'px'
    this.el.style.height = this.height + 'px'
    this.canvas.width = this.width
    this.canvas.height = this.height
    if (typeof this.left !== 'undefined'
      && typeof this.top !== 'undefined') {
      this.setPosition(this.left, this.top)
    }
    //this.context.lineCap = 'round'
    //this.context.lineJoin = 'round'

    this.setTextareaStyle()
  }
  append () {
    let parent = document.getElementById('designer-canvas')
    let sibling = document.getElementById('shape-controls')

    parent.insertBefore(this.el, sibling)
  }
  remove () {
    let parent = document.getElementById('designer-canvas')
    parent.removeChild(this.el)
  }
  clearCanvas () {
    this.canvas.width = this.width
  }
  draw (paddingHorizontal, paddingVertical, drawContext) {}
  drawOnOtherCanvas (context, left, top) {
    context.translate(left, top)
    this.draw(null, null, context)

    // For now, the position of text is based on top and left 50%.
    // Need to be modified.
    let textLeft = this.shapeText.offsetLeft - this.shapeText.offsetWidth / 2
    let textTop = this.shapeText.offsetTop - this.shapeText.offsetHeight / 2
    let font = this.textStyle.fontStyle + ' ' + this.textStyle.fontWeight + ' '
       + this.textStyle.fontSize + ' ' + this.textStyle.fontFamily
    context.font = font
    context.fillStyle = this.textStyle.color
    let lineHeight = parseInt(this.textStyle.fontSize.slice(0, -2)) / 0.75
    drawText(context, this.shapeText.value, textLeft, textTop
      , this.shapeText.offsetWidth, lineHeight)

    context.translate(-left, -top)
  }
  setPositionStyle (position) {
    this.el.style.position = position
  }
  setPosition (left, top) {
    this.left = left
    this.top = top
    this.el.style.left = this.left + 'px'
    this.el.style.top = this.top + 'px'
  }
  setSize (width, height) {
    this.canvas.width = this.el.width = this.width = width
    this.el.style.width = this.canvas.style.width = width + 'px'
    this.canvas.height = this.el.height = this.height = height
    this.el.style.height = this.canvas.style.height = height + 'px'
  }
  setDrawStyle (context) {
    if (this.drawStyle.lineDash.length === 0) {
      context.lineCap = 'round'
    }

    context.lineJoin = 'round'
    context.fillStyle = this.drawStyle.fillStyle
    context.strokeStyle = this.drawStyle.strokeStyle
    context.lineWidth = this.drawStyle.lineWidth
    context.setLineDash(this.drawStyle.lineDash)
  }
  setLineDash (lineDash) {
    this.lineDash = lineDash
    this.setDrawStyle()
  }
  addLine (line, type, referPosition, referPercent) {
    this.relativeLines.push({
      line: line,
      // type values: 'src', 'dest'
      type: type,
      referPosition: referPosition,
      referPercent: referPercent
    })
  }
  getLineData (line) {
    for (let i = 0; i < this.relativeLines.length; i++) {
      if (line === this.relativeLines[i].line) {
        return this.relativeLines[i]
      }
    }
  }
  deleteLine (line) {
    for (let i = 0; i < this.relativeLines.length; i++) {
      if (line === this.relativeLines[i].line) {
        return this.relativeLines.splice(i, 1)[0]
      }
    }
  }
  callLinesToDetach () {
    for (let i = 0; i < this.relativeLines.length; i++) {
      if (this.relativeLines[i].type === 'src') {
        this.relativeLines[i].line.src.shape = null
      }
      else {
        this.relativeLines[i].line.dest.shape = null
      }
    }
  }
  setTextareaStyle () {
    if (!this.shapeText) { return }
    for (let prop in this.textStyle) {
      this.shapeText.style[prop] = this.textStyle[prop]
    }
  }
  resetTextareaSingleStyle (prop, value) {
    if (_.containsProp(this.textStyle, prop)) {
      this.textStyle[prop] = value
      this.shapeText.style[prop] = value
    }
  }
  resetDrawSingleStyle (prop, value) {
    if (_.containsProp(this.drawStyle, prop)) {
      this.drawStyle[prop] = value
      this.clearCanvas()
      this.draw()
    }
  }
  resetSingleStyle (prop, value) {
    if (_.contains(_.properties(this.textStyle), prop)) {
      return this.resetTextareaSingleStyle(prop, value)
    }
    if (_.contains(_.properties(this.drawStyle), prop)) {
      return this.resetDrawSingleStyle(prop, value)
    }
  }
  getAllStyle () {
    let style = {}
    for (let prop in this.textStyle) { style[prop] = this.textStyle[prop] }
    for (let prop in this.drawStyle) { style[prop] = this.drawStyle[prop] }
    return style
  }
  getStyleOfType (type) {
    let styleName = tools[type].styleName
    if (_.contains(_.properties(this.textStyle), styleName)) {
      return this.textStyle[styleName]
    }
    if (_.contains(_.properties(this.drawStyle), styleName)) {
      return this.drawStyle[styleName]
    }
  }
  calcLinePosition (referPosition, referPercent) {}
  resetLinesPosition () {
    let lineData, position
    for (let i = 0; i < this.relativeLines.length; i++) {
      lineData = this.relativeLines[i]
      position = this.calcLinePosition(lineData.referPosition, lineData.referPercent)
      if (lineData.type === 'src') {
        lineData.line.resetSrcPosition(position)
        lineData.line.draw()
      }
      else {
        lineData.line.resetDestPosition(position)
        lineData.line.draw()
      }
    }
  }
}

export default Shape
