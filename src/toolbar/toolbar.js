import createTools from './toolsUIInit'
import _ from '../common/util'

function getToolType (el) {
  return el.getAttribute('id').slice(5)
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
  setToolbarState (state) {
    let type
    for (let i = 0; i < this.toolElements.length; i++) {
      type = getToolType(this.toolElements[i])
      if (_.contains(state, type)) {
        if (state[type] === 'active') {
          this.toolElements.classList.add('active')
        }
      }
      else {
        this.toolElements.setAttribute('disabled', 'disabled')
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
    return new Toolbar(el, tools, hint)
  }
}

export default getToolbar
