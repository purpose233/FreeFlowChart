import getShapeByType from './shapes/index'
import backgroundDraw from './draw/background'
import {eventList, getEventHandlers} from './core/events/index'
import getToolbar from './toolbar/toolbar'

const drawContainerHtml = `<div class="draw-main">
    <div id="draw-components">
    </div>
    <div id="draw-layout">
        <div id="draw-container" style="padding:1000px;">
            <div id="designer-canvas">
                <canvas id="canvas-background"></canvas>
                <div id="shape-controls">
                    <canvas id="controls-bounding" width="120" height="90"></canvas>
                    <div class="shape-controller n w" resizedir="nw" style="cursor:nw-resize; left:5px; top:5px;"></div>
                    <div class="shape-controller n e" resizedir="ne" style="cursor:ne-resize; right:5px; top:5px;"></div>
                    <div class="shape-controller s e" resizedir="se" style="cursor:se-resize; right:5px; bottom:5px;"></div>
                    <div class="shape-controller s w" resizedir="sw" style="cursor:sw-resize; left:5px; bottom:5px;"></div>
                    <div class="shape-anchor" style="left:calc(50% - 4px); top:6px;"></div>
                    <div class="shape-anchor" style="right:6px; top:calc(50% - 4px);"></div>
                    <div class="shape-anchor" style="left:calc(50% - 4px); bottom:6px;"></div>
                    <div class="shape-anchor" style="left:6px; top:calc(50% - 4px);"></div>
                </div>
                <div id="bezier-controls">
                    <div class="bezier-control-line" end="src"></div>
                    <div class="bezier-control-point" end="src"></div>
                    <div class="bezier-control-line" end="dest"></div>
                    <div class="bezier-control-point" end="dest"></div>
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
    let shape = new (getShapeByType(shapeName))(componentItems[i], shapes[i]
      , {left: -1, top: -1, width: 30, height: 30})
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