import Shape from './shape'

const arcWidthHeightRatio = 0.6
const lineAreaWidth = 10

function isPointWithinEllipse (point, ellipse) {
  let [x, y] = point
  let [a, b, m, n] = ellipse
  let result = (x-m)*(x-m)/(a*a)+(y-n)*(y-n)/(b*b)
  return result <= 1
}

function isInTerminalShape (x, y, left, top, width, height) {
  // Note that the left, right, width, height are about
  // the rectangle of real terminal. Padding is excluded.
  if (x > left && x < left + width && y > top && y< top + height) {
    return true
  }
  let ellipseLeft = [height/2*arcWidthHeightRatio, height/2, left, top+height/2]
  let ellipseRight = [height/2*arcWidthHeightRatio, height/2, left+width, top+height/2]

  return (isPointWithinEllipse([x, y], ellipseLeft)
    || isPointWithinEllipse([x, y], ellipseRight))
}

class Terminator extends Shape {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  draw (paddingHorizontal, paddingVertical) {
    let horizontal = typeof paddingHorizontal === 'undefined' ? 10 : paddingHorizontal
    let vertical = typeof paddingVertical === 'undefined' ? 10 : paddingVertical

    let radius = (this.height - 2 * vertical) / 2
    let centerA = [], centerB = []
    centerA.x = horizontal / arcWidthHeightRatio + radius
    centerA.y = vertical + radius
    centerB.x = (this.width - horizontal) / arcWidthHeightRatio - radius
    centerB.y = vertical + radius

    this.resetDrawStyle()
    this.context.beginPath()
    this.context.scale(arcWidthHeightRatio, 1)
    this.context.lineWidth = this.drawStyle.lineWidth / arcWidthHeightRatio
    this.context.arc(centerA.x, centerA.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    this.context.lineWidth = this.drawStyle.lineWidth
    this.context.lineTo(centerB.x, vertical)
    this.context.lineWidth = this.drawStyle.lineWidth / arcWidthHeightRatio
    this.context.arc(centerB.x, centerB.y, radius, 1.5 * Math.PI, 0.5 * Math.PI)
    this.context.lineWidth = this.drawStyle.lineWidth
    this.context.closePath()
    this.context.fill()
    this.context.stroke()
  }
  isPositionInShape (x, y) {
    return isInTerminalShape(x, y, this.left + 10, this.top + 10
      , this.width - 20, this.height - 20)
  }
  isPositionInLineArea (x, y, bodyExcluded) {
    if (!bodyExcluded && this.isPositionInShape(x, y)) { return false }

    return isInTerminalShape(x, y, this.left + 10, this.top
      , this.width - 20, this.height)
  }
  judgeInShape (x, y) {
    let type
    type = (this.isPositionInShape(x, y)) ? 'shapeBody' : null
    type = (!type) ? ((this.isPositionInLineArea(x, y, true)) ? 'shapeLineArea' : 'empty') : type
    return { shape: this, type: type }
  }
  calcRectangleData () {
    let b = (this.height - 20) / 2

  }
  // ReferPosition includes top, right, bottom, left, topBorder, neBorder, seBorder, swBorder.
  calcLinePosition (referPosition, referPercent) {

  }
  calcShapePoints () {

  }
  calcLineAreaPoints () {

  }
  getLineReference (x, y) {
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
