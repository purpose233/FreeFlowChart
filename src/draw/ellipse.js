const minDelta = 0.1
function generalizeAngle (angle) {
  while (angle < 0 || angle >= 2 * Math.PI) {
    angle = (angle < 0) ? angle + 2 * Math.PI : angle
    angle = (angle >= 2 * Math.PI) ? angle - 2 * Math.PI : angle
  }
  return angle
}
function calcPointOnEllipse (x, y, a, b, angle, counterclockwise) {
  if (counterclockwise) {
    return [a * Math.cos(angle) + x, - b * Math.sin(angle) + y]
  }
  else {
    return [a * Math.cos(angle) + x, b * Math.sin(angle) + y]
  }
}
// The angle of quadrant for counterclockwise === false and true.
// Quadrant 1: 1.5 * PI - 2   * PI, 0   * PI - 0.5 * PI
// Quadrant 2: 1   * PI - 1.5 * PI, 0.5 * PI - 1   * PI
// Quadrant 3: 0.5 * PI - 1   * PI, 1   * PI - 1.5 * PI
// Quadrant 4: 0   * PI - 0.5 * PI, 1.5 * PI - 2   * PI
// The angle here must be generalized.
function judgeAngleInQuadrant (angle, counterclockwise) {
  if (counterclockwise) {
    if (0 <= angle && angle < 0.5 * Math.PI) {
      return 1
    }
    else if (0.5 * Math.PI <= angle && angle < Math.PI) {
      return 2
    }
    else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
      return 3
    }
    else if (1.5 * Math.PI <= angle && angle < 2 * Math.PI) {
      return 4
    }
  }
  else {
    if (1.5 * Math.PI <= angle && angle < 2 * Math.PI) {
      return 1
    }
    else if (Math.PI <= angle && angle < 1.5 * Math.PI) {
      return 2
    }
    else if (0.5 * Math.PI <= angle && angle < Math.PI) {
      return 3
    }
    else if (0 <= angle && angle < 0.5 * Math.PI) {
      return 4
    }
  }
  return null
}
const k = 0.5522848
function getControlPointsOfQuadrant (quadrant, x, y, a, b, counterclockwise) {
  // Horizontal control point offset.
  let ox = a * k
  // Vertical control point offset.
  let oy = b * k
  switch (quadrant) {
    case 1:
      if (!counterclockwise) { return [x + ox, y - b, x + a, y - oy] }
      else { return [x + a, y - oy, x + ox, y - b] }
    case 2:
      if (!counterclockwise) { return [x - a, y - oy, x - ox, y - b] }
      else { return [x - ox, y - b, x - a, y - oy] }
    case 3:
      if (!counterclockwise) { return [x - ox, y + b, x - a, y + oy] }
      else { return [x - a, y + oy, x - ox, y + b] }
    case 4:
      if (!counterclockwise) { return [x + a, y + oy, x + ox, y + b] }
      else { return [x + ox, y + b, x + a, y + oy] }
  }
  // ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
  // ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
  // ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
  // ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
}
function getEndPointOfQuadrant (quadrant, x, y, a, b, counterclockwise) {
  switch (quadrant) {
    case 1:
      if (!counterclockwise) { return [x + a, y] }
      else { return [x, y - b] }
    case 2:
      if (!counterclockwise) { return [x, y - b] }
      else { return [x - a, y] }
    case 3:
      if (!counterclockwise) { return [x - a, y] }
      else { return [x, y + b] }
    case 4:
      if (!counterclockwise) { return [x, y + b] }
      else { return [x + a, y] }
  }
}

// The function use bezier curvy to fit the ellipse.
// When the angle is not 0, 0.5 * PI, 1.5 * PI or 2 * PI,
// the result of draw couldn't be accurate.
function ellipseTo (context, x, y, a, b, sAngle, eAngle, counterclockwise) {
  if (typeof sAngle === 'undefined' || sAngle === null) {
    sAngle = 0
  }
  if (typeof eAngle === 'undefined' || eAngle === null) {
    eAngle = 2 * Math.PI
  }
  let [sx, sy] = calcPointOnEllipse(x, y, a, b, sAngle, counterclockwise)
  let [ex, ey] = calcPointOnEllipse(x, y, a, b, eAngle, counterclockwise)

  context.moveTo(sx, sy);
  if (sAngle === eAngle) {
    return
  }
  sAngle = generalizeAngle(sAngle)
  eAngle = generalizeAngle(eAngle)
  let quadrantS = judgeAngleInQuadrant(sAngle, counterclockwise)
  let quadrantE = judgeAngleInQuadrant(eAngle, counterclockwise)
  let needContinue = 0
  let currQuadrant = quadrantS, beforeQuadrant
  let cx1, cy1, cx2, cy2, drawEndX, drawEndY

  if (sAngle >= eAngle) {
    needContinue = 2
  }
  do {
    // Note that the ';' can't be missed!
    beforeQuadrant = currQuadrant;
    [cx1, cy1, cx2, cy2] = getControlPointsOfQuadrant(currQuadrant, x, y, a, b, counterclockwise)
    let tempEndX, tempEndY
    if (currQuadrant === quadrantE && needContinue <= 0) {
      tempEndX = ex
      tempEndY = ey
    }
    else {
      [tempEndX, tempEndY] = getEndPointOfQuadrant(currQuadrant, x, y, a, b, counterclockwise)
    }
    if (typeof drawEndX === 'undefined' || Math.abs(tempEndX - drawEndX) > minDelta) {
      drawEndX = tempEndX
      drawEndY = tempEndY
      context.bezierCurveTo(cx1, cy1, cx2, cy2, drawEndX, drawEndY)
    }

    needContinue--
    if (counterclockwise) {
      currQuadrant++
      currQuadrant = currQuadrant > 4 ? currQuadrant - 4 : currQuadrant
    }
    else {
      currQuadrant--
      currQuadrant = currQuadrant <= 0 ? currQuadrant + 4 : currQuadrant
    }
  } while (beforeQuadrant !== quadrantE || needContinue > 0)
}

export default ellipseTo
