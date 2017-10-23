import getUIParameters from '../../common/getUIParameters'

function calcPositionInCanvas (x, y) {
  let drawLayout = document.getElementById('draw-layout')
  let parameters = getUIParameters()
  return {
    x: x - parameters.canvasLeft - (parameters.canvasPadding - drawLayout.scrollLeft),
    y: y - parameters.canvasTop - (parameters.canvasPadding - drawLayout.scrollTop)
  }
}

export default calcPositionInCanvas
