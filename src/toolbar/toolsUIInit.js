import _ from '../common/util'
import {tools, toolsGroup, simplyToolTypes, hintData} from './toolbarDefaultSetting'

function getToolHtml (type) {
  if (_.contains(simplyToolTypes, type)) {
    return `<div id="tool_${type}" class="toolbar-button" hint-data="">
      <div class="ico ${type}"></div>
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
  let html = ''
  for (let i = 0; i < enabledTools; i++) {
    html += getToolHtml(enabledTools[i])
  }
  el.innerHTML = html
}

function toolUIInit (el, enabledTools, hint) {

}

export default toolUIInit
