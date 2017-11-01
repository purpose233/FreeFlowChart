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

  let c = a*a - b*b
  let A = c*c
  let B = 2*x0*a*a*c
  let C = Math.pow(y0*a*b,2)+Math.pow(x0*a*a,2)-Math.pow(a*c,2)
  let D = 2*x0*Math.pow(a,4)*c
  let E = -Math.pow(a,6)*x0*x0

  let result = calcQuarticEquation(A, B, C, D, E)
  let possiblePoint = []
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      let ys = calcYofEllipse(result[i])
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
  return {
    x: bestPoint.x + m,
    y: bestPoint.y + n
  }
}

export {calcPositionInCanvas, calcPointToLineFoot, calcPointOnLine}
