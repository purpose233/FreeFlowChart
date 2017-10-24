import Process from './process'
import Line from './line'

function getShapeByType (shapeName) {
  switch (shapeName) {
    case 'process': return Process
    case 'line': return Line
  }
}

export default getShapeByType