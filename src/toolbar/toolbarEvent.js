import {tools} from './toolbarDefaultSetting'
import eventCommon from '../core/events/common'
import _ from '../common/util'
import getToolbar from './toolbar'

function getToolElement (type) {
  return document.getElementById('tool-' + tools[type].className)
}

function simpleToolHandler (type, el, shape) {
  let value
  if (type === null) { return }
  if (el.classList.contains('disabled') || !shape) { return }
  if (el.classList.contains('active')) {
    value = tools[type].styleValue[0]
    el.classList.remove('active')
  }
  else {
    value = tools[type].styleValue[1]
    el.classList.add('active')
  }
  shape.resetSingleStyle(tools[type].styleName, value)
}

function showTypeMenu (type, element, value) {
  let menu
  if (type === 'fillStyle' || type === 'strokeStyle' || type === 'fontColor') {
    menu = document.getElementById('color-picker')
    if (!menu) { return }
    let colorDivs = menu.querySelectorAll('.color-column div')

    let selectedDiv = menu.querySelector('.selected')
    if (selectedDiv) {
      selectedDiv.classList.remove('selected')
    }
    // Note that one div of colors is used to clear float.
    for (let i = 0; i < colorDivs.length - 1; i++) {
      let color = colorDivs[i].getAttribute('color')
      if (_.compareColor(value, color)) {
        colorDivs[i].classList.add('selected')
        break;
      }
    }
  }
  else {
    // let content = element.getElementsByClassName('text-content')[0]
    // content.innerText = value
    menu = document.getElementById('menu-' + tools[type].className)
    if (!menu) { return }
    let options = menu.getElementsByTagName('li')
    for (let i = 0; i < options.length; i++) {
      if (options[i].innerText === value) {
        options[i].classList.add('option-selected')
        options[i].innerHTML = `<div class="icon selected"></div>` + value
      }
    }
  }
  menu.style.left = element.offsetLeft + 'px'
  menu.style.top = element.offsetTop + element.offsetHeight + 'px'
  menu.style.display = 'block'
}

function hideOpenedMenu () {
  let type = eventCommon.toolbarData.type, menu
  if (type) {
    eventCommon.toolbarData.element.classList.remove('active')
    if (type === 'fillStyle' || type === 'strokeStyle' || type === 'fontColor') {
      menu = document.getElementById('color-picker')
    }
    else {
      menu = document.getElementById('menu-' + tools[type].className)
    }
    let selectedOption = menu.getElementsByClassName('option-selected')[0]
    if (selectedOption) {
      selectedOption.classList.remove('option-selected')
      selectedOption.innerHTML = selectedOption.getAttribute('data')
    }
    menu.style.display = 'none'
  }
}

function toolbarEventOnMouseDown (event, shapeList) {
  //let type = judgeToolType(event)
  let judgeResult = eventCommon.judgeEventOnToolbar(event)
  let type = judgeResult.type
  let shape = eventCommon.activeShape || eventCommon.selectedShape

  if (type) {
    if (eventCommon.toolbarData.type === type) { return }

    let toolElement
    if (type === 'setValue') {
      toolElement = eventCommon.toolbarData.element
    }
    else {
      toolElement = getToolElement(type)
      hideOpenedMenu()
      eventCommon.clearToolbarData()
    }

    hideOpenedMenu()
    switch (type) {
      case 'undo':
        document.execCommand('undo')
        break;
      case 'redo':
        document.execCommand('redo')
        break;
      case 'bold':
      case 'italic':
      case 'underline':
        simpleToolHandler(type, toolElement, eventCommon.selectedShape)
        break;
      case 'setValue':
        type = eventCommon.toolbarData.type
        shape.resetSingleStyle(tools[type].styleName, judgeResult.value)
        switch (type) {
          case 'fontFamily':
          case 'fontSize':
            let content = eventCommon.toolbarData.element.getElementsByClassName('text-content')[0]
            content.innerText = judgeResult.value
            break;
          case 'fontColor':
          case 'fillStyle':
          case 'strokeStyle':
            let color = eventCommon.toolbarData.element.getElementsByClassName('btn-color')[0]
            color.style.background = judgeResult.value
            break;
          case 'lineWidth':
          case 'lineDash':
          case 'linkerType':
          case 'arrowType':
        }


        eventCommon.clearToolbarData()
        break;
      default:
        let styleValue = shape.getStyleOfType(type)
        eventCommon.toolbarData.type = type
        eventCommon.toolbarData.element = toolElement
        toolElement.classList.add('active')
        showTypeMenu(type, toolElement, styleValue)
        break;
    }
  }
  else {
    hideOpenedMenu()
    eventCommon.clearToolbarData()
    if (shape) {
      getToolbar().setToolbarState(shape.getAllStyle())
    }
    else {
      getToolbar().setEmptyToolbarState()
    }
  }
}

export {toolbarEventOnMouseDown}
