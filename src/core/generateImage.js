function calcCanvasSize (shapeList) {
  let minLeft = Infinity, maxRight = -Infinity
  let minTop = Infinity, maxBottom = -Infinity

  for (let i = 0; i < shapeList.length; i++) {
    minLeft = shapeList[i].left < minLeft ? shapeList[i].left : minLeft
    maxRight = shapeList[i].left + shapeList[i].width > maxRight ? shapeList[i].left + shapeList[i].width : maxRight
    minTop = shapeList[i].top < minTop ? shapeList[i].top : minTop
    maxBottom = shapeList[i].top + shapeList[i].height > maxBottom ? shapeList[i].top + shapeList[i].height : maxBottom
  }
  if (!isFinite(minLeft) || !isFinite(maxRight) || !isFinite(minTop) || !isFinite(maxBottom)) {
    return null
  }

  return {
    width: maxRight - minLeft,
    height: maxBottom - minTop,
    offsetX: minLeft,
    offsetY: minTop
  }
}

function generationImage (shapeList) {
  if (!shapeList || shapeList.length <= 0) { return null }
  let canvasData = calcCanvasSize(shapeList)
  if (!canvasData) { return null }
  let canvas = document.createElement('canvas')
  
}

export default generationImage
