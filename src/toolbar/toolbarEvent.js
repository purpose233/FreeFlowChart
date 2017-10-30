import {tools} from './toolbarDefaultSetting'
import eventCommon from '../core/events/common'
import _ from '../common/util'

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
      console.log('undo')
      document.execCommand('undo')
      break;
    case 'redo':
      console.log('redo')
      document.execCommand('redo')
      break;

  }
}

export {toolbarEventOnMouseDown}
