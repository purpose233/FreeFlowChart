import {tools} from './toolbarDefaultSetting'
import eventCommon from '../core/events/common'
import _ from '../common/util'
import getToolbar from './toolbar'

function getToolElement (type) {
  return document.getElementById('tool-' + type)
}

function judgeToolType (event) {
  let el = event.target
  let type = el.getAttribute && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
  if (!type) {
    el = el.parentNode
    type = el && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
  }

  if (_.contains(_.properties(tools), type)) { return type }
  else { return null }
}

function simpleToolHandler (type, el, shape) {
  let value
  if (el.getAttribute('disabled') === 'disabled' || !shape) { return }
  if (el.classList.contains('active')) {
    value = tools[type].styleValue[0]
    el.classList.remove('active')
  }
  else {
    value = tools[type].styleValue[1]
    el.classList.add('active')
  }
  shape.setTextareaSingleStyle(tools[type].styleName, value)
}

function toolbarEventOnMouseDown (event, shapeList) {
  let type = judgeToolType(event)
  if (type) {
    let toolElement = getToolElement(type)
    switch (type) {
      case 'undo':
        document.execCommand('undo')
        break;
      case 'redo':
        document.execCommand('redo')
        break;
      case 'bold':
      case 'italic':
      case 'underline':
        simpleToolHandler(type, toolElement, eventCommon.selectedShape)
        break;
    }
  }
  else {
    let shape = eventCommon.activeShape || eventCommon.selectedShape
    if (shape) {
      getToolbar().setToolbarState(shape.getAllStyle())
    }
    else {
      getToolbar().setEmptyToolbarState()
    }
  }
}

export {toolbarEventOnMouseDown}
