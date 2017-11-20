function getUIParameters () {
  let canvasLayout = document.getElementById('draw-layout')
  let drawContainer = document.getElementById('draw-container')
  return {
    canvasPadding: drawContainer.style.padding.slice(0, -2) - 0,
    canvasLeft: canvasLayout.offsetLeft,
    canvasTop: canvasLayout.offsetTop,
    canvasWidth: canvasLayout.offsetWidth,
    canvasHeight: canvasLayout.offsetHeight,
    canvasRight: canvasLayout.offsetLeft + canvasLayout.offsetWidth,
    canvasBottom: canvasLayout.offsetTop + canvasLayout.offsetHeight
  }
}

export default getUIParameters