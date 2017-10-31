import getUIParameters from '../../common/getUIParameters'
import {generalizeLine, generalizePoint} from "./common";

function calcPositionInCanvas (x, y) {
  let drawLayout = document.getElementById('draw-layout')
  let parameters = getUIParameters()
  return {
    x: x - parameters.canvasLeft - (parameters.canvasPadding - drawLayout.scrollLeft),
    y: y - parameters.canvasTop - (parameters.canvasPadding - drawLayout.scrollTop)
  }
}

function calcPointToLineFoot (point, line) {
  let [x, y] = generalizePoint(point)
  let [A, B, C] = generalizeLine(line)
  return {
    x: (B * B * x - A * B * y - A * C) / (A * A + B * B),
    y: (-A * B * x + A * A * y - B * C) / (A * A + B * B)
  }
}

function calcPointOnLine (pointA, pointB, percent) {
  let [x1, y1] = generalizePoint(pointA)
  let [x2, y2] = generalizePoint(pointB)
  return {
    x: x1 + (x2 - x1) * percent,
    y: y1 + (y2 - y1) * percent
  }
}

export {calcPositionInCanvas, calcPointToLineFoot, calcPointOnLine}
