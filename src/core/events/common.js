import {calcPositionInCanvas} from '../calculation/calcPosition'
import controllerDraw from '../../draw/controller'

let eventCommon = {
  shapeController: {
    el: null,
    canvas: null,
    init: function () {
      this.el = document.getElementById('shape_controls')
      this.canvas = document.getElementById('controls_bounding')
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
    if (!event.target || !event.target.classList) {
      return {shape: null, type: 'empty'}
    }

    let result, shape
    let position = calcPositionInCanvas(event.pageX, event.pageY)

    if (event.target.classList.contains('toolbar-button')
      || event.target.parentNode.classList && event.target.parentNode.classList.contains('toolbar-button')) {
      return { shape: null, type: 'tool' }
    }
    else if (event.target.classList.contains('shape_controller')) {
      return {
        shape: this.selectedShape,
        type: 'controller'
      }
    }
    else if (event.target.parentNode.getAttribute
      && event.target.parentNode.getAttribute('id') === 'shape_controls') {
      // For now, the selected shape has no priority
      // which is the same as processon's work.
      result = this.judgeInShapeList(position, shapeList, -1)
      if (result) {
        result.topElement = this.shapeController.el
      }
      return result
    }
    else if (event.target.parentNode.classList
      && event.target.parentNode.classList.contains('shape-box')) {
      let shapeId = event.target.parentNode.getAttribute('shapeid')
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
  }

}

export default eventCommon
