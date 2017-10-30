import _ from '../common/util'
import {tools, toolsGroup, simplyToolTypes, hintData, toolFontClass} from './toolbarDefaultSetting'

function getToolHtml (type) {
  if (_.contains(simplyToolTypes, type)) {
    return `<div id="tool-${type}" class="toolbar-button" hint-data="${hintData[type]}">
      <i class="icon fa ${toolFontClass[type]}"></i>
    </div>`
  }
  switch (type) {
    case 'fontName':
    case 'fontSize':
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

  let html = ''

  for (let i = 0; i < toolsGroup.length; i++) {
    let btnsHtml = ''
    for (let j = 0; j < toolsGroup[i].length; j++) {
      if (_.contains(enabledTools, toolsGroup[i][j])) {
        btnsHtml += getToolHtml(toolsGroup[i][j])
      }
    }
    if (btnsHtml !== '') {
      html += '<div class="btn-group">' + btnsHtml + '</div>'
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
