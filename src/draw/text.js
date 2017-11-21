function drawText (context, text, left, top, maxWidth, lineHeight) {
  if (!text || text.length === 0 ) { return }
  let index = 0, lineLeft = 0, lineTop = lineHeight

  for (let i = 0; i < text.length; i++) {
    lineLeft += context.measureText(text[i]).width
    if (lineLeft > maxWidth) {
      context.fillText(text.substring(index, i), left, top + lineTop)
      lineTop += lineHeight
      lineLeft = 0
      index = i
    }
  }
  context.fillText(text.substring(index, text.length), left, top + lineTop)
}

export default drawText