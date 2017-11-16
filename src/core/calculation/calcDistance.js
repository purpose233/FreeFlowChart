import {generalizeLine, generalizePoint, generalizeBezier} from "./common";

function calcPointToPointDistance (pointA, pointB) {
  let [x1, y1] = generalizePoint(pointA)
  let [x2, y2] = generalizePoint(pointB)
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function calcPointToLineDistance (point, line) {
  let [x, y] = generalizePoint(point)
  let [A, B, C] = generalizeLine(line)
  return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)
}

function calcBezierArea (bezier) {
  let [x1,y1,x2,y2,x3,y3,x4,y4] = generalizeBezier(bezier)
  let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity
  let xs = []
  xs.push(x1, x2, x3, x4)
  let ys = []
  ys.push(y1, y2, y3, y4)

  for (let i = 0; i < 4; i++) {
    left = (xs[i] < left) ? xs[i] : left
    right = (xs[i] > right) ? xs[i] : right
    top = (ys[i] < top) ? ys[i] : top
    bottom = (ys[i] > bottom) ? ys[i] : bottom
  }

  // Return [left, top, width, height].
  return [right - left, bottom - top]
}

const bezierTravelDelta = 1
function calcPointToBezier (point, bezier) {
  let [x0, y0] = generalizePoint(point)
  let [x1,y1,x2,y2,x3,y3,x4,y4] = generalizeBezier(bezier)
  let [width, height] = calcBezierArea(bezier)

  let xList = [], yList = []
  let count = Math.floor(Math.sqrt(width * width + height * height) / bezierTravelDelta)
  count = count < 10 ? 10 : count
  let minDistance = Infinity
  for (let i = 0; i <= count; i++) {
    let t = i * (1 / count)
    xList[i] = x1*Math.pow(1-t,3) + 3*x2*t*(1-t)*(1-t) + 3*x3*t*t*(1-t)+x4*t*t*t
    yList[i] = y1*Math.pow(1-t,3) + 3*y2*t*(1-t)*(1-t) + 3*y3*t*t*(1-t)+y4*t*t*t
  }

  for (let i = 1; i <= count; i++) {
    let tempDistance = (x0 - xList[i]) * (x0 - xList[i]) + (y0 - yList[i]) * (y0 - yList[i])
    minDistance = tempDistance < minDistance ? tempDistance : minDistance
  }
  return Math.sqrt(minDistance)
}

export {calcPointToPointDistance, calcPointToLineDistance, calcPointToBezier}
