import _ from '../common/util'
import {tools, simplyToolTypes} from './toolbarDefaultSetting'

function getToolHtml (type) {
  if (_.contains(simplyToolTypes, type)) {
    return `<div id="tool-${type}" 
      class="toolbar-button ${type !== 'undo' && type !== 'redo' ? 'disabled' : ''}"
      hint-data="${tools[type].hint}">
      <div class="icon ${tools[type].className}"></div>
    </div>`
  }
  let values = tools[type].styleValue
  switch (type) {
    case 'fontFamily':
    case 'fontSize':
      let dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="display: none">`
      for (let i = 0; i < values.length; i++) {
        dropdownHtml += `<li style="${tools[type].className}:${values[i]}" data="${values[i]}">${values[i]}</li>`
      }
      dropdownHtml += `</ul>`
      return `<div id="tool-${tools[type].className}"
        class="toolbar-button disabled"
        hint-data="${tools[type].hint}">
          <div class="text-content">${tools[type].defaultValue}</div>
          <div class="icon dropdown"></div>
        </div>` + dropdownHtml
    case 'fontColor':
    case 'fillStyle':
    case 'strokeStyle':
    case 'lineWidth':
    case 'lineDash':
    case 'linkerType':
    case 'arrowType':
  }
  return ''
}

function createTools (el, enabledTools) {
  el.classList.add('fff-draw-tools')

  let html = '', toolNames = _.properties(tools)

  for (let i = 0; i < enabledTools.length; i++) {
    let type = _.find(toolNames, (value, index) => {
      if (value.toLowerCase().trim() === enabledTools[i].toLowerCase().trim()) {
        return value
      }
      else return false
    })

    if (type) {
      html += getToolHtml(type)
    }
  }

  el.innerHTML = html
}

function createHint (el) {

}

function toolUIInit (el, enabledTools, hint) {
  createTools(el, enabledTools)
  if (hint) {
    createHint(el)
  }
}

export default toolUIInit
