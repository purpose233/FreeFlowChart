import createTools from './toolsUIInit'

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
    //for (let)
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
