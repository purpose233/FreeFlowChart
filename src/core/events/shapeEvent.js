import {calcPositionInCanvas} from '../calculation/calcPosition'
import {createNewLine} from '../createNewShape'
import eventCommon from './common'

let clickOffset = {
  x: 0,
  y: 0
}
let activeDirection = null
let resizeData = {
  beginX: 0,
  beginY: 0,
  originWidth: 0,
  originHeight: 0,
  originLeft: 0,
  originTop: 0
}

function redrawActiveLine (shape, reference, mark) {
  if (eventCommon.lineData.type === 'toSrc') {
    let src = {
      shape: shape,
      position: reference.position
    }
    eventCommon.lineData.src = {
      shape: shape,
      position: reference.position,
      referPosition: (reference.referPosition) ? reference.referPosition : null,
      referPercent: (reference.referPercent) ? reference.referPercent : null
    }
    eventCommon.lineData.activeLine.resetSrc(src)
  }
  else {
    let dest = {
      shape: shape,
      position: reference.position
    }
    eventCommon.lineData.dest = {
      shape: shape,
      position: reference.position,
      referPosition: (typeof reference.referPosition !== 'undefined') ? reference.referPosition : null,
      referPercent: (typeof reference.referPercent !== 'undefined') ? reference.referPercent : null
    }
    eventCommon.lineData.activeLine.resetDest(dest)
  }
  eventCommon.lineData.activeLine.draw(mark, !!eventCommon.lineData.selectedLine)
}

function shapeEventOnMouseDown (event, shapeList) {
  let judgeResult = eventCommon.judgeEventAt(event, shapeList)
  if (!judgeResult) {
    eventCommon.shapeController.setVisibility(false)
    return
  }

  let shape = judgeResult.shape, type = judgeResult.type
  let position = calcPositionInCanvas(event.pageX, event.pageY)
  switch (type) {
    case 'lineBody':
      if (eventCommon.lineData.selectedLine) {
        eventCommon.lineData.selectedLine.draw()
      }
      eventCommon.lineData.selectedLine = shape
      shape.draw(null, true)
      eventCommon.selectedShape = null
      eventCommon.shapeController.setVisibility(false)
      break;
    case 'lineDest':
    case 'lineSrc':
      eventCommon.selectedShape = null
      eventCommon.shapeController.setVisibility(false)
      if (eventCommon.lineData.selectedLine) {
        eventCommon.lineData.selectedLine.draw()
      }
      eventCommon.lineData.selectedLine = shape
      shape.draw(null, true)
      eventCommon.lineData.activeLine = shape
      eventCommon.lineData.isActive = true
      let reference
      if (shape.dest.shape) {
        reference = shape.dest.shape.getLineData(shape)
        eventCommon.lineData.dest = {
          shape: shape.dest.shape,
          referPosition: reference.referPosition,
          referPercent: reference.referPercent,
          position: shape.dest.position
        }
      }
      if (shape.src.shape) {
        reference = shape.src.shape.getLineData(shape)
        eventCommon.lineData.src = {
          shape: shape.src.shape,
          referPosition: reference.referPosition,
          referPercent: reference.referPercent,
          position: shape.src.position
        }
      }
      eventCommon.lineData.src.position = shape.src.position

      if (type === 'lineDest') {
        if (shape.dest.shape) {
          shape.dest.shape.deleteLine(shape)
        }
        eventCommon.lineData.type = 'toDest'
      }
      else {
        if (shape.src.shape) {
          shape.src.shape.deleteLine(shape)
        }
        eventCommon.lineData.type = 'toSrc'
      }
      break;
    case 'shapeBody':
      eventCommon.shapeController.reset(shape.left, shape.top, shape.width, shape.height)
      eventCommon.shapeController.setVisibility(true)
      eventCommon.shapeController.draw(shape.width, shape.height)

      eventCommon.activeShape = shape
      clickOffset.x = event.pageX - shape.left
      clickOffset.y = event.pageY - shape.top

      if (eventCommon.lineData.selectedLine) {
        eventCommon.lineData.selectedLine.draw()
        eventCommon.lineData.selectedLine = null
      }
      event.preventDefault()
      break;
    case 'shapeLineArea':
      let lineReference = shape.getLineReference(position.x, position.y)

      eventCommon.lineData.src = {
        position: lineReference.position,
        referPosition: lineReference.referPosition,
        referPercent: lineReference.referPercent,
        shape: shape
      }
      eventCommon.lineData.isActive = true
      eventCommon.lineData.type = 'new'
      eventCommon.lineData.needDeleted = true

       if (eventCommon.lineData.selectedLine) {
        eventCommon.lineData.selectedLine.draw()
        eventCommon.lineData.selectedLine = null
      }
      break;
    case 'controller':
      activeDirection = event.target.getAttribute('resizedir')
      resizeData.beginX = event.pageX
      resizeData.beginY = event.pageY
      resizeData.originWidth = eventCommon.selectedShape.width
      resizeData.originHeight = eventCommon.selectedShape.height
      resizeData.originLeft = eventCommon.selectedShape.left
      resizeData.originTop = eventCommon.selectedShape.top
      break;
    case 'tool': break;
    case 'empty':
    default:
      if (eventCommon.lineData.selectedLine) {
        eventCommon.lineData.selectedLine.draw()
        eventCommon.lineData.selectedLine = null
      }
      eventCommon.selectedShape = null
      eventCommon.shapeController.setVisibility(false)
  }
}

