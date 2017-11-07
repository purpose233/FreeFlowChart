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

function generateImage (shapeList) {
  if (!shapeList || shapeList.length <= 0) { return null }
  let canvasData = calcCanvasSize(shapeList)
  if (!canvasData) { return null }
  let canvas = document.createElement('canvas')

  canvas.width = canvasData.width
  canvas.height = canvasData.height
  let context = canvas.getContext('2d')

  let shape, left, top
  for (let i = 0; i < shapeList.length; i++) {
    shape = shapeList[i]
    left = shape.left - canvasData.offsetX
    top = shape.top - canvasData.offsetY
    shape.drawOnOtherCanvas(context, left, top)
  }

  let image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image
}

export default generateImage
