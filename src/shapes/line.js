import {getDefaultSetting, drawingDefaultSetting} from './shapeDefaultSetting'
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

    this.width = 0
    this.height = 0
    this.left = 0
    this.top = 0

    if (settings) {

    }
    let temp = getDefaultSetting('line')
    this.linkerType = temp.linkerType
    this.arrowType = temp.arrowType

    this.strokeStyle = drawingDefaultSetting.strokeStyle
    this.lineWidth = drawingDefaultSetting.lineWidth
    this.lineDash = drawingDefaultSetting.lineDash

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
    this.resetCanvas()
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
    switch (this.linkerType) {
      case 'straight':
        let width = Math.abs(this.src.position.x - this.dest.position.x) + 20
        let height = Math.abs(this.src.position.y - this.dest.position.y) + 20

        this.canvas.width = this.el.width = this.width = width
        this.el.style.width = this.canvas.style.width = width + 'px'
        this.canvas.height = this.el.height = this.height = height
        this.el.style.height = this.canvas.style.height = height + 'px'

        let x, y
        if ((this.dest.position.x - this.src.position.x) >= 0) {
          x = this.src.position.x - 10
        }
        else {
          x = this.dest.position.x - 10
        }
        if ((this.dest.position.y - this.src.position.y) >= 0) {
          y = this.src.position.y - 10
        }
        else {
          y = this.dest.position.y - 10
        }
        this.setPosition(x, y)
        break;
      case 'bezier':
        break;
    }
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
  resetDrawStyle () {
    this.context.strokeStyle = this.strokeStyle
    this.context.lineWidth = this.lineWidth
    this.context.setLineDash(this.lineDash)
  }
  drawArrow (angle) {
    this.context.translate(this.drawEndPosition.x, this.drawEndPosition.y)
    this.context.rotate(angle)
    this.context.beginPath()
    this.context.moveTo(0, 0)
    this.context.lineTo(5, 14)
    this.context.lineTo(-5, 14)
    this.context.fillStyle = '#000000'
    this.context.fill()
    this.context.translate(-this.drawEndPosition.x, -this.drawEndPosition.y)
  }
  drawReferMark (end) {
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
    this.context.beginPath()
    this.context.arc(position.x, position.y, 10, 0, 2 * Math.PI)
    this.context.fillStyle = colors.lineArrowHightlight
    this.context.fill()
  }
  calcDrawingBeginEndPoints () {
    if ((this.dest.position.x - this.src.position.x) >= 0) {
      this.drawBeginPosition.x = 10
      this.drawEndPosition.x = this.width - 10
    }
    else {
      this.drawBeginPosition.x = this.width - 10
      this.drawEndPosition.x = 10
    }
    if ((this.dest.position.y - this.src.position.y) >= 0) {
      this.drawBeginPosition.y = 10
      this.drawEndPosition.y = this.height - 10
    }
    else {
      this.drawBeginPosition.y = this.height - 10
      this.drawEndPosition.y = 10
    }
  }
  calcJudgingBeginEndPoints () {
    let x1, x2, y1, y2
    if ((this.dest.position.x - this.src.position.x) >= 0) {
      x1 = this.left + 10
      x2 = this.left + this.width - 10
    }
    else {
      x1 = this.left + this.width - 10
      x2 = this.left + 10
    }
    if ((this.dest.position.y - this.src.position.y) >= 0) {
      y1 = this.top + 10
      y2 = this.top + this.height - 10
    }
    else {
      y1 = this.top + this.height - 10
      y2 = this.top + 10
    }
    return [ x1, y1, x2, y2 ]
  }
  clearCanvas () {
    this.canvas.width = this.width
  }
  calcArrowAngle () {
    let angle
    switch (this.linkerType) {
      case 'straight':
        let offsetX = this.dest.position.x - this.src.position.x
        let offsetY = this.dest.position.y - this.src.position.y
        if (offsetY === 0) {
          angle = (offsetX >= 0) ? Math.PI / 2 : - Math.PI / 2
        }
        else if (offsetY < 0) {
          angle = Math.atan(offsetX / -offsetY)
        }
        else {
          angle = Math.PI - Math.atan(offsetX / offsetY)
        }
        break;
      case 'bezier':
        break;
    }
    return angle
  }
  drawLineBody () {
    switch (this.linkerType) {
      case 'straight':
        this.context.beginPath()
        this.context.moveTo(this.drawBeginPosition.x, this.drawBeginPosition.y)
        this.context.lineTo(this.drawEndPosition.x, this.drawEndPosition.y)
        this.context.stroke()
        break;
      case 'bezier':
        this.context.beginPath()
        this.context.moveTo(this.drawBeginPosition.x, this.drawBeginPosition.y)
        this.context.bezierCurveTo(this.bezierControlPoints[0].x, this.bezierControlPoints[0].y,
          this.bezierControlPoints[1].x, this.bezierControlPoints[1].y,
          this.drawEndPosition.x, this.drawEndPosition.y)
        this.context.stroke()
        this.context.beginPath()
        break;
    }
  }
  draw (referMark, isSelected) {
    this.clearCanvas()
    this.resetDrawStyle()
    this.calcDrawingBeginEndPoints()

    if (referMark) {
      this.drawReferMark(referMark)
    }

    this.drawLineBody()
    if (isSelected) {
      this.context.strokeStyle = colors.lineBodyHighlight
      this.context.lineWidth = 6
      this.drawLineBody()
    }

    this.drawArrow(this.calcArrowAngle())
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