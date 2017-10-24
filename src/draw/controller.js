function controllerDraw(el, width, height, margin) {
  if (!el) { return }

  el.width = width
  el.height = height
  let context = el.getContext('2d')

  context.strokeStyle = '#883333'
  context.lineWidth = 1
  context.beginPath()
  context.rect(margin, margin, width - 2 * margin, height - 2 * margin);
  context.stroke();
}

export default controllerDraw
