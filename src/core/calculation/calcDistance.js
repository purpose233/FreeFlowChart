import {generalizeLine, generalizePoint} from "./common";

function calcPointToPointDistance (pointA, pointB) {
  let [x1, y1, x2, y2] = [pointA[0], pointA[1], pointB[0], pointB[1]]
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function calcPointToLineDistance (point, line) {
  let [x, y] = generalizePoint(point)
  let [A, B, C] = generalizeLine(line)
  return (A * x + B * y + C) / Math.sqrt(A * A + B * B)
}

export {calcPointToPointDistance, calcPointToLineDistance}
