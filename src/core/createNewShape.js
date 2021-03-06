import getShapeByType from '../shapes/index'

function createNewShape (type, settings) {
  let component = document.createElement('div')
  component.classList.add('shape-box', type)
  component.style.position = 'absolute'

  component.innerHTML = `
    <canvas class="shape-canvas"></canvas>
    <textarea class="shape-text"></textarea>`

  let shape = new (getShapeByType(type))(component, type, settings)

  component.setAttribute('shapeid', shape.id)
  return shape
}

function createNewLine (src, dist, settings) {
  let component = document.createElement('div')
  component.classList.add('shape-box', 'linker-box')

  component.innerHTML = `
    <canvas class="shape-canvas"></canvas>
    <textarea class="shape-text" style="display: none;"></textarea>`

  let line = new (getShapeByType('line'))(component, src, dist, settings)

  component.setAttribute('shapeid', line.id)
  return line
}

export {createNewShape, createNewLine}
