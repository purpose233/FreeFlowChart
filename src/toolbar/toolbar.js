import createTools from './toolsUIInit'
import _ from '../common/util'
import {tools, simplyToolTypes} from "./toolbarDefaultSetting";

function getToolType (el) {
  return el.getAttribute('id').slice(5)
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
    let type
    let state = styleToState(style)

    for (let i = 0; i < this.toolElements.length; i++) {
      type = getToolType(this.toolElements[i])
      if (type === 'undo' || type === 'redo') { continue }
      if (_.contains(_.properties(state), type)) {
        if (_.contains(simplyToolTypes, type)) {
          this.toolElements[i].setAttribute('disabled', '')
          if (state[type] !== tools[type].styleValue[0]) {
            this.toolElements[i].classList.add('active')
          }
        }
      }
      else {
        this.toolElements[i].setAttribute('disabled', 'disabled')
      }
    }
  }
  setEmptyToolbarState () {
    let type
    for (let i = 0; i < this.toolElements.length; i++) {
      type = getToolType(this.toolElements[i])
      if (type !== 'undo' && type !== 'redo') {
        this.toolElements[i].setAttribute('disabled', 'disabled')
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
