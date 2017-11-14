import _ from '../common/util'
import {tools, simplyToolTypes, selectableColors} from './toolbarDefaultSetting'

function getColorPicker () {
  let colorsHtml = '', innerHtml = ''

  // First 12 colors are from white to black.
  for (let i = 0; i < 12; i++) {
    let r = selectableColors[i][0]
    let g = selectableColors[i][1]
    let b = selectableColors[i][2]
    innerHtml += `<div style="background-color:rgb(${r},${g},${b});" color="${r},${g},${b}"></div>`
  }
  colorsHtml += `<div class="color-column">${innerHtml}<div class="clear"></div></div>`

  innerHtml = ''
  for (let i = 12; i < selectableColors.length; i++) {
    let r = selectableColors[i][0]
    let g = selectableColors[i][1]
    let b = selectableColors[i][2]
    innerHtml += `<div style="background-color:rgb(${r},${g},${b});" color="${r},${g},${b}"></div>`
  }
  colorsHtml += `<div class="color-column">${innerHtml}<div class="clear"></div></div>`

  return `<div id="color-picker" class="color-menu">${colorsHtml}</div>`
}

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

  if (_.contains(enabledTools, 'fontcolor')
    || _.contains(enabledTools, 'fillstyle')
    || _.contains(enabledTools, 'strokestyle')) {
    html += getColorPicker()
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
