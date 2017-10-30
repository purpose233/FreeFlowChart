import getShapeByType from './shapes/index'
import backgroundDraw from './draw/background'
import {eventList, getEventHandlers} from './core/events/index'
import getToolbar from './toolbar/toolbar'

const drawContainerHtml = `<div class="draw-main">
    <div id="draw-components">
    </div>
    <div id="draw-layout">
        <div id="draw-container" style="padding:1000px;">
            <div id="designer_canvas">
                <canvas id="canvas-background"></canvas>
                <div id="shape_controls">
                    <canvas id="controls_bounding" width="120" height="90"></canvas>
                    <div class="shape_controller n w" resizedir="nw" style="cursor:nw-resize; left:6px; top:6px;"></div>
                    <div class="shape_controller n e" resizedir="ne" style="cursor:ne-resize; left:calc(100% - 14px); top:6px;"></div>
                    <div class="shape_controller s e" resizedir="se" style="cursor:se-resize; left:calc(100% - 14px); top:calc(100% - 14px);"></div>
                    <div class="shape_controller s w" resizedir="sw" style="cursor:sw-resize; left:6px; top:calc(100% - 14px);"></div>
                </div>
                <div id="bezier_controls">
                </div>
            </div>
        </div>
    </div>
</div>`

function createContainer (el) {
  el.innerHTML = drawContainerHtml
}

function createComponets (el, shapes) {
  let componentGroup = el
  let tempHtml = ''
  for (let i = 0; i < shapes.length; i++) {
    let shapeName = shapes[i]
    tempHtml += `<div class="component-box" shapename="${shapeName}">
        <canvas class="component-item" width="30" height="30"></canvas>
    </div>`
  }
  componentGroup.innerHTML = tempHtml
  let componentItems = document.getElementsByClassName('component-box')
  for (let i = 0; i < shapes.length; i++) {
    let shapeName = shapes[i]
    let shape = new (getShapeByType(shapeName))(componentItems[i], 'process', -1, -1, 30, 30)
    shape.draw(2, 5)
  }
}

function curryEventHandlers (eventType, shapeList, isToolbarEnabled) {
  let handlers = getEventHandlers(eventType, isToolbarEnabled)
  return function () {
    for (let j = 0; j < handlers.length; j++) {
      handlers[j].call(this, event, shapeList)
    }
  }
}

function init (instanceSetting, shapeList) {
  let isToolbarEnabled = !!instanceSetting.toolbar.el

  instanceSetting.el.classList.add('fff-draw-main')

  createContainer(instanceSetting.el)

  createComponets(document.getElementById('draw-components'), instanceSetting.shapes)

  if (isToolbarEnabled) {
    getToolbar(instanceSetting.toolbar.el, instanceSetting.toolbar.tools, instanceSetting.toolbar.hint)
  }

  let canvasBackground = document.getElementById('canvas-background')
  backgroundDraw(canvasBackground)

  let drawLayout = document.getElementById('draw-layout')
  drawLayout.scrollTop = 1000 - 10
  drawLayout.scrollLeft = 1000 - 10

  for (let i = 0; i < eventList.length; i++) {
    let func = curryEventHandlers(eventList[i], shapeList, isToolbarEnabled)
    window.addEventListener(eventList[i], func)
  }
}

export default init