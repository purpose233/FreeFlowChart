import {calcPositionInCanvas} from '../calculation/calcPosition'
import controllerDraw from '../../draw/controller'
import {tools} from '../../toolbar/toolbarDefaultSetting'

function parentContainsClass (el, className) {
  return el.parentNode && el.parentNode.classList
    && el.parentNode.classList.contains(className)
}

let eventCommon = {
  shapeController: {
    el: null,
    canvas: null,
    init: function () {
      this.el = document.getElementById('shape-controls')
      this.canvas = document.getElementById('controls-bounding')
    },
    reset: function (left, top, width, height) {
      if (!this.el) {
        this.init()
      }

      this.el.style.left = left + 'px'
      this.el.style.top = top + 'px'
      this.el.style.width = width + 'px'
      this.el.style.height = height + 'px'
    },
    setVisibility: function (visibility) {
      if (!this.el) {
        this.init()
      }

      if (visibility) {
        this.el.style.display = 'block'
      }
      else {
        this.el.style.display = 'none'
      }
    },
    draw(width, height) {
      if (!this.el) {
        this.init()
      }

      return controllerDraw(this.canvas, width, height, 10)
    }
  },
  bezierController: {},
  styleController: {},

  activeShape: null,
  selectedShape: null,

  lineData: {
    selectedLine: null,
    isActive: false,
    src: {
      position: null,
      referPercent: null,
      referPosition: null,
      shape: null
    },
    dest: {
      position: null,
      referPercent: null,
      referPosition: null,
      shape: null
    },
    activeLine: null,
    type: null,
    // This value only works when creating a new line
    needDeleted: false

    // Type values: 'new', 'toDest', 'toSrc'
  },

  toolbarData: {
    type: null,
    element: null
  },

  clearLineData () {
    this.lineData.activeLine = null
    this.lineData.isActive = false
    this.lineData.src = {
      position: null,
      referPercent: null,
      referPosition: null,
      shape: null
    }
    this.lineData.dest = {
      position: null,
      referPercent: null,
      referPosition: null,
      shape: null
    }
    this.lineData.needDeleted = false
  },
  clearToolbarData () {
    this.toolbarData.type = null
    this.toolbarData.element = null
  },
  getShapeInListById: function (shapeId, shapeList) {
    for (let i = 0; i < shapeList.length; i++) {
      // If the line is being moved, ignore it
      if (this.lineData.activeLine === shapeList[i]) {
        continue
      }
      if (shapeList[i].id === shapeId)
        return shapeList[i]
    }
    return null
  },
  deleteShapeInListById: function (shapeId, shapeList) {
    for (let i = 0; i < shapeList.length; i++) {
      if (shapeId === shapeList[i].id) {
        let shape = shapeList.splice(i, 1)[0]
        shape.destruct()
        shape = null
        return
      }
    }
  },
  isShapeInListById: function (shapeId, shapeList) {
    for (let i = 0; i < shapeList.length; i++) {
      if (shapeId === shapeList[i].id) {
        return true
      }
    }
    return false
  },
  judgeInShapeList: function (position, shapeList, dir) {
    dir = (typeof dir !== 'undefined') ? dir : 1
    let length = shapeList.length
    let index = (dir > 0) ? 0 : length - 1
    let result
    for (; index >= 0 && index < length; index += dir) {
      // If the line is being moved, ignore it.
      if (this.lineData.isActive && shapeList[index] === this.lineData.activeLine) {
        continue
      }
      if (shapeList[index].judgeInShape) {
        result = shapeList[index].judgeInShape(position.x, position.y)
        if (result.type !== 'empty')
          return result
      }
    }
    return null
  },
  judgeEventAt: function (event, shapeList) {
    let el = event.target
    if (!el || !el.classList) {
      return {shape: null, type: 'empty'}
    }

    let result, shape
    let position = calcPositionInCanvas(event.pageX, event.pageY)

    if (el.classList.contains('toolbar-button')
      || parentContainsClass(el, 'toolbar-button')
      || el.classList.contains('dropdown-menu')
      || parentContainsClass(el, 'dropdown-menu')) {
      return { shape: null, type: 'tool' }
    }
    else if (el.classList.contains('shape-controller')) {
      return {
        shape: this.selectedShape,
        type: 'controller'
      }
    }
    else if (el.parentNode.getAttribute
      && el.parentNode.getAttribute('id') === 'shape-controls') {
      // For now, the selected shape has no priority
      // which is the same as processon's work.
      result = this.judgeInShapeList(position, shapeList, -1)
      if (result) {
        result.topElement = this.shapeController.el
      }
      else {
        result = { topElement: this.shapeController.el }
      }
      return result
    }
    else if (parentContainsClass(el, 'shape-box')) {
      let shapeId = el.parentNode.getAttribute('shapeid')
      shape = this.getShapeInListById(shapeId, shapeList)

      if (!shape) {
        // Judge whether the shape is already put into the shape list.
        // It happens when users try to drag a new line.
        // TopShape is undefined here.
        return this.judgeInShapeList(position, shapeList, -1)
      }
      else {
        // Common shape or line will work the same way.
        result = shape.judgeInShape(position.x, position.y)
        result.topElement = shape.el
        if (result && result.type !== 'empty') {
          return result
        }
        else {
          let resultInList = this.judgeInShapeList(position, shapeList, -1)
          if (resultInList) {
            resultInList.topElement = shape.el
          }
          return (resultInList ? resultInList : result)
        }
      }
    }

    return {shape: null, type: 'empty'}

    // type values: lineBody, lineDest, lineSrc
    //              shapeBody, shapeLineArea
    //              controller
    //              empty
    //              tool
  },
  judgeEventOnToolbar: function (event) {
    let el = event.target, type, value, isTool = false

    if (el.classList.contains('disabled') || parentContainsClass(el, 'disabled')) {
      value = type = null
    }
    else if (el.classList.contains('toolbar-button')
      || parentContainsClass(el, 'toolbar-button')
      || el.classList.contains('dropdown-menu')) {
      isTool = true
      value = null
    }
    else if (parentContainsClass(el, 'dropdown-menu')) {
      isTool = true
      type = 'setValue'
      value = el.innerText
    }
    else if (false) {
      // For now, the color picker is not considered.
    }
    if (isTool && !type) {
      let className = el.getAttribute && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
      if (!className) {
        el = el.parentNode
        className = el.getAttribute && el.getAttribute('id') ? el.getAttribute('id').slice(5) : null
      }

      for (let prop in tools) {
        if (tools[prop].className === className) {
          type = prop
        }
      }
    }

    return {type: type, value: value}
  }
}

export default eventCommon
