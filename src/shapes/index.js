import Process from './process'
import Decision from './decision'
import Line from './line'

function getShapeByType (shapeName) {
  switch (shapeName) {
    case 'process': return Process
    case 'decision': return Decision
    case 'line': return Line
  }
}

export default getShapeByType