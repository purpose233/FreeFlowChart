import Terminator from './terminator'

class StoredData extends Terminator {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  draw (paddingHorizontal, paddingVertical, drawContext) {
    let horizontal = (typeof paddingHorizontal === 'undefined' || paddingHorizontal === null)
      ? this.padding : paddingHorizontal
    let vertical = (typeof paddingVertical === 'undefined' || paddingVertical === null)
      ? this.padding : paddingVertical
    let context = (typeof drawContext === 'undefined' || drawContext === null )
      ? this.context : drawContext

    let radius = (this.height - 2 * vertical) / 2
    let centerA = [], centerB = []
    centerA.x = horizontal / this.calcWidthHeightRatio() + radius
    centerA.y = vertical + radius
    centerB.x = (this.width - horizontal) / this.calcWidthHeightRatio() - radius
    centerB.y = vertical + radius

    this.resetDrawStyle(context)
    context.beginPath()
    context.scale(this.calcWidthHeightRatio(), 1)
    context.arc(centerA.x, centerA.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    context.lineTo(centerB.x, vertical)
    context.arc(centerB.x, centerB.y, radius, 1.5 * Math.PI, 0.5 * Math.PI)
    context.closePath()
    context.fill()
    context.arc(centerB.x, centerB.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    context.stroke()
    context.scale(1 / this.calcWidthHeightRatio(), 1)
  }
}

export default StoredData
