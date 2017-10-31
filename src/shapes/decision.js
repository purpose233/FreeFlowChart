import Shape from './shape'
import {calcPointToLineFoot, calcPointOnLine} from "../core/calculation/calcPosition"

// Calculate the four border line of the decision shape
// in order to judge which side is the point placed at.
function calcBorderLineResult (x, y, points) {
  let lineResult = []
  for (let i = 0; i < 4; i++) {
    let x1 = points[i * 2], y1 = points[i * 2 + 1]
    let x2 = points[(i + 1) * 2 % 8], y2 = points[(i + 1) * 2 % 8 + 1]
    lineResult[i] = (x - x2) / (x1 - x2) - (y - y2) / (y1 - y2)
  }
  return lineResult
}

function calcPercentOfLine (x, y, pointA, pointB) {
  let point = calcPointToLineFoot([x, y], [pointA[0], pointA[1], pointB[0], pointB[1]])
  return (point.x - pointA[0]) / (pointB[0] - pointA[0])
}

class Decision extends Shape {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  draw (paddingHorizontal, paddingVertical) {
    let horizontal = typeof paddingHorizontal === 'undefined' ? 10 : paddingHorizontal
    let vertical = typeof paddingVertical === 'undefined' ? 10 : paddingVertical

    this.resetDrawStyle()
    this.context.beginPath()
    this.context.moveTo(this.width / 2, vertical)
    this.context.lineTo(this.width - horizontal, this.height / 2)
    this.context.lineTo(this.width /2, this.height - vertical)
    this.context.lineTo(horizontal, this.height / 2)
    this.context.closePath()
    this.context.fill()
    this.context.stroke()
  }
  isPositionInShape (x, y) {
    let points = this.calcShapePoints()
    let lineResult = calcBorderLineResult(x, y, points)

    return (lineResult[0] > 0 && lineResult[1] < 0 && lineResult[2] > 0 && lineResult[3] < 0)
  }
  isPositionInLineArea (x, y, bodyExcluded) {
    if (!bodyExcluded && this.isPositionInShape(x, y)) {
      return false
    }
    let points = this.calcLineAreaPoints()
    let lineResult = calcBorderLineResult(x, y, points)

    return (lineResult[0] >= 0 && lineResult[1] <= 0 && lineResult[2] >= 0 && lineResult[3] <= 0)
  }
  judgeInShape (x, y) {
    let type
    type = (this.isPositionInShape(x, y)) ? 'shapeBody' : null
    type = (!type) ? ((this.isPositionInLineArea(x, y, true)) ? 'shapeLineArea' : 'empty') : type
    return { shape: this, type: type }
  }
  // ReferPosition includes top, right, bottom, left, nwBorder, neBorder, seBorder, swBorder.
  calcLinePosition (referPosition, referPercent) {
    let x, y, point
    let points = this.calcShapePoints()
    switch (referPosition) {
      case 'top':
        x = points[0]
        y = points[1]
        break;
      case 'right':
        x = points[2]
        y = points[3]
        break;
      case 'bottom':
        x = points[4]
        y = points[5]
        break;
      case 'left':
        x = points[6]
        y = points[7]
        break;
      case 'nwBorder':
        point = calcPointOnLine([points[6], points[7]], [points[0], points[1]], referPercent)
        break;
      case 'neBorder':
        point = calcPointOnLine([points[0], points[1]], [points[2], points[3]], referPercent)
        break;
      case 'seBorder':
        point = calcPointOnLine([points[2], points[3]], [points[4], points[5]], referPercent)
        break;
      case 'swBorder':
        point = calcPointOnLine([points[4], points[5]], [points[6], points[7]], referPercent)
        break;
    }
    if (point) { return point }
    else { return { x: x, y: y } }
  }
  calcShapePoints () {
    // Points: top -> right -> bottom -> left
    let x1 = this.left + this.width / 2, y1 = this.top + 10
    let x2 = this.left + this.width - 10, y2 = this.top + this.height / 2
    let x3 = this.left + this.width / 2, y3 = this.top + this.height - 10
    let x4 = this.left + 10, y4 = this.top + this.height / 2
    return [ x1, y1, x2, y2, x3, y3, x4, y4 ]
  }
  calcLineAreaPoints () {
    let x1 = this.left + this.width / 2, y1 = this.top
    let x2 = this.left + this.width, y2 = this.top + this.height / 2
    let x3 = this.left + this.width / 2, y3 = this.top + this.height
    let x4 = this.left, y4 = this.top + this.height / 2
    return [ x1, y1, x2, y2, x3, y3, x4, y4 ]
  }
  getLineReference (x, y) {
    let referPosition = null, referPercent = 0, position
    let points = this.calcShapePoints()
    let [ x1, y1, x2, y2, x3, y3, x4, y4 ] = points
    if (this.isPositionInShape(x, y)) {
      let x5 = (x1 + x2) / 2, y5 = (y1 + y2) / 2
      let x6 = (x2 + x3) / 2, y6 = (y2 + y3) / 2
      let x7 = (x3 + x4) / 2, y7 = (y3 + y4) / 2
      let x8 = (x4 + x1) / 2, y8 = (y4 + y1) / 2
      let result = []
      result[0] = (x - x7) / (x5 - x7) - (y - y7) / (y5 - y7)
      result[1] = (x - x8) / (x6 - x8) - (y - y8) / (y6 - y8)
      if (result[1] >= 0) {
        referPosition = result[0] <= 0 ? 'top' : 'right'
      }
      else {
        referPosition = result[0] <= 0 ? 'left' : 'bottom'
      }
    }
    else if (this.isPositionInLineArea(x, y, true)) {
      let pointA, pointB
      let results = calcBorderLineResult(x, y, points)
      if (results[0] <= 0 && results[3] >= 0) {
        referPosition = 'top'
      }
      else if (results[0] <= 0 && results[1] >= 0) {
        referPosition = 'right'
      }
      else if (results[2] <= 0 && results[1] >= 0) {
        referPosition = 'bottom'
      }
      else if (results[2] <= 0 && results[3] >= 0) {
        referPosition = 'left'
      }
      else {
        if (results[0] <= 0) {
          pointA = [x1, y1]
          pointB = [x2, y2]
          referPosition = 'neBorder'
        }
        else if (results[1] >= 0) {
          pointA = [x2, y2]
          pointB = [x3, y3]
          referPosition = 'seBorder'
        }
        else if (results[2] <= 0) {
          pointA = [x3, y3]
          pointB = [x4, y4]
          referPosition = 'swBorder'
        }
        else if (results[3] >= 0) {
          pointA = [x4, y4]
          pointB = [x1, y1]
          referPosition = 'nwBorder'
        }
        referPercent = calcPercentOfLine(x, y, pointA, pointB)
      }
    }
    else { return null }

    position = this.calcLinePosition(referPosition, referPercent)
    return {
      referPosition: referPosition,
      referPercent: referPercent,
      position: position
    }
  }
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

export default Decision
