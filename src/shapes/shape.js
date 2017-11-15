import {getDefaultSetting, drawingDefaultSetting, textDefaultSetting, defaultPadding} from './shapeDefaultSetting'
import _ from '../common/util'
import {tools} from "../toolbar/toolbarDefaultSetting";

let shapeId = 0

class Shape {
  constructor (el, type, left, top, width, height, drawStyle, textStyle) {
    this.id = 'shape' + shapeId++
    this.el = el
    this.canvas = el.getElementsByTagName('canvas')[0]
    this.shapeText = el.getElementsByClassName('shape-text')[0]
    this.context = this.canvas.getContext('2d')
    this.type = type
    this.left = left
    this.top = top

    let temp = getDefaultSetting(this.type)
    this.shapeName = temp.shapeName
    if (typeof width !== 'undefined' && width !== null
      && typeof height !== 'undefined' && height !== null) {
      this.width = width
      this.height = height
    }
    else {
      this.width = temp.width
      this.height = temp.height
    }

    this.drawStyle = drawStyle ? drawStyle : _.clone(drawingDefaultSetting)
    this.textStyle = textStyle ? textStyle : _.clone(textDefaultSetting)
    this.padding = defaultPadding

    this.relativeLines = []

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
    //this.context.lineCap = 'round'
    //this.context.lineJoin = 'round'

    this.setTextareaStyle()
  }
  append () {
    let parent = document.getElementById('designer_canvas')
    let sibling = document.getElementById('shape_controls')

    parent.insertBefore(this.el, sibling)
  }
  remove () {
    let parent = document.getElementById('designer_canvas')
    parent.removeChild(this.el)
  }
  clearCanvas () {
    this.canvas.width = this.width
  }
  draw () {}
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
}

export default Shape
