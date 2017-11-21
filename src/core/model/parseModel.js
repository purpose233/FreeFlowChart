import {createNewShape, createNewLine} from '../createNewShape'

function parseModel (model) {
  if (!model) { return [] }

  let lines = [], shapes = []
  let lineModel, shapeModel
  for (let i = 0; i < model.lines.length; i++) {
    lineModel = model.lines[i]
    let src = {
      shape: null,
      position: lineModel.src.position
    }
    let dest = {
      shape: null,
      position: lineModel.dest.position
    }
    lines.push(createNewLine(src, dest, lineModel))
  }

  for (let i = 0; i < model.shapes.length; i++) {
    shapeModel = model.shapes[i]
    let relativeLinesBefore = shapeModel.relativeLines
    let relativeLinesNew = [], shape
    for (let j = 0; j < relativeLinesBefore.length; j++) {
      relativeLinesNew.push({
        line: lines[relativeLinesBefore[j].lineIndex],
        type: relativeLinesBefore[j].type,
        referPosition: relativeLinesBefore[j].referPosition,
        referPercent: relativeLinesBefore[j].referPercent
      })
    }
    shapeModel.relativeLines = relativeLinesNew
    shape = createNewShape(shapeModel.type, shapeModel)
    shape.el.style.position = 'absolute'
    shapes.push(shape)
    shapeModel.relativeLines = relativeLinesBefore
  }

  for (let i = 0; i < model.lines.length; i++) {
    lineModel = model.lines[i]
    if (lineModel.src.shapeIndex !== null) {
      lineModel.src.shape = shapes[lineModel.src.shapeIndex]
    }
    if (lineModel.dest.shapeIndex !== null) {
      lineModel.dest.shape = shapes[lineModel.dest.shapeIndex]
    }
  }

  return shapes.concat(lines)
}

export default parseModel
