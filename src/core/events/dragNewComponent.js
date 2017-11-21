import {createNewShape} from '../createNewShape'
import {calcPositionInCanvas} from '../calculation/calcPosition'
import getUIParameters from '../../common/getUIParameters'

let currentShape = null
let mouseDown = false

function dragNewComponentMouseDown (event, shapeList) {
  if (!event.target.classList.contains('component-item')
    || currentShape)
    return
  let shapeName = event.target.parentNode.getAttribute('shapename')

  currentShape = createNewShape(shapeName)
  currentShape.setPositionStyle('fixed')
  currentShape.setPosition(event.clientX - currentShape.width / 2, event.clientY - currentShape.height / 2)
  currentShape.draw()
  currentShape.append()

  mouseDown = true
}

function dragNewComponetMouseMove (event, shapeList) {
  if (currentShape && mouseDown) {
    currentShape.setPosition(event.clientX - currentShape.width / 2, event.clientY - currentShape.height / 2)
  }
}

function isWithinCanvas (x, y) {
  let uiInfo = getUIParameters()
  return (x >= uiInfo.canvasLeft && x <= uiInfo.canvasRight
    && y >= uiInfo.canvasTop && y <= uiInfo.canvasBottom)
}

function dragNewComponetMouseUp (event, shapeList) {
  mouseDown = false

  if (currentShape && !(isWithinCanvas(event.pageX, event.pageY))) {
    currentShape.remove()
  }
  else if (currentShape) {
    let position = calcPositionInCanvas(event.pageX, event.pageY)
    let left = position.x - currentShape.width / 2
    let top = position.y - currentShape.height / 2

    currentShape.setPosition(left, top)
    currentShape.setPositionStyle('absolute')
    shapeList.push(currentShape)
  }

  currentShape = null
}

export {dragNewComponentMouseDown, dragNewComponetMouseMove, dragNewComponetMouseUp}
