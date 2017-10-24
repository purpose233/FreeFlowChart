import getShapeByType from '../shapes/index'

function createNewShape (type, left, top, width, height) {
  let component = document.createElement('div')
  component.classList.add('shape-box')

  component.innerHTML = `
    <canvas class="shape-canvas"></canvas>
    <div class="shape-text" contenteditable="true"></div>`

  let shape = new (getShapeByType(type))(component, type, left, top, width, height)

  component.setAttribute('shapeid', shape.id)
  return shape
}

function createNewLine (src, dist) {
  let component = document.createElement('div')
  component.classList.add('shape-box', 'linker_box')

  component.innerHTML = `
    <canvas class="shape-canvas"></canvas>
    <div class="shape-text" contenteditable="true"></div>`

  let line = new (getShapeByType('line'))(component, src, dist)

  component.setAttribute('shapeid', line.id)
  return line
}

export {createNewShape, createNewLine}
