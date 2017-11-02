import getUIParameters from '../../common/getUIParameters'
import {generalizeLine, generalizePoint, generalizeEllipse, calcQuarticEquation} from "./common";

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

function calcYofEllipse(x, ellipse) {
  let [a, b, m, n] = generalizeEllipse(ellipse)
  if (!!m) { x -= m }
  if (x < -a || x > a) { return null }

  let y = b*Math.sqrt(1-x*x/(a*a))
  return [y + n, -y + n]
}

function calcPointToEllipseClosestPoint (point, ellipse) {
  let [x0, y0] = generalizePoint(point)
  let [a, b, m, n] = generalizeEllipse(ellipse)

  // Set the ellipse at origin point.
  if (!!m) { x0 -= m }
  if (!!n) { y0 -= n }

  // Note that c presents c * c.
  let c = a*a - b*b

  let A = c*c
  let B = -2*x0*a*a*c
  let C = (y0*a*b)*(y0*a*b)+x0*x0*a*a*a*a-a*a*c*c
  let D = 2*x0*a*a*a*a*c
  let E = -a*a*a*a*a*a*x0*x0

  if (A !== 0) {
    B /= A, C /= A, D /= A, E /= A, A = 1
  }

  let result = calcQuarticEquation(A, B, C, D, E)
  let possiblePoint = []
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      let ys = calcYofEllipse(result[i], [a, b, 0, 0])
      if (ys) {
        possiblePoint.push({x:result[i], y:ys[0]})
        possiblePoint.push({x:result[i], y:ys[1]})
      }
    }
  }

  let bestPoint = null, shortestDistance = Infinity, tempDistance
  for (let i = 0; i < possiblePoint.length; i++) {
    tempDistance = (possiblePoint[i].x-x0)*(possiblePoint[i].x-x0)+(possiblePoint[i].y-y0)*(possiblePoint[i].y-y0)
    if (tempDistance < shortestDistance) {
      bestPoint = possiblePoint[i]
      shortestDistance = tempDistance
    }
  }
  // Only the point returned is the real point,
  // all others are points after moved.
  return bestPoint ? {
    x: bestPoint.x + m,
    y: bestPoint.y + n
  } : null
}

export {calcPositionInCanvas, calcPointToLineFoot, calcPointOnLine, calcPointToEllipseClosestPoint}
