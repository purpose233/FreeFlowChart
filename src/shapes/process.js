import Shape from './shape'

class Process extends Shape {
  constructor (el, type, settings) {
    super(el, type, settings)
  }
  draw (paddingHorizontal, paddingVertical, drawContext) {
    // Note that only the padding of the component is not default.
    let horizontal = (typeof paddingHorizontal === 'undefined' || paddingHorizontal === null)
      ? this.padding : paddingHorizontal
    let vertical = (typeof paddingVertical === 'undefined' || paddingVertical === null)
      ? this.padding : paddingVertical
    let context = (typeof drawContext === 'undefined' || drawContext === null )
      ? this.context : drawContext

    this.setDrawStyle(context)
    context.fillRect(horizontal, vertical, this.width - 2 * horizontal, this.height - 2 * vertical)
    context.beginPath()
    context.rect(horizontal, vertical, this.width - 2 * horizontal, this.height - 2 * vertical);
    context.stroke()
  }
  isPositionInShape (x, y) {
    return (x > this.left + this.padding && x < this.left + this.width - this.padding
      && y > this.top + this.padding && y < this.top + this.height - this.padding)
  }
  isPositionInLineArea (x, y) {
    if (this.isPositionInShape(x, y)) {
      return false
    }
    else return (x >= this.left && x <= this.left + this.width
      && y >= this.top && y <= this.top + this.height)
  }
  judgeInShape (x, y) {
    let type
    type = (this.isPositionInShape(x, y)) ? 'shapeBody' : null
    type = (!type) ? ((this.isPositionInLineArea(x, y)) ? 'shapeLineArea' : 'empty') : type
    return { shape: this, type: type }
  }

  // Every shape rely on it's own way to calculate line end positions
  // and all what the lines need to get is just the positions.

  // ReferPosition includes up, down, left, right, nwCorner, neCorner, seCorner, swCorner.
  // Note that the referPercent is based on inner width of the shape.
  calcLinePosition (referPosition, referPercent) {
    let x, y
    let points = this.calcShapePoints()
    switch (referPosition) {
      case 'nwCorner':
        x = points[0]
        y = points[1]
        break
      case 'neCorner':
        x = points[2]
        y = points[3]
        break
      case 'seCorner':
        x = points[4]
        y = points[5]
        break
      case 'swCorner':
        x = points[6]
        y = points[7]
        break
      case 'up':
        x = this.left + this.padding + referPercent * (this.width - 2 * this.padding)
        y = this.top + this.padding
        break
      case 'down':
        x = this.left + this.padding + referPercent * (this.width - 2 * this.padding)
        y = this.top + this.height - this.padding
        break
      case 'left':
        x = this.left + this.padding
        y = this.top + this.padding + referPercent * (this.height - 2 * this.padding)
        break
      case 'right':
        x = this.left + this.width - this.padding
        y = this.top + this.padding + referPercent * (this.height - 2 * this.padding)
        break
    }
    return { x: x, y: y }
  }
  calcShapePoints () {
    // Points: nw -> ne -> se -> sw
    let x1 = this.left + this.padding, y1 = this.top + this.padding
    let x2 = this.left + this.width - this.padding, y2 = this.top + this.padding
    let x3 = this.left + this.width - this.padding, y3 = this.top + this.height - this.padding
    let x4 = this.left + this.padding, y4 = this.top + this.height - this.padding
    return [ x1, y1, x2, y2, x3, y3, x4, y4 ]
  }
  getLineReference (x, y) {
    let referPosition = null, referPercent = 0, position
    let [ x1, y1, x2, y2, x3, y3, x4, y4 ] = this.calcShapePoints()
    if (this.isPositionInLineArea(x, y)) {
      if (y < y1) {
        if (x < x1) {
          referPosition = 'nwCorner'
        }
        else if (x > x2) {
          referPosition = 'neCorner'
        }
        else {
          referPosition = 'up'
          referPercent = (x - x1) / (this.width - 2 * this.padding)
        }
      }
      else if (y > y4) {
        if (x < x4) {
          referPosition = 'swCorner'
        }
        else if (x > x3) {
          referPosition = 'seCorner'
        }
        else {
          referPosition = 'down'
          referPercent = (x - x4) / (this.width - 2 * this.padding)
        }
      }
      else {
        if (x < this.left + this.width / 2) {
          referPosition = 'left'
          referPercent = (y - this.top - this.padding) / (this.height - 2 * this.padding)
        }
        else {
          referPosition = 'right'
          referPercent = (y - this.top - this.padding) / (this.height - 2 * this.padding)
        }
      }
    }
    else if (this.isPositionInShape(x, y)) {
      referPercent = 0.5
      // check the position in which area of the shape
      // the areas are shown below:
      //  __
      // |\/|
      // |/\|
      //  --
      let lineRefer1 = (x - x3) / (x1 - x3) - (y - y3) / (y1 - y3)
      let lineRefer2 = (x - x4) / (x2 - x4) - (y - y4) / (y2 - y4)
      //let lineRefer1 = ((x - this.left - this.width + this.padding) / (2 * this.padding - this.width)
      //  - (y - this.top - this.height + this.padding) / (2 * this.padding - this.height))
      //let lineRefer2 = ((x - this.left - this.width + this.padding) / (2 * this.padding - this.width)
      //  - (y - this.top - this.padding) / (-2 * this.padding + this.height))
      if (lineRefer1 <= 0 && lineRefer2 <= 0) {
        referPosition = 'up'
      }
      else if (lineRefer1 <= 0 && lineRefer2 >= 0) {
        referPosition = 'right'
      }
      else if (lineRefer1 >= 0 && lineRefer2 >= 0) {
        referPosition = 'down'
      }
      else {
        referPosition = 'left'
      }
    }
    else {
      return null
    }

    position = this.calcLinePosition(referPosition, referPercent)
    return {
      referPosition: referPosition,
      referPercent: referPercent,
      position: position
    }
  }
}

// Basically, each shape behaves like this one
// and these function must be contained for calling:
// draw, judgeInShape, getLineReference

export default Process
