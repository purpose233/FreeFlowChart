import _ from '../common/util'
import {tools, simplyToolTypes, selectableColors} from './toolbarDefaultSetting'

function getColorPicker () {
  let colorsHtml = '', innerHtml = ''

  // First 12 colors are from white to black.
  for (let i = 0; i < 12; i++) {
    let r = selectableColors[i][0]
    let g = selectableColors[i][1]
    let b = selectableColors[i][2]
    innerHtml += `<div style="background-color:rgb(${r},${g},${b});" color="rgb(${r},${g},${b})"></div>`
  }
  colorsHtml += `<div class="color-column">${innerHtml}<div class="clear"></div></div>`

  innerHtml = ''
  for (let i = 12; i < selectableColors.length; i++) {
    let r = selectableColors[i][0]
    let g = selectableColors[i][1]
    let b = selectableColors[i][2]
    innerHtml += `<div style="background-color:rgb(${r},${g},${b});" color="rgb(${r},${g},${b})"></div>`
  }
  colorsHtml += `<div class="color-column">${innerHtml}<div class="clear"></div></div>`

  return `<div id="color-picker" class="color-menu" style="display: none">${colorsHtml}</div>`
}

function getToolHtml (type) {
  if (_.contains(simplyToolTypes, type)) {
    return `<div id="tool-${type}" 
      class="toolbar-button ${type !== 'undo' && type !== 'redo' ? 'disabled' : ''}"
      hint-data="${tools[type].hint}">
      <div class="icon ${tools[type].className}"></div>
    </div>`
  }
  let values = tools[type].styleValue, dropdownHtml
  switch (type) {
    case 'fontFamily':
    case 'fontSize':
      dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="display: none">`
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
      return `<div id="tool-${tools[type].className}" 
        class="toolbar-button disabled" 
        hint-data="${tools[type].hint}">
            <div class="icon ${tools[type].className}"></div>
            <div class="btn-color"></div>
            <div class="icon dropdown"></div>
        </div>`
    case 'lineWidth':
      dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="display: none">`
      for (let i = 0; i < values.length; i++) {
        dropdownHtml += `<li data="${values[i]}">${values[i] + 'px'}</li>`
      }
      dropdownHtml += `</ul>`
      return `<div id="tool-${tools[type].className}"
        class="toolbar-button disabled"
        hint-data="${tools[type].hint}">
          <div class="icon ${tools[type].className}"></div>
          <div class="icon dropdown"></div>
        </div>` + dropdownHtml
    case 'lineDash':
      let properties = _.properties(values)
      dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="display: none">`
      for (let i = 0; i < properties.length; i++) {
        dropdownHtml += `<li data="${properties[i]}">
            <div class="icon ${tools[type].iconClass[properties[i]]}"></div>
          </li>`
      }
      dropdownHtml += `</ul>`
      return `<div id="tool-${tools[type].className}"
        class="toolbar-button disabled"
        hint-data="${tools[type].hint}">
          <div class="icon ${tools[type].className}"></div>
          <div class="icon dropdown"></div>
        </div>` + dropdownHtml
    case 'linkerType':
    case 'arrowType':
      dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="display: none">`
      for (let i = 0; i < values.length; i++) {
        dropdownHtml += `<li data="${values[i]}">
            <div class="icon ${tools[type].iconClass[i]}"></div>
          </li>`
      }
      dropdownHtml += `</ul>`
      return `<div id="tool-${tools[type].className}"
        class="toolbar-button disabled"
        hint-data="${tools[type].hint}">
          <div class="icon ${tools[type].iconClass[0]}"></div>
          <div class="icon dropdown"></div>
        </div>` + dropdownHtml

      // dropdownHtml = `<ul id="menu-${tools[type].className}" class="dropdown-menu" style="">`
      // for (let i = 0; i < values.length; i++) {
      //   dropdownHtml += `<li data="${values[i]}">
      //       <div class="icon ${tools[type].iconClass[i]}"></div>
      //     </li>`
      // }
      // dropdownHtml += `</ul>`
      // return `<div id="tool-${tools[type].className}"
      //   class="toolbar-button disabled"
      //   hint-data="${tools[type].hint}">
      //     <div class="icon ${tools[type].iconClass[0]}"></div>
      //     <div class="icon dropdown"></div>
      //   </div>` + dropdownHtml
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
