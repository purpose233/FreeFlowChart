import createTools from './toolsUIInit'
import _ from '../common/util'
import {tools, simplyToolTypes} from "./toolbarDefaultSetting";

function getToolType (el) {
  let className = el.getAttribute('id').slice(5)
  for (let prop in tools) {
    if (tools[prop].className === className) {
      return prop
    }
  }
  return null
}

function styleToState (style) {
  let state = {}

  for (let value in style) {
    for (let prop in tools) {
      if (tools[prop].styleName === value) { state[prop] = style[value] }
    }
  }
  return state
}

function setToolState (type, element, value) {
  if (typeof value !== 'undefined') {
    element.classList.remove('disabled')
  }
  switch (type) {
    case 'fontFamily':
    case 'fontSize':
      if (_.contains(tools[type].styleValue, value)) {
        element.getElementsByClassName('text-content')[0].innerText = value
      }
      break;
    case 'fontColor':
    case 'fillStyle':
    case 'strokeStyle':
      element.getElementsByClassName('btn-color')[0].style.background = value
      break;
    case 'lineWidth':
    case 'lineDash':
      break;
    case 'linkerType':
    case 'arrowType':
      let values = tools[type].styleValue
      for (let i = 0; i < values.length; i++) {
        if (value === values[i]) {
          element.classList.remove(element.classList[1])
          element.classList.add(tools[type].iconClass[i])
          break;
        }
      }
  }
}

class Toolbar {
  constructor (el, tools, hint) {
    this.el = el
    this.tools = tools
    this.hint = hint

    this.init()
  }
  init () {
    createTools(this.el, this.tools, this.hint)
    this.toolElements = this.el.getElementsByClassName('toolbar-button')
  }
  setToolbarState (style) {
    let type, toolEl
    let state = styleToState(style)

    for (let i = 0; i < this.toolElements.length; i++) {
      toolEl = this.toolElements[i]
      type = getToolType(toolEl)
      if (type === 'undo' || type === 'redo') { continue }
      if (_.contains(_.properties(state), type)) {
        if (_.contains(simplyToolTypes, type)) {
          toolEl.classList.remove('disabled')
          toolEl.setAttribute('disabled', '')
          if (state[type] !== tools[type].styleValue[0]) {
            toolEl.classList.add('active')
          }
          else {
            toolEl.classList.remove('active')
          }
        }
        else {
          setToolState(type, toolEl, state[type])
        }
      }
      else {
        toolEl.classList.add('disabled')
      }
    }
  }
  setEmptyToolbarState () {
    let type
    for (let i = 0; i < this.toolElements.length; i++) {
      type = getToolType(this.toolElements[i])
      if (type !== 'undo' && type !== 'redo') {
        this.toolElements[i].classList.add('disabled')
        this.toolElements[i].classList.remove('active')
      }
    }
  }
}

let toolbar = null

function getToolbar (el, tools, hint) {
  if (toolbar) {
    return toolbar
  }
  else {
    return (toolbar = new Toolbar(el, tools, hint))
  }
}

export default getToolbar
