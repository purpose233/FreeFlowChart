import {tools} from './toolbarDefaultSetting'
import eventCommon from '../core/events/common'
import _ from '../common/util'

function getToolElement () {

}

function judgeToolType (event) {
  let el = event.target
  let type = el && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
  if (!type) {
    el = el.parentNode
    type = el && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
  }

  if (_.contains(tools, type)) { return type }
  else { return null }
}

function toolbarEventOnMouseDown (event, shapeList) {
  let type = judgeToolType(event)
  switch (type) {
    case 'undo':
      document.execCommand('undo')
      break;
    case 'redo':
      document.execCommand('redo')
      break;
    case 'bold':
      eventCommon.selectedShape.setTextareaSingleStyle('fontWeight', 'bold')
      break;
    case 'italic':
      break;
    case 'underline':
      break;
  }
}

export {toolbarEventOnMouseDown}
