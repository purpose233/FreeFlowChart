import {lineSetting, drawingDefaultSetting, textDefaultSetting, defaultPadding} from './lineDefaultSetting'
import {calcPointToPointDistance, calcPointToLineDistance} from "../core/calculation/calcDistance";
import {calcPointToLineFoot} from "../core/calculation/calcPosition";
import colors from '../common/colors'

let lineId = 0
const lineAreaWidth = 7
// Delta is a number which is small enough
// that it can be used while judging whether
// two floating numbers are equal.
const delta = 0.1

// Cubic bezier curve:
// begin point: (x0,y0), control points: (x1,y1), (x2,y2), end point: (x3,y3)
// x(t) = ax * t ^ 3 + bx * t ^ 2 + cx * t + x0
// y(t) = ay * t ^ 3 + by * t ^ 2 + cy * t + y0
// x1 = x0 + cx / 3
// x2 = x1 + ( cx + bx ) / 3
// x3 = x0 + cx + bx + ax
// y1 = y0 + cy / 3
// y2 = y1 + ( cy + by ) / 3
// y3 = y0 + cy + by + ay
// cx = 3 * ( x1 - x0 )
// bx = 3 * ( x2 - x1 ) - cx
// ax = x3 - x0 - cx - bx
// cy = 3 * ( y1 - y0 )
// by = 3 * ( y2 - y1 ) - cy
// ay = y3 - y0 - cy - by
// x(t) = (1-t)^3x0 + 3t(1-t)^2x1 + 3t^2(1-t)x2 + t^3x3
// y(t) = (1-t)^3y0 + 3t(1-t)^2y1 + 3t^2(1-t)y2 + t^3y3

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

    if (settings) {

    }
    let temp = lineSetting

    this.linkerType = temp.linkerType
    this.linkerType = 'bezier'

    this.arrowType = temp.arrowType

    this.drawStyle = {
      strokeStyle: drawingDefaultSetting.strokeStyle,
      lineWidth: drawingDefaultSetting.lineWidth,
      lineDash: drawingDefaultSetting.lineDash
    }

    this.drawBeginPosition = {}
    this.drawEndPosition = {}
    this.bezierControlPoints = []

    this.init()
  }
  destruct () {
    this.remove()
    this.callShapesToDetach()
  }
  init () {
    if (this.bezierControlPoints.length === 0) {
      let offsetX = this.dest.position.x - this.src.position.x
      let offsetY = this.dest.position.y - this.src.position.y

      this.bezierControlPoints.push({
        x: this.src.position.x + offsetX / 3,
        y: this.src.position.y + offsetY / 3
      })
      this.bezierControlPoints.push({
        x: this.src.position.x + 2 * offsetX / 3,
        y: this.src.position.y + 2 * offsetY / 3
      })
    }
    this.resetCanvas()
  }
  clearCanvas () {
    this.canvas.width = this.width
  }
  resetSrcPosition (position) {
    this.src.position = position
    this.resetCanvas()
  }
  resetDestPosition (position) {
    this.dest.position = position
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
    this.resetCanvas()
  }
  resetDest (dest) {
    this.dest = dest
    this.resetCanvas()
  }
  setPosition (x, y) {
    this.left = x
    this.top = y
    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'
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
    let x1, x2, y1, y2
    if ((this.dest.position.x - this.src.position.x) >= 0) {
      x1 = this.left + this.padding
      x2 = this.left + this.width - this.padding
    }
    else {
      x1 = this.left + this.width - this.padding
      x2 = this.left + this.padding
    }
    if ((this.dest.position.y - this.src.position.y) >= 0) {
      y1 = this.top + this.padding
      y2 = this.top + this.height - this.padding
    }
    else {
      y1 = this.top + this.height - this.padding
      y2 = this.top + this.padding
    }
    return [ x1, y1, x2, y2 ]
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
    context.translate(this.drawEndPosition.x, this.drawEndPosition.y)
    context.rotate(angle)
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(5, 14)
    context.lineTo(-5, 14)
    context.fillStyle = '#000000'
    context.fill()
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
        context.bezierCurveTo(this.bezierControlPoints[0].x - left, this.bezierControlPoints[0].y - top
          , this.bezierControlPoints[1].x - left, this.bezierControlPoints[1].y - top
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
    let [ x1, y1, x2, y2 ] = this.calcJudgingBeginEndPoints()
    switch  (this.linkerType) {
      case 'straight':
        // Calculate the distance from point to line.
        let distance = calcPointToLineDistance([x, y], [x1, y1, x2, y2])
        let foot = calcPointToLineFoot([x, y], [x1, y1, x2, y2])

        return (distance <= lineAreaWidth && distance >= -lineAreaWidth
          && this.isPointInLineRectangle(foot.x, foot.y))

        break;
      case 'bezier':
        break;
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
}

export default Line
