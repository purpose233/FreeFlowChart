import Terminator from './terminator'
import ellipseTo from '../draw/ellipse'

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

    // Use bezier curvy to fit ellipse instead of scaling.
    let b = (this.height - 2 * vertical) / 2
    let a = b * this.calcWidthHeightRatio()
    let centerA = {}, centerB = {}
    centerA.x = horizontal + a
    centerA.y = vertical + b
    centerB.x = this.width - horizontal - a
    centerB.y = vertical + b

    this.setDrawStyle(context)
    context.beginPath()
    ellipseTo(context, centerA.x, centerA.y, a, b, 0.5 * Math.PI, 1.5 * Math.PI)
    context.lineTo(centerB.x, vertical)
    ellipseTo(context, centerB.x, centerB.y, a, b, 1.5 * Math.PI, 0.5 * Math.PI)
    context.lineTo(centerA.x, this.height - vertical)
    context.fill()
    ellipseTo(context, centerB.x, centerB.y, a, b, 0.5 * Math.PI, 1.5 * Math.PI)
    context.stroke()

    /*
    let radius = (this.height - 2 * vertical) / 2
    let centerA = [], centerB = []
    centerA.x = horizontal / this.calcWidthHeightRatio() + radius
    centerA.y = vertical + radius
    centerB.x = (this.width - horizontal) / this.calcWidthHeightRatio() - radius
    centerB.y = vertical + radius

    this.setDrawStyle(context)
    context.beginPath()
    context.scale(this.calcWidthHeightRatio(), 1)
    context.arc(centerA.x, centerA.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    context.lineTo(centerB.x, vertical)
    context.arc(centerB.x, centerB.y, radius, 1.5 * Math.PI, 0.5 * Math.PI)
    context.closePath()
    context.fill()
    context.arc(centerB.x, centerB.y, radius, 0.5 * Math.PI, 1.5 * Math.PI)
    context.stroke()
    context.scale(1 / this.calcWidthHeightRatio(), 1)*/
  }
}

export default StoredData
