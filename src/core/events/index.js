import {dragNewComponentMouseDown, dragNewComponetMouseMove, dragNewComponetMouseUp} from './dragNewComponent'
import {shapeEventOnMouseMove, shapeEventOnMouseDown, shapeEventOnMouseUp, shapeEventOnDblClick, shapeEventOnKeyDown} from './shapeEvent'
import {toolbarEventOnMouseDown} from '../../toolbar/toolbarEvent'

let eventList = ['mousedown', 'mousemove', 'mouseup', 'dblclick', 'keydown']

function getEventHandlers (eventType, isToolbarEnabled) {
  switch (eventType) {
    case 'mousedown':
      if (isToolbarEnabled) {
        return [dragNewComponentMouseDown, shapeEventOnMouseDown, toolbarEventOnMouseDown]
      }
      else {
        return [dragNewComponentMouseDown, shapeEventOnMouseDown]
      }
    case 'mousemove': return [dragNewComponetMouseMove, shapeEventOnMouseMove]
    case 'mouseup': return [dragNewComponetMouseUp, shapeEventOnMouseUp]
    case 'dblclick': return [shapeEventOnDblClick]
    case 'keydown': return [shapeEventOnKeyDown]
  }
}

export {eventList, getEventHandlers}
