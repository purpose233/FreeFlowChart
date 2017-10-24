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
  currentShape.el.style.position = 'fixed'
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

function dragNewComponetMouseUp (event, shapeList) {
  mouseDown = false

  if (currentShape && event.clientX <= getUIParameters().canvasLeft) {
    currentShape.remove()
  }
  else if (currentShape) {
    //let left = (event.clientX - currentShape.width / 2 - toolbarWidth) - (padding - drawLayout.scrollLeft)
    //let top = (event.clientY - currentShape.height / 2 - headerHeight) - (padding - drawLayout.scrollTop)
    let position = calcPositionInCanvas(event.clientX, event.clientY)
    let left = position.x - currentShape.width / 2
    let top = position.y - currentShape.height / 2

    currentShape.setPosition(left, top)
    currentShape.el.style.position = 'absolute'
    shapeList.push(currentShape)
  }

  currentShape = null
}

export {dragNewComponentMouseDown, dragNewComponetMouseMove, dragNewComponetMouseUp}
