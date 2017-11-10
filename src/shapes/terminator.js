import Shape from './shape'

const defaultWidthHeightRatio = 0.6
const lineAreaWidth = 7

function isPointWithinEllipse (point, ellipse) {
  let [x, y] = point
  let [a, b, m, n] = ellipse
  let result = (x-m)*(x-m)/(a*a)+(y-n)*(y-n)/(b*b)
  return result <= 1
}

function isInTerminalShape (x, y, left, top, width, height, radio) {
  // Note that the left, right, width, height are about
  // the circumscribed rectangle of real terminal. Padding is excluded.
  let a = height / 2 * radio, b = height / 2
  let innerLeft = left + a, innerTop = top
  let innerWidth = width - 2 * a, innerHeight = height
  if (x > innerLeft && x < innerLeft + innerWidth
    && y > innerTop && y < innerTop + innerHeight) {
    return true
  }
  let ellipseLeft = [a, b, innerLeft, innerTop + innerHeight / 2]
  let ellipseRight = [a, b, innerLeft + innerWidth, innerTop + innerHeight / 2]

  return (isPointWithinEllipse([x, y], ellipseLeft)
    || isPointWithinEllipse([x, y], ellipseRight))
}

function calcXOfEllipse (ellipse, y, isLeft) {
  let [a, b, m, n] = ellipse

  let temp = a * Math.sqrt(1 - (y - n) * (y - n) / (b * b))
  return m + temp * (isLeft ? -1 : 1)
}

function judgeInShapeArea (x, y, left, top, width, height) {
  let lineResultA, lineResultB
  let x1 = left, y1 = top
  let x2 = left + width, y2 = top + height
  lineResultA = (x - x2) / (x1 - x2) - (y - y2) / (y1 - y2)
  x1 = left + width, y1 = top
  x2 = left, y2 = top + height
  lineResultB = (x - x2) / (x1 - x2) - (y - y2) / (y1 - y2)
  if (lineResultA <= 0) {
    return lineResultB < 0 ? 'top' : 'right'
  }
  else {
    return lineResultB > 0 ? 'bottom': 'left'
  }
}