function shapeEventOnMouseMove (event, shapeList) {
  if (eventCommon.lineData.isActive) {
    let src, dest
    if (!eventCommon.lineData.activeLine) {
      src = {
        shape: eventCommon.lineData.src.shape,
        position: eventCommon.lineData.src.position
      }
      dest = {
        shape: null,
        position: calcPositionInCanvas(event.pageX, event.pageY)
      }

      eventCommon.lineData.activeLine = createNewLine(src, dest)
      eventCommon.lineData.activeLine.draw()
      eventCommon.lineData.activeLine.append()
      eventCommon.lineData.activeLine.el.style.cursor = 'move'
    }
    else {
      eventCommon.lineData.needDeleted = false
      let position = calcPositionInCanvas(event.pageX, event.pageY)
      let judgeResult = eventCommon.judgeEventAt(event, shapeList)
      if (!judgeResult) {
        redrawActiveLine(null, {position: position})
        return
      }

      let shape = judgeResult.shape
      switch (judgeResult.type) {
        case 'shapeBody':
        case 'shapeLineArea':
          let fromShapeId
          if (eventCommon.lineData.type === 'toSrc') {
            fromShapeId = (eventCommon.lineData.dest.shape) ? eventCommon.lineData.dest.shape.id : null
          }
          else {
            fromShapeId = (eventCommon.lineData.src.shape) ? eventCommon.lineData.src.shape.id : null
          }
          if (fromShapeId === shape.id) {
            eventCommon.lineData.needDeleted = true
            redrawActiveLine(null, {position: position})
          }
          else {
            let reference = shape.getLineReference(position.x, position.y)
            if (!reference) {
              return
            }
            let mark = (eventCommon.lineData.type === 'toSrc') ? 'src' : 'dest'
            redrawActiveLine(shape, reference, mark)
          }
          break;
        default:
          redrawActiveLine(null, {position: position})
      }
    }
  }
  else if (activeDirection) {
    let width, height, offsetX, offsetY
    switch (activeDirection) {
      case 'nw':
        width = resizeData.beginX - event.pageX + resizeData.originWidth
        height = resizeData.beginY - event.pageY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45
        offsetX = width - resizeData.originWidth
        offsetY = height - resizeData.originHeight

        eventCommon.selectedShape.setSize(width, height)
        eventCommon.selectedShape.setPosition(resizeData.originLeft - offsetX, resizeData.originTop - offsetY)
        eventCommon.shapeController.reset(eventCommon.selectedShape.left, eventCommon.selectedShape.top, width, height)
        break;
      case 'ne':
        width = event.pageX - resizeData.beginX + resizeData.originWidth
        height = resizeData.beginY - event.pageY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45
        offsetX = width - resizeData.originWidth
        offsetY = height - resizeData.originHeight

        eventCommon.selectedShape.setSize(width, height)
        eventCommon.selectedShape.setPosition(resizeData.originLeft, resizeData.originTop - offsetY)
        eventCommon.shapeController.reset(eventCommon.selectedShape.left, eventCommon.selectedShape.top, width, height)
        break;
      case 'se':
        width = event.pageX - resizeData.beginX + resizeData.originWidth
        height = event.pageY - resizeData.beginY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45

        eventCommon.selectedShape.setSize(width, height)
        eventCommon.shapeController.reset(eventCommon.selectedShape.left, eventCommon.selectedShape.top, width, height)
        break;
      case 'sw':
        width = resizeData.beginX - event.pageX + resizeData.originWidth
        height = event.pageY - resizeData.beginY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45
        offsetX = width - resizeData.originWidth
        offsetY = height - resizeData.originHeight

        eventCommon.selectedShape.setSize(width, height)
        eventCommon.selectedShape.setPosition(resizeData.originLeft - offsetX, resizeData.originTop)
        eventCommon.shapeController.reset(eventCommon.selectedShape.left, eventCommon.selectedShape.top, width, height)
        break;
    }
    eventCommon.selectedShape.draw()
    eventCommon.selectedShape.resetLinesPosition()
    eventCommon.shapeController.draw(width, height)
  }
  else if (eventCommon.activeShape) {
    let x = event.pageX - clickOffset.x
    let y = event.pageY - clickOffset.y
    eventCommon.activeShape.setPosition(x, y)
    eventCommon.shapeController.reset(x, y, eventCommon.activeShape.width, eventCommon.activeShape.height)
    eventCommon.activeShape.resetLinesPosition()
  }
  else {
    let judgeResult = eventCommon.judgeEventAt(event, shapeList)
    if (!judgeResult) { return }
    let shape = judgeResult.shape
    let el = (judgeResult.topElement || (shape && shape.el))
    if (!el) { return }
    switch (judgeResult.type) {
      case 'lineBody':
        el.style.cursor = 'pointer'
        break;
      case 'lineDest':
      case 'lineSrc':
        el.style.cursor = 'move'
        break;
      case 'shapeBody':
        el.style.cursor = 'move'
        break;
      case 'shapeLineArea':
        el.style.cursor = 'crosshair'
        break;
      default:
        el.style.cursor = 'default'
    }
  }
}

