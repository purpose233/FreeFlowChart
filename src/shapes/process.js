import Shape from './shape'

class Process extends Shape {
  constructor (el, type, left, top, width, height) {
    super(el, type, left, top, width, height)
  }
  draw (paddingHorizontal, paddingVertical) {
    // Note that only the padding of the component is not 10px.
    // All shapes' padding is 10px.
    let horizontal = typeof paddingHorizontal === 'undefined' ? 10 : paddingHorizontal
    let vertical = typeof paddingVertical === 'undefined' ? 10 : paddingVertical

    this.resetDrawStyle()
    this.context.fillRect(horizontal, vertical, this.width - 2 * horizontal, this.height - 2 * vertical)
    this.context.beginPath()
    this.context.rect(horizontal, vertical, this.width - 2 * horizontal, this.height - 2 * vertical);
    this.context.stroke()
  }
  isPositionInShape (x, y) {
    return (x > this.left + 10 && x < this.left + this.width - 10
      && y > this.top + 10 && y < this.top + this.height - 10)
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
        x = this.left + 10 + referPercent * (this.width - 20)
        y = this.top + 10
        break
      case 'down':
        x = this.left + 10 + referPercent * (this.width - 20)
        y = this.top + this.height - 10
        break
      case 'left':
        x = this.left + 10
        y = this.top + 10 + referPercent * (this.height - 20)
        break
      case 'right':
        x = this.left + this.width - 10
        y = this.top + 10 + referPercent * (this.height - 20)
        break
    }
    return { x: x, y: y }
  }
  calcShapePoints () {
    // Points: nw -> ne -> se -> sw
    let x1 = this.left + 10, y1 = this.top + 10
    let x2 = this.left + this.width - 10, y2 = this.top + 10
    let x3 = this.left + this.width - 10, y3 = this.top + this.height - 10
    let x4 = this.left + 10, y4 = this.top + this.height - 10
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
          referPercent = (x - x1) / (this.width - 20)
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
          referPercent = (x - x4) / (this.width - 20)
        }
      }
      else {
        if (x < this.left + this.width / 2) {
          referPosition = 'left'
          referPercent = (y - this.top - 10) / (this.height - 20)
        }
        else {
          referPosition = 'right'
          referPercent = (y - this.top - 10) / (this.height - 20)
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
      //let lineRefer1 = ((x - this.left - this.width + 10) / (20 - this.width)
      //  - (y - this.top - this.height + 10) / (20 - this.height))
      //let lineRefer2 = ((x - this.left - this.width + 10) / (20 - this.width)
      //  - (y - this.top - 10) / (-20 + this.height))
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

// Basically, each shape behaves like this one
// and these function must be contained for calling:
// draw, judgeInShape, getLineReference, resetLinesPosition

export default Process
