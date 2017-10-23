import {dragNewComponentMouseDown, dragNewComponetMouseMove, dragNewComponetMouseUp} from './dragNewComponent'
import {shapeEventOnMouseMove, shapeEventOnMouseDown, shapeEventOnMouseUp, shapeEventOnDblClick, shapeEventOnKeyDown} from './shapeEvent'

let eventList = ['mousedown', 'mousemove', 'mouseup', 'dblclick', 'keydown']

function getEventHandlers (eventType) {
  switch (eventType) {
    case 'mousedown': return [dragNewComponentMouseDown, shapeEventOnMouseDown]
    case 'mousemove': return [dragNewComponetMouseMove, shapeEventOnMouseMove]
    case 'mouseup': return [dragNewComponetMouseUp, shapeEventOnMouseUp]
    case 'dblclick': return [shapeEventOnDblClick]
    case 'keydown': return [shapeEventOnKeyDown]
  }
}

export {eventList, getEventHandlers}
