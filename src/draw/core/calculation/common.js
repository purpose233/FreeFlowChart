// Line can be presented by (x - x2) / (x1 - x2) = (y - y2) / (x1 - y2)
// or Ax + By + C = 0
// or Kx + B = y
// The order of parameters must be [x1, y1, x2, y2], [A, B, C] or [K, B].

// Points must contain x and y.
// The order of parameters must be [x, y] or {x, y}

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

function generalizePoint (point) {
  if (Array.isArray(point)) {
    return point
  }
  else {
    return [point.x, point.y]
  }
}

export {generalizeLine, generalizePoint}
