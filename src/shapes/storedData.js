import Terminator from './terminator'

class StoredData extends Terminator {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  draw (paddingHorizontal, paddingVertical) {
    let horizontal = typeof paddingHorizontal === 'undefined' ? this.padding : paddingHorizontal
    let vertical = typeof paddingVertical === 'undefined' ? this.padding : paddingVertical

    let radius = (this.height - 2 * vertical) / 2
    let centerA = [], centerB = []
    centerA.x = horizontal / this.calcWidthHeightRatio() + radius
    centerA.y = vertical + radius
    centerB.x = (this.width - horizontal) / this.calcWidthHeightRatio() - radius
    centerB.y = vertical + radius

    this.resetDrawStyle()
    this.context.beginPath()
    this.context.scale(this.calcWidthHeightRatio(), 1)
    this.context.arc(centerA.x, centerA.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    this.context.lineTo(centerB.x, vertical)
    this.context.arc(centerB.x, centerB.y, radius, 1.5 * Math.PI, 0.5 * Math.PI)
    this.context.closePath()
    this.context.fill()
    this.context.arc(centerB.x, centerB.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    this.context.stroke()
  }
}

export default StoredData
