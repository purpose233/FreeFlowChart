function backgroundDraw(el, backgroundWidth, backgroundHeight, backgroundSpacing) {
  if (!el) { return }

  let context = el.getContext('2d')
  let width = backgroundWidth ? backgroundWidth : 1250
  let height = backgroundHeight ? backgroundHeight : 1500
  let spacing = backgroundSpacing ? backgroundSpacing : 15

  el.width = width
  el.height = height

  let countX = Math.ceil(width / spacing)
  let countY = Math.ceil(height / spacing)

  context.strokeStyle = '#dcdcdc'
  for (let i = 0; i < countX; i++) {
    context.beginPath()
    context.moveTo(i * spacing, 0)
    if (i % 5 === 0)
      context.lineWidth = 2
    else context.lineWidth = 1
    context.lineTo(i * spacing, height)
    context.stroke()
  }
  for (let i = 0; i < countY; i++) {
    context.beginPath()
    context.moveTo(0, i * spacing)
    if (i % 5 === 0)
      context.lineWidth = 2
    else context.lineWidth = 1
    context.lineTo(width, i * spacing)
    context.stroke()
  }
}

export default backgroundDraw