function shapeEventOnMouseUp (event, shapeList) {
  if (eventCommon.lineData.isActive) {
    let line = eventCommon.lineData.activeLine
    if (!line) { return }
    switch (eventCommon.lineData.type) {
      case 'new':
        if (eventCommon.lineData.needDeleted) {
          line.destruct()
        }
        else {
          if (line.src.shape) {
            line.src.shape.addLine(line, 'src', eventCommon.lineData.src.referPosition, eventCommon.lineData.src.referPercent)
          }
          if (line.dest.shape) {
            line.dest.shape.addLine(line, 'dest', eventCommon.lineData.dest.referPosition, eventCommon.lineData.dest.referPercent)
          }
          shapeList.push(line)
        }
        break;
      case 'toDest':
        if (line.dest.shape) {
          line.dest.shape.addLine(line, 'dest', eventCommon.lineData.dest.referPosition, eventCommon.lineData.dest.referPercent)
        }
        break;
      case 'toSrc':
        if (line.src.shape) {
          line.src.shape.addLine(line, 'src', eventCommon.lineData.src.referPosition, eventCommon.lineData.src.referPercent)
        }
        break;
    }
    // Remove the line mark.
    line.draw(null, !!eventCommon.lineData.selectedLine)
    eventCommon.clearLineData()
  }
  else if (eventCommon.activeShape) {
    eventCommon.selectedShape = eventCommon.activeShape
    eventCommon.activeShape = null
  }
  else if (activeDirection) {
    activeDirection = null
  }
}

function shapeEventOnDblClick (event, shapeList) {
  let judgeResult = eventCommon.judgeEventAt(event, shapeList)
  if (!judgeResult) { return }

  switch (judgeResult.type) {
    case 'shapeBody':
      judgeResult.shape.shapeText.focus()
      document.execCommand('selectAll')
      break;
    default:
      eventCommon.shapeController.setVisibility(false)
  }
}

function shapeEventOnKeyDown (event, shapeList) {
  if (event.key === 'Delete') {
    if (eventCommon.selectedShape || eventCommon.activeShape) {
      let shape = (eventCommon.activeShape) ? eventCommon.activeShape : eventCommon.selectedShape
      let isActive = !!eventCommon.activeShape
      eventCommon.shapeController.setVisibility(false)
      eventCommon.deleteShapeInListById(shape.id, shapeList)

      if (isActive) {
        eventCommon.activeShape = null
      }
      eventCommon.selectedShape = null
    }
    else if (eventCommon.lineData.isActive || eventCommon.lineData.selectedLine) {
      let line = (eventCommon.lineData.isActive) ? eventCommon.lineData.activeLine : eventCommon.lineData.selectedLine
      eventCommon.deleteShapeInListById(line.id, shapeList)
      eventCommon.clearLineData()
    }
  }
}

export {shapeEventOnMouseMove, shapeEventOnMouseDown, shapeEventOnMouseUp,
  shapeEventOnDblClick, shapeEventOnKeyDown}
