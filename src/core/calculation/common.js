import _ from '../../common/util'

// Line can be presented by (x - x2) / (x1 - x2) = (y - y2) / (x1 - y2)
// or Ax + By + C = 0
// or Kx + B = y
// The order of parameters must be [x1, y1, x2, y2], [A, B, C] or [K, B].
function generalizeLine (line) {
  switch (line.length) {
    case 2: return [line[0], -1, line[1]]
    case 3: return line
    case 4:
      let [x1, y1, x2, y2] = line
      let A = (y1 - y2) / (x1 - x2)
      let B = -1
      let C = y2 - A * x2
      return [A, B, C]
  }
}

// Points must contain x and y.
// The order of parameters must be [x, y] or {x, y}
function generalizePoint (point) {
  if (_.isArray(point)) {
    return point
  }
  else {
    return [point.x, point.y]
  }
}

// Ellipse is presented by (x - m)^2 / a^2 + (y - n)^2 / b^2 = 1
// Ellipse must contain a and b, m and n are optional.
// The order of parameters must be [a, b, m, n] or {a, b, m, n}
function generalizeEllipse (ellipse) {
  if (_.isArray(ellipse)) {
    return ellipse
  }
  else {
    return [ellipse.a, ellipse.b, ellipse.m, ellipse.n]
  }
}

function calcQuarticEquation (a, b, c, d, e) {
  let result = []
  let t1 = c*c-3*b*d+12*a*e
  let t2 = 2*c*c*c-9*b*c*d+27*a*d*d+27*b*b*e-72*a*c*e

  let temp = Math.pow(t2+Math.sqrt(-4*t1*t1*t1+t2*t2),1/3)
  let P = Math.pow(2,1/3)*t1/(3*a*temp)+temp/(3*Math.pow(2,1/3)*a)

  let Q = 0.5*Math.sqrt(b*b/(4*a*a)-2*c/(3*a)+P)
  if (isNaN(Q)) { return [] }
  let R = b*b/(2*a*a)-4*c/(3*a)-P
  let S = (-b*b*b/(a*a*a)+4*b*c/(a*a)-8*d/a)/(4*Math.sqrt(b*b/(4*a*a)-2*c/(3*a)+P))
  let T1 = 0.5*Math.sqrt(R-S)
  let T2 = 0.5*Math.sqrt(R+S)
  if (!isNaN(T1)) {
    result.push(-b/(4*a)-Q-T1)
    result.push(-b/(4*a)-Q+T1)
  }
  if (!isNaN(T2)) {
    result.push(-b/(4*a)+Q-T2)
    result.push(-b/(4*a)+Q+T2)
  }
  return result
}

export {generalizeLine, generalizePoint, generalizeEllipse, calcQuarticEquation}