class Terminator extends Shape {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  // And a problem still exists: currently, I use function scale and arc to
  // draw the ellipse, and it works fine for most time. But when the scale radio
  // is way to big, it will cause the line of ellipse being too thin.
  // Maybe I can try using bezier instead of arc.
  draw (paddingHorizontal, paddingVertical, drawContext) {
    let horizontal = (typeof paddingHorizontal === 'undefined' || paddingHorizontal === null)
      ? this.padding : paddingHorizontal
    let vertical = (typeof paddingVertical === 'undefined' || paddingVertical === null)
      ? this.padding : paddingVertical
    let context = (typeof drawContext === 'undefined' || drawContext === null )
      ? this.context : drawContext

    let radius = (this.height - 2 * vertical) / 2
    let radio = this.calcWidthHeightRatio()
    let centerA = [], centerB = []
    centerA.x = horizontal / radio + radius
    centerA.y = vertical + radius
    centerB.x = (this.width - horizontal) / radio - radius
    centerB.y = vertical + radius

    this.setDrawStyle(context)
    context.beginPath()
    context.scale(this.calcWidthHeightRatio(), 1)
    context.arc(centerA.x, centerA.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    context.lineTo(centerB.x, vertical)
    context.arc(centerB.x, centerB.y, radius, 1.5 * Math.PI, 0.5 * Math.PI)
    context.closePath()
    context.fill()
    context.stroke()
    context.scale(1 / this.calcWidthHeightRatio(), 1)
  }
  drawOnOtherCanvas (context, left, top) {
    context.translate(left, top)
    this.draw(null, null, context)
    context.translate(-left, -top)
  }
  isPositionInShape (x, y) {
    return isInTerminalShape(x, y, this.left + this.padding, this.top + this.padding
      , this.width - 2 * this.padding, this.height - 2 * this.padding, this.calcWidthHeightRatio())
  }
  isPositionInLineArea (x, y, bodyExcluded) {
    if (!bodyExcluded && this.isPositionInShape(x, y)) { return false }

    let deltaA = lineAreaWidth * this.calcWidthHeightRatio()
    let deltaWidth = (1 - this.calcWidthHeightRatio()) * lineAreaWidth
    return isInTerminalShape(x, y, this.left + this.padding - deltaA - deltaWidth, this.top
      , this.width - 2 * this.padding + 2 * (deltaA + deltaWidth), this.height, this.calcWidthHeightRatio())
  }
  judgeInShape (x, y) {
    let type
    type = (this.isPositionInShape(x, y)) ? 'shapeBody' : null
    type = (!type) ? ((this.isPositionInLineArea(x, y, true)) ? 'shapeLineArea' : 'empty') : type
    return { shape: this, type: type }
  }
  calcWidthHeightRatio () {
    let innerWidth = this.width - this.padding * 2, innerHeight = this.height - this.padding * 2
    let a = innerHeight / 2 * defaultWidthHeightRatio
    if (innerWidth >= 3 * a) {
      return defaultWidthHeightRatio
    }
    else {
      return (innerWidth / 3) / (innerHeight / 2)
    }
  }
  calcInnerShapeData () {
    let innerTop = this.top + this.padding
    let innerHeight = this.height - 2 * this.padding
    let a = innerHeight / 2 * this.calcWidthHeightRatio(), b = innerHeight / 2
    let innerLeft = this.left + this.padding + a
    let innerWidth = this.width - 2 * this.padding - 2 * a

    let ellipseLeft = [a, b, innerLeft, innerTop + innerHeight / 2]
    let ellipseRight = [a, b, innerLeft + innerWidth, innerTop + innerHeight / 2]
    return [innerLeft, innerTop, innerWidth, innerHeight, ellipseLeft, ellipseRight]
  }
  // ReferPosition includes top, right, bottom, left, nwCorner, neCorner, seCorner, swCorner.
  calcLinePosition (referPosition, referPercent) {
    let x, y
    let [innerLeft, innerTop, innerWidth, innerHeight, ellipseLeft, ellipseRight] = this.calcInnerShapeData()
    switch (referPosition) {
      case 'nwCorner':
        x = innerLeft
        y = innerTop
        break;
      case 'neCorner':
        x = innerLeft + innerWidth
        y = innerTop
        break;
      case 'seCorner':
        x = innerLeft + innerWidth
        y = innerTop + innerHeight
        break;
      case 'swCorner':
        x = innerLeft
        y = innerTop + innerHeight
        break;
      case 'top':
        x = innerLeft + innerWidth * referPercent
        y = innerTop
        break;
      case 'right':
        y = innerTop + innerHeight * referPercent
        x = calcXOfEllipse(ellipseRight, y, false)
        break;
      case 'bottom':
        x = innerLeft + innerWidth * referPercent
        y = innerTop + innerHeight
        break;
      case 'left':
        y = innerTop + innerHeight * referPercent
        x = calcXOfEllipse(ellipseLeft, y, true)
        break;
    }
    return { x: x, y: y }
  }
  getLineReference (x, y) {
    let referPosition = null, referPercent = 0, position
    let [innerLeft, innerTop, innerWidth, innerHeight, ellipseLeft, ellipseRight] = this.calcInnerShapeData()

    if (this.isPositionInShape(x, y)) {
      referPercent = 0.5
      referPosition = judgeInShapeArea(x, y, innerLeft, innerTop, innerWidth, innerHeight)
    }
    else if (this.isPositionInLineArea(x, y, true)) {
      if (y <= innerTop) {
        if (x <= innerLeft) {
          referPosition = 'nwCorner'
        }
        else if (x >= innerLeft + innerWidth) {
          referPosition = 'neCorner'
        }
        else {
          referPosition = 'top'
          referPercent = (x - innerLeft) / innerWidth
        }
      }
      else if (y >= innerTop + innerHeight) {
        if (x <= innerLeft) {
          referPosition = 'swCorner'
        }
        else if (x >= innerLeft + innerWidth) {
          referPosition = 'seCorner'
        }
        else {
          referPosition = 'bottom'
          referPercent = (x - innerLeft) / innerWidth
        }
      }
      else {
        referPercent = (y - innerTop) / innerHeight
        referPosition = (x < innerLeft + innerWidth / 2) ? 'left' : 'right'
      }
    }
    else {return null}

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

export default Terminator
