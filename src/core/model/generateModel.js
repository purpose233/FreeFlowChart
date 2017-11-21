// The data model is based on the shape list. And it looks like this: {'lines','shapes'}
// Shapes except line include: {'index','type','left','top','width','height','text'
//   ,'drawStyle','textStyle','relativeLines'}
// The variable 'relativeLines' of shape include {'lineIndex','type','referPosition','referPercent'}.
// Line include {'index','left','top','width','height','text','src','dest'
//   ,'linkerType','arrowType','drawStyle','textStyle','bezierControlPoints'}
// The variable 'src' and 'dest' include {'shapeIndex','position'}
// Note that indexes are only used for connecting shapes and lines.
// And all ids need to be regenerated.

import _ from '../../common/util'

function getModelofShape (shape, index, lines, idMap) {
  let relativeLines = []
  for (let i = 0; i < shape.relativeLines.length; i++) {
    relativeLines.push({
      'lineIndex': idMap[shape.relativeLines[i].line.id],
      'type': shape.relativeLines[i].type,
      'referPosition': shape.relativeLines[i].referPosition,
      'referPercent': shape.relativeLines[i].referPercent
    })
  }
  return {
    'index': index,
    'type': shape.type,
    'left': shape.left,
    'top': shape.top,
    'width': shape.width,
    'height': shape.height,
    'text': shape.shapeText.value,
    'drawStyle': shape.drawStyle,
    'textStyle': shape.textStyle,
    'relativeLines': relativeLines
  }
}

function getModelofLine (line, index, shapes, idMap) {
  let src = {
    'shapeIndex': line.src.shape ? idMap[line.src.shape.id] : null,
    'position': line.src.position
  }
  let dest = {
    'shapeIndex': line.dest.shape ? idMap[line.dest.shape.id] : null,
    'position': line.dest.position
  }
  return {
    'index': index,
    'left': line.left,
    'top': line.top,
    'width': line.width,
    'height': line.height,
    'text': line.shapeText.value,
    'src': src,
    'dest': dest,
    'linkerType': line.linkerType,
    'arrowType': line.arrowType,
    'drawStyle': line.drawStyle,
    'textStyle': line.textStyle,
    'bezierControlPoints': line.bezierControlPoints
  }
}

function generateModel (shapeList) {
  let model = {
    shapes: [],
    lines: []
  }

  let idMap = {}
  let shapes = [], lines = []

  let lineIndex = 0, shapeIndex = 0
  for (let i = 0; i < shapeList.length; i++) {
    if (shapeList[i].type === 'line') {
      lines.push(shapeList[i])
      idMap[shapeList[i].id] = lineIndex++
    }
    else {
      shapes.push(shapeList[i])
      idMap[shapeList[i].id] = shapeIndex++
    }
  }

  for (let i = 0; i < Math.max(shapes.length, lines.length); i++) {
    if (shapes[i]) {
      model.shapes.push(getModelofShape(shapes[i], i, lines, idMap))
    }
    if (lines[i]) {
      model.lines.push(getModelofLine(lines[i], i, shapes, idMap))
    }
  }

  return model
}

export default generateModel
