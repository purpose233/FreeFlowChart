import {calcPositionInCanvas} from '../calculation/calcPosition'
import controllerDraw from '../../draw/controller'
import {createNewLine} from '../createNewShape'

let shapeController = {
  el: null,
  canvas: null,
  init: function () {
    this.el = document.getElementById('shape_controls')
    this.canvas = document.getElementById('controls_bounding')
  },
  reset: function (left, top, width, height) {
    if (!this.el) { this.init() }

    this.el.style.left = left + 'px'
    this.el.style.top = top + 'px'
    this.el.style.width = width + 'px'
    this.el.style.height = height + 'px'
  },
  setVisibility: function (visibility) {
    if (!this.el) { this.init() }

    if (visibility) {
      this.el.style.display = 'block'
    }
    else {
      this.el.style.display = 'none'
    }
  },
  draw (width, height) {
    if (!this.el) { this.init() }

    return controllerDraw(this.canvas, width, height, 10)
  }
}
let bezierController = {}
let styleController = {}

let activeShape = null
let selectedShape = null
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

let lineData = {
  selectedLine: null,
  isActive: false,
  src: {
    position: null,
    referPercent: null,
    referPosition: null,
    shape: null
  },
  dest: {
    position: null,
    referPercent: null,
    referPosition: null,
    shape: null
  },
  activeLine: null,
  type: null,
  // This value only works when creating a new line
  needDeleted: false

  // Type values: 'new', 'toDest', 'toSrc'
}

function getShapeInListById (shapeId, shapeList) {
  for (let i = 0; i < shapeList.length; i++) {
    // If the line is being moved, ignore it
    if (lineData.activeLine === shapeList[i]) {
      continue
    }
    if (shapeList[i].id === shapeId)
      return shapeList[i]
  }
  return null
}

function deleteShapeInListById (shapeId, shapeList) {
  for (let i = 0; i < shapeList.length; i++) {
    if (shapeId === shapeList[i].id) {
      let shape = shapeList.splice(i, 1)[0]
      shape.destruct()
      shape = null
      return
    }
  }
}

function isShapeInListById (shapeId, shapeList) {
  for (let i = 0; i < shapeList.length; i++) {
    if (shapeId === shapeList[i].id) {
      return true
    }
  }
  return false
}

function judgeInShapeList (position, shapeList, dir) {
  dir = (typeof dir !== 'undefined') ? dir : 1
  let length = shapeList.length
  let index = (dir > 0) ? 0 : length - 1
  let result
  for (; index >= 0 && index < length; index += dir) {
    // If the line is being moved, ignore it.
    if (lineData.isActive && shapeList[index] === lineData.activeLine) {
      continue
    }
    if (shapeList[index].judgeInShape) {
      result = shapeList[index].judgeInShape(position.x, position.y)
      if (result.type !== 'empty')
        return result
    }
  }
  return null
}

function judgeEventAt (event, shapeList) {
  if (!event.target || !event.target.classList) {
    return { shape: null, type: 'empty' }
  }

  let result, shape
  let position = calcPositionInCanvas(event.pageX, event.pageY)

  if (event.target.classList.contains('shape_controller')) {
    return {
      shape: selectedShape,
      type: 'controller'
    }
  }
  else if (event.target.parentNode.getAttribute
    && event.target.parentNode.getAttribute('id') === 'shape_controls') {
    // For now, the selected shape has no priority
    // which is the same as processon's work.
    result = judgeInShapeList(position, shapeList, -1)
    if (result) {
      result.topElement = shapeController.el
    }
    return result
  }
  else if (event.target.parentNode.classList
    && event.target.parentNode.classList.contains('shape-box')) {
    let shapeId = event.target.parentNode.getAttribute('shapeid')
    shape = getShapeInListById(shapeId, shapeList)

    if (!shape) {
      // Judge whether the shape is already put into the shape list.
      // It happens when users try to drag a new line.
      // TopShape is undefined here.
      return judgeInShapeList(position, shapeList, -1)
    }
    else {
      // Common shape or line will work the same way.
      result = shape.judgeInShape(position.x, position.y)
      result.topElement = shape.el
      if (result && result.type !== 'empty') {
        return result
      }
      else {
        let resultInList = judgeInShapeList(position, shapeList, -1)
        if (resultInList) {
          resultInList.topElement = shape.el
        }
        return (resultInList ? resultInList : result)
      }
    }
  }

  return { shape: null, type: 'empty' }

  // type values: lineBody, lineDest, lineSrc
  //              shapeBody, shapeLineArea
  //              controller
  //              empty
}

