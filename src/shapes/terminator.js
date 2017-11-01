import Shape from './shape'

const arcWidthHeightRatio = 0.6

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

  }
  isPositionInLineArea (x, y, bodyExcluded) {
  }
  judgeInShape (x, y) {
  }
  calcLinePosition (referPosition, referPercent) {
  }
  calcShapePoints () {
  }
  calcLineAreaPoints () {
  }
  getLineReference (x, y) {
  }
  resetLinesPosition () {
  }
}

export default Terminator
