function getUIParameters () {
  let canvasLayout = document.getElementById('draw-layout')
  let drawContainer = document.getElementById('draw-container')
  return {
    canvasPadding: drawContainer.style.padding.slice(0, -2) - 0,
    canvasLeft: canvasLayout.offsetLeft,
    canvasTop: canvasLayout.offsetTop
  }
}

export default getUIParameters