function shapeEventOnMouseDown (event, shapeList) {
  let judgeResult = judgeEventAt(event, shapeList)
  if (!judgeResult) {
    shapeController.setVisibility(false)
    return
  }

  let shape = judgeResult.shape, type = judgeResult.type
  let position = calcPositionInCanvas(event.pageX, event.pageY)
  switch (type) {
    case 'lineBody':
      if (lineData.selectedLine) {
        lineData.selectedLine.draw()
      }
      lineData.selectedLine = shape
      shape.draw(null, true)
      selectedShape = null
      shapeController.setVisibility(false)
      break;
    case 'lineDest':
    case 'lineSrc':
      selectedShape = null
      shapeController.setVisibility(false)
      if (lineData.selectedLine) {
        lineData.selectedLine.draw()
      }
      lineData.selectedLine = shape
      shape.draw(null, true)
      lineData.activeLine = shape
      lineData.isActive = true
      let reference
      if (shape.dest.shape) {
        reference = shape.dest.shape.getLineData(shape)
        lineData.dest = {
          shape: shape.dest.shape,
          referPosition: reference.referPosition,
          referPercent: reference.referPercent,
          position: shape.dest.position
        }
      }
      if (shape.src.shape) {
        reference = shape.src.shape.getLineData(shape)
        lineData.src = {
          shape: shape.src.shape,
          referPosition: reference.referPosition,
          referPercent: reference.referPercent,
          position: shape.src.position
        }
      }
      lineData.src.position = shape.src.position

      if (type === 'lineDest') {
        if (shape.dest.shape) {
          shape.dest.shape.deleteLine(shape)
        }
        lineData.type = 'toDest'
      }
      else {
        if (shape.src.shape) {
          shape.src.shape.deleteLine(shape)
        }
        lineData.type = 'toSrc'
      }
      break;
    case 'shapeBody':
      shapeController.reset(shape.left, shape.top, shape.width, shape.height)
      shapeController.setVisibility(true)
      shapeController.draw(shape.width, shape.height)

      activeShape = shape
      clickOffset.x = event.pageX - shape.left
      clickOffset.y = event.pageY - shape.top

      if (lineData.selectedLine) {
        lineData.selectedLine.draw()
        lineData.selectedLine = null
      }
      event.preventDefault()
      break;
    case 'shapeLineArea':
      let lineReference = shape.getLineReference(position.x, position.y)

      lineData.src = {
        position: lineReference.position,
        referPosition: lineReference.referPosition,
        referPercent: lineReference.referPercent,
        shape: shape
      }
      lineData.isActive = true
      lineData.type = 'new'

      if (lineData.selectedLine) {
        lineData.selectedLine.draw()
        lineData.selectedLine = null
      }
      break;
    case 'controller':
      activeDirection = event.target.getAttribute('resizedir')
      resizeData.beginX = event.pageX
      resizeData.beginY = event.pageY
      resizeData.originWidth = selectedShape.width
      resizeData.originHeight = selectedShape.height
      resizeData.originLeft = selectedShape.left
      resizeData.originTop = selectedShape.top
      break;
    case 'empty':
    default:
      if (lineData.selectedLine) {
        lineData.selectedLine.draw()
        lineData.selectedLine = null
      }
      selectedShape = null
      shapeController.setVisibility(false)
  }
}

function redrawActiveLine (shape, reference, mark) {
  if (lineData.type === 'toSrc') {
    let src = {
      shape: shape,
      position: reference.position
    }
    lineData.src = {
      shape: shape,
      position: reference.position,
      referPosition: (reference.referPosition) ? reference.referPosition : null,
      referPercent: (reference.referPercent) ? reference.referPercent : null
    }
    lineData.activeLine.resetSrc(src)
  }
  else {
    let dest = {
      shape: shape,
      position: reference.position
    }
    lineData.dest = {
      shape: shape,
      position: reference.position,
      referPosition: (typeof reference.referPosition !== 'undefined') ? reference.referPosition : null,
      referPercent: (typeof reference.referPercent !== 'undefined') ? reference.referPercent : null
    }
    lineData.activeLine.resetDest(dest)
  }
  lineData.activeLine.draw(mark, !!lineData.selectedLine)
}

function shapeEventOnMouseMove (event, shapeList) {
  if (lineData.isActive) {
    let src, dest
    if (!lineData.activeLine) {
      src = {
        shape: lineData.src.shape,
        position: lineData.src.position
      }
      dest = {
        shape: null,
        position: calcPositionInCanvas(event.pageX, event.pageY)
      }

      lineData.activeLine = createNewLine(src, dest)
      lineData.activeLine.draw()
      lineData.activeLine.append()
    }
    else {
      let position = calcPositionInCanvas(event.pageX, event.pageY)
      let judgeResult = judgeEventAt(event, shapeList)
      if (!judgeResult) {
        redrawActiveLine(null, {position: position})
        return
      }

      let shape = judgeResult.shape
      lineData.needDeleted = false
      switch (judgeResult.type) {
        case 'shapeBody':
        case 'shapeLineArea':
          let fromShapeId
          if (lineData.type === 'toSrc') {
            fromShapeId = (lineData.dest.shape) ? lineData.dest.shape.id : null
          }
          else {
            fromShapeId = (lineData.src.shape) ? lineData.src.shape.id : null
          }
          if (fromShapeId === shape.id) {
            lineData.needDeleted = true
            redrawActiveLine(null, {position: position})
          }
          else {
            let reference = shape.getLineReference(position.x, position.y)
            if (!reference) {
              return
            }
            let mark = (lineData.type === 'toSrc') ? 'src' : 'dest'
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

        selectedShape.setSize(width, height)
        selectedShape.setPosition(resizeData.originLeft - offsetX, resizeData.originTop - offsetY)
        shapeController.reset(selectedShape.left, selectedShape.top, width, height)
        break;
      case 'ne':
        width = event.pageX - resizeData.beginX + resizeData.originWidth
        height = resizeData.beginY - event.pageY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45
        offsetX = width - resizeData.originWidth
        offsetY = height - resizeData.originHeight

        selectedShape.setSize(width, height)
        selectedShape.setPosition(resizeData.originLeft, resizeData.originTop - offsetY)
        shapeController.reset(selectedShape.left, selectedShape.top, width, height)
        break;
      case 'se':
        width = event.pageX - resizeData.beginX + resizeData.originWidth
        height = event.pageY - resizeData.beginY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45

        selectedShape.setSize(width, height)
        shapeController.reset(selectedShape.left, selectedShape.top, width, height)
        break;
      case 'sw':
        width = resizeData.beginX - event.pageX + resizeData.originWidth
        height = event.pageY - resizeData.beginY + resizeData.originHeight
        width = (width >= 60) ? width : 60
        height = (height >= 45) ? height : 45
        offsetX = width - resizeData.originWidth
        offsetY = height - resizeData.originHeight

        selectedShape.setSize(width, height)
        selectedShape.setPosition(resizeData.originLeft - offsetX, resizeData.originTop)
        shapeController.reset(selectedShape.left, selectedShape.top, width, height)
        break;
    }
    selectedShape.draw()
    selectedShape.resetLinesPosition()
    shapeController.draw(width, height)
  }
  else if (activeShape) {
    let x = event.pageX - clickOffset.x
    let y = event.pageY - clickOffset.y
    activeShape.setPosition(x, y)
    shapeController.reset(x, y, activeShape.width, activeShape.height)
    activeShape.resetLinesPosition()
  }
  else {
    let judgeResult = judgeEventAt(event, shapeList)
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

function clearLineData () {
  lineData.activeLine = null
  lineData.isActive = false
  lineData.src = {
    position: null,
      referPercent: null,
      referPosition: null,
      shape: null
  }
  lineData.dest = {
    position: null,
      referPercent: null,
      referPosition: null,
      shape: null
  }
  lineData.needDeleted = false
}

function shapeEventOnMouseUp (event, shapeList) {
  if (lineData.isActive) {
    let line = lineData.activeLine
    if (!line) { return }
    switch (lineData.type) {
      case 'new':
        if (lineData.needDeleted) {
          line.destruct()
        }
        else {
          if (line.src.shape) {
            line.src.shape.addLine(line, 'src', lineData.src.referPosition, lineData.src.referPercent)
          }
          if (line.dest.shape) {
            line.dest.shape.addLine(line, 'dest', lineData.dest.referPosition, lineData.dest.referPercent)
          }
          shapeList.push(line)
        }
        break;
      case 'toDest':
        if (line.dest.shape) {
          line.dest.shape.addLine(line, 'dest', lineData.dest.referPosition, lineData.dest.referPercent)
        }
        break;
      case 'toSrc':
        if (line.src.shape) {
          line.src.shape.addLine(line, 'src', lineData.src.referPosition, lineData.src.referPercent)
        }
        break;
    }
    // Remove the line mark.
    line.draw(null, !!lineData.selectedLine)
    clearLineData()
  }
  else if (activeShape) {
    selectedShape = activeShape
    activeShape = null
  }
  else if (activeDirection) {
    activeDirection = null
  }
}

function shapeEventOnDblClick (event, shapeList) {
  let judgeResult = judgeEventAt(event, shapeList)
  if (!judgeResult) { return }

  switch (judgeResult.type) {
    case 'shapeBody':
      judgeResult.shape.shapeText.focus()
      document.execCommand('selectAll')
      break;
    default:
      shapeController.setVisibility(false)
  }
}

function shapeEventOnKeyDown (event, shapeList) {
  if (event.key === 'Delete') {
    if (selectedShape || activeShape) {
      let shape = (activeShape) ? activeShape : selectedShape
      let isActive = !!activeShape
      shapeController.setVisibility(false)
      deleteShapeInListById(shape.id, shapeList)

      if (isActive) {
        activeShape = null
      }
      selectedShape = null
    }
    else if (lineData.isActive || lineData.selectedLine) {
      let line = (lineData.isActive) ? lineData.activeLine : lineData.selectedLine
      deleteShapeInListById(line.id, shapeList)
      clearLineData()
    }
  }
}

export {shapeEventOnMouseMove, shapeEventOnMouseDown, shapeEventOnMouseUp,
  shapeEventOnDblClick, shapeEventOnKeyDown}
