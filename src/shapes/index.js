import Process from './process'
import Decision from './decision'
import Terminator from './terminator'
import Line from './line'

function getShapeByType (shapeName) {
  switch (shapeName) {
    case 'process': return Process
    case 'decision': return Decision
    case 'terminator': return Terminator
    case 'line': return Line
  }
}

export default getShapeByType