import {lineSetting, drawingDefaultSetting
  , textDefaultSetting, defaultPadding} from './lineDefaultSetting'
import {calcPointToPointDistance, calcPointToLineDistance
  , calcPointToBezier} from "../core/calculation/calcDistance"
import {calcPointToLineFoot} from "../core/calculation/calcPosition";
import colors from '../common/colors'
import _ from '../common/util'
import {tools} from '../toolbar/toolbarDefaultSetting'

let lineId = 0
const lineAreaWidth = 7
// Delta is a number which is small enough
// that it can be used while judging whether
// two floating numbers are equal.
const delta = 0.1
const lineProps = ['linkerType', 'arrowType', 'drawStyle', 'textStyle', 'bezierControlPoints']

function getPropDefault (prop) {
  switch (prop) {
    case 'linkerType': return lineSetting.linkerType
    case 'arrowType': return lineSetting.arrowType
    case 'drawStyle': return _.clone(drawingDefaultSetting)
    case 'textStyle': return _.clone(textDefaultSetting)
    case 'bezierControlPoints': return []
  }
}

class Line {
  constructor (el, src, dest, settings) {
    this.id = 'line' + lineId++
    this.el = el
    this.canvas = el.getElementsByTagName('canvas')[0]
    this.shapeText = el.getElementsByClassName('shape-text')[0]
    this.context = this.canvas.getContext('2d')
    // src and dest contain shape, position
    this.src = src
    this.dest = dest
    this.type = 'line'

    this.width = 0
    this.height = 0
    this.left = 0
    this.top = 0
    this.padding = defaultPadding
    this.drawBeginPosition = {}
    this.drawEndPosition = {}

    for (let i = 0; i < lineProps.length; i++) {
      this[lineProps[i]] = (settings && typeof settings[lineProps[i]] !== 'undefined')
        ? _.clone(settings[lineProps[i]], true) : getPropDefault(lineProps[i], this.type)
    }

    this.init()
  }
  destruct () {
    this.remove()
    this.callShapesToDetach()
  }
  init () {
    if (this.bezierControlPoints.length === 0) {
      this.reCalcBezierControlPoints()
    }
    this.resetCanvas()
  }
  clearCanvas () {
    this.canvas.width = this.width
  }
  resetSrcPosition (position) {
    this.src.position = position
    this.reCalcBezierControlPoints()
    this.resetCanvas()
  }
  resetDestPosition (position) {
    this.dest.position = position
    this.reCalcBezierControlPoints()
    this.resetCanvas()
  }
  resetCanvas () {
    let left, top, width, height
    switch (this.linkerType) {
      case 'straight':
        width = Math.abs(this.src.position.x - this.dest.position.x) + 2 * this.padding
        height = Math.abs(this.src.position.y - this.dest.position.y) + 2 * this.padding

        if ((this.dest.position.x - this.src.position.x) >= 0) {
          left = this.src.position.x - this.padding
        }
        else {
          left = this.dest.position.x - this.padding
        }
        if ((this.dest.position.y - this.src.position.y) >= 0) {
          top = this.src.position.y - this.padding
        }
        else {
          top = this.dest.position.y - this.padding
        }
        break;
      case 'bezier':
        [left, top, width, height] = this.calcBezierArea()
        left -= this.padding
        top -= this.padding
        width += 2 * this.padding
        height += 2 * this.padding
        break;
    }

    this.canvas.width = this.el.width = this.width = width
    this.el.style.width = this.canvas.style.width = width + 'px'
    this.canvas.height = this.el.height = this.height = height
    this.el.style.height = this.canvas.style.height = height + 'px'
    this.setPosition(left, top)
  }
  resetSrc (src) {
    this.src = src
    this.reCalcBezierControlPoints()
    this.resetCanvas()
  }
  resetDest (dest) {
    this.dest = dest
    this.reCalcBezierControlPoints()
    this.resetCanvas()
  }
  resetBezierSrcControl (position) {
    this.bezierControlPoints[0] = position
    this.resetCanvas()
  }
  resetBezierDestControl (position) {
    this.bezierControlPoints[1] = position
    this.resetCanvas()
  }
  reCalcBezierControlPoints () {
    let offsetX = this.dest.position.x - this.src.position.x
    let offsetY = this.dest.position.y - this.src.position.y

    this.bezierControlPoints = [
      {x: this.src.position.x + offsetX / 3,
      y: this.src.position.y + 2 * offsetY / 3}
      , {x: this.src.position.x + 2 * offsetX / 3,
      y: this.src.position.y + offsetY / 3}]
  }
  setPosition (x, y) {
    this.left = x
    this.top = y
    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'
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
  setDrawStyle (context) {
    context.strokeStyle = this.drawStyle.strokeStyle
    context.lineWidth = this.drawStyle.lineWidth
    context.setLineDash(this.drawStyle.lineDash)
  }
  calcDrawingBeginEndPoints () {
    switch (this.linkerType) {
      case 'straight':
        if ((this.dest.position.x - this.src.position.x) >= 0) {
          this.drawBeginPosition.x = this.padding
          this.drawEndPosition.x = this.width - this.padding
        }
        else {
          this.drawBeginPosition.x = this.width - this.padding
          this.drawEndPosition.x = this.padding
        }
        if ((this.dest.position.y - this.src.position.y) >= 0) {
          this.drawBeginPosition.y = this.padding
          this.drawEndPosition.y = this.height - this.padding
        }
        else {
          this.drawBeginPosition.y = this.height - this.padding
          this.drawEndPosition.y = this.padding
        }
        break;
      case 'bezier':
        let [left, top] = this.calcBezierArea()
        this.drawBeginPosition.x = this.src.position.x - left + this.padding
        this.drawBeginPosition.y = this.src.position.y - top + this.padding
        this.drawEndPosition.x = this.dest.position.x - left + this.padding
        this.drawEndPosition.y = this.dest.position.y - top + this.padding
        break;
    }
  }
  calcJudgingBeginEndPoints () {
    return [ this.src.position.x, this.src.position.y
      , this.dest.position.x, this.dest.position.y ]
  }
  calcArrowAngle () {
    let angle, offsetX, offsetY
    switch (this.linkerType) {
      case 'straight':
        offsetX = this.dest.position.x - this.src.position.x
        offsetY = this.dest.position.y - this.src.position.y
        break;
      case 'bezier':
        offsetX = this.dest.position.x - this.bezierControlPoints[1].x
        offsetY = this.dest.position.y - this.bezierControlPoints[1].y
        break;
    }
    if (offsetY === 0) {
      angle = (offsetX >= 0) ? Math.PI / 2 : - Math.PI / 2
    }
    else if (offsetY < 0) {
      angle = Math.atan(offsetX / -offsetY)
    }
    else {
      angle = Math.PI - Math.atan(offsetX / offsetY)
    }

    return angle
  }
  calcBezierArea () {
    let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity
    let xs = []
    xs.push(this.src.position.x, this.dest.position.x
      , this.bezierControlPoints[0].x, this.bezierControlPoints[1].x)
    let ys = []
    ys.push(this.src.position.y, this.dest.position.y
      , this.bezierControlPoints[0].y, this.bezierControlPoints[1].y)

    for (let i = 0; i < 4; i++) {
      left = (xs[i] < left) ? xs[i] : left
      right = (xs[i] > right) ? xs[i] : right
      top = (ys[i] < top) ? ys[i] : top
      bottom = (ys[i] > bottom) ? ys[i] : bottom
    }

    // Return [left, top, width, height].
    return [left, top, right - left, bottom - top]
  }
  drawArrow (angle, context) {
    let fillStyle = this.drawStyle.strokeStyle
    switch (this.arrowType) {
      case 'solid':
        fillStyle = this.drawStyle.strokeStyle
        break;
      case 'dashed':
        fillStyle = '#FFFFFF'
        break;
    }

    context.translate(this.drawEndPosition.x, this.drawEndPosition.y)
    context.rotate(angle)
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(4, 12)
    context.lineTo(-4, 12)
    context.closePath()
    context.fillStyle = fillStyle
    context.fill()
    context.stroke()
    context.rotate(-angle)
    context.translate(-this.drawEndPosition.x, -this.drawEndPosition.y)

  }
  drawReferMark (end, context) {
    let position
    if (end === 'src') {
      position = {
        x: this.drawBeginPosition.x,
        y: this.drawBeginPosition.y
      }
    }
    else {
      position = {
        x: this.drawEndPosition.x,
        y: this.drawEndPosition.y
      }
    }
    context.beginPath()
    context.arc(position.x, position.y, this.padding, 0, 2 * Math.PI)
    context.fillStyle = colors.lineArrowHighlight
    context.fill()
  }
  drawLineBody (context) {
    switch (this.linkerType) {
      case 'straight':
        context.beginPath()
        context.moveTo(this.drawBeginPosition.x, this.drawBeginPosition.y)
        context.lineTo(this.drawEndPosition.x, this.drawEndPosition.y)
        context.stroke()
        break;
      case 'bezier':
        let [left, top] = this.calcBezierArea()
        context.beginPath()
        context.moveTo(this.drawBeginPosition.x, this.drawBeginPosition.y)
        context.bezierCurveTo(this.bezierControlPoints[0].x - left + this.padding
          , this.bezierControlPoints[0].y - top + this.padding
          , this.bezierControlPoints[1].x - left + this.padding
          , this.bezierControlPoints[1].y - top + this.padding
          , this.drawEndPosition.x, this.drawEndPosition.y)
        context.stroke()
        context.beginPath()
        break;
    }
  }
  draw (referMark, isSelected, drawContext) {
    let context = (typeof drawContext === 'undefined' || drawContext === null )
      ? this.context : drawContext

    if (context === this.context) {
      this.clearCanvas()
    }
    this.setDrawStyle(context)
    this.calcDrawingBeginEndPoints()

    if (referMark) {
      this.drawReferMark(referMark, context)
    }

    this.drawLineBody(context)
    if (isSelected) {
      context.strokeStyle = colors.lineBodyHighlight
      context.lineWidth = 6
      this.drawLineBody(context)
    }

    this.drawArrow(this.calcArrowAngle(), context)
  }
  drawOnOtherCanvas (context, left, top) {
    context.translate(left, top)
    this.draw(null, false, context)
    context.translate(-left, -top)
  }
  // Judge whether a point is in the rectangle area which is covered by
  isPointInLineRectangle (x, y) {
    let [ x1, y1, x2, y2 ] = this.calcJudgingBeginEndPoints()
    let xBig = (x1 >= x2) ? x1 : x2
    let xSmall = (xBig === x2) ? x1 : x2
    let yBig = (y1 >= y2) ? y1 : y2
    let ySmall = (yBig === y2) ? y1 : y2

    // The calculated result of point might not be accurate,
    // it will effect the judgement when x1 === x2 or y1 === y2.
    // So, it requires a small enough number to help.
    return (x <= xBig + delta && x >= xSmall - delta
      && y <= yBig + delta && y >= ySmall - delta)
  }
  isInLine (x, y, endExcluded) {
    if (!endExcluded) {
      if (this.isInLineEnd(x, y)) {
        return false
      }
    }
    let distance
    let [ x1, y1, x2, y2 ] = this.calcJudgingBeginEndPoints()
    switch  (this.linkerType) {
      case 'straight':
        // Calculate the distance from point to line.
        distance = calcPointToLineDistance([x, y], [x1, y1, x2, y2])
        let foot = calcPointToLineFoot([x, y], [x1, y1, x2, y2])

        return (distance <= lineAreaWidth && this.isPointInLineRectangle(foot.x, foot.y))
      case 'bezier':
        distance = calcPointToBezier([x, y]
          , [x1, y1, this.bezierControlPoints[0].x, this.bezierControlPoints[0].y
            , this.bezierControlPoints[1].x, this.bezierControlPoints[1].y, x2, y2])

        return distance <= lineAreaWidth
    }
  }
  isInLineEnd (x, y) {
    let [ x1, y1, x2, y2 ] = this.calcJudgingBeginEndPoints()
    let distanceSrc = calcPointToPointDistance([x, y], [x1, y1])
    let distanceDest = calcPointToPointDistance([x, y], [x2, y2])

    if (distanceDest <= lineAreaWidth) {
     return 'lineDest'
    }
    else if (distanceSrc <= lineAreaWidth) {
      return 'lineSrc'
    }
    return null
  }
  judgeInShape (x, y) {
    let type = this.isInLineEnd(x, y)
    if (!type) {
      type = this.isInLine(x, y, true) ? 'lineBody' : 'empty'
    }
    return { shape: this, type: type }
  }
  callShapesToDetach () {
    if (this.src.shape) {
      this.src.shape.deleteLine(this)
    }
    if (this.dest.shape) {
      this.dest.shape.deleteLine(this)
    }
  }

  resetLinkerArrowStyle (prop, value) {
    if (prop === 'linkerType') {
      this.linkerType = value
      this.reCalcBezierControlPoints()
      this.draw(null, true)
    }
    else {
      this.arrowType = value
      this.clearCanvas()
      this.draw(null, true)
    }
  }
  resetTextareaSingleStyle(prop, value) {
  }
  resetDrawSingleStyle(prop, value) {
    if (_.containsProp(this.drawStyle, prop)) {
      this.drawStyle[prop] = value
      this.clearCanvas()
      this.draw(null, true)
    }
  }
  resetSingleStyle (prop, value) {
    if (this[prop]) {
      return this.resetLinkerArrowStyle(prop, value)
    }
    else if (_.contains(_.properties(this.textStyle), prop)) {
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
    style.linkerType = this.linkerType
    style.arrowType = this.arrowType
    return style
  }
  getStyleOfType (type) {
    let styleName = tools[type].styleName
    if (this[type]) {
      return this[type]
    }
    if (_.contains(_.properties(this.drawStyle), styleName)) {
      return this.drawStyle[styleName]
    }
  }
}

export default Line
