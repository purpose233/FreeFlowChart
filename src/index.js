import './style/freeFlowChart.scss'
import generateImage from './core/generateImage'
import init from './init'
import _ from './common/util'

(function (window, document) {
  // settings: {
  //   el: the container of drawing
  //   shapes: enabled shapes
  //   toolbar: {
  //     el: the container of toolbar
  //     tools: enabled tools
  //   }
  // }
  const defaultInstanceSettings = {
    el: null,
    shapes: ['process', 'decision', 'terminator', 'storedData'],
    toolbar: {
      el: null,
      tools: ['undo', 'redo',
        'bold', 'italic', 'underline',
        'fontFamily', 'fontSize', 'fontColor',
        'fillStyle', 'strokeStyle', 'lineWidth', 'lineDash',
        'linkerType', 'arrowType'
      ],
      hint: true
    }
  }

  function cloneObject (o) {
    let clone = {}
    for (let prop in o) {
      clone[prop] = o[prop]
    }
    return clone
  }

  function hasProp (o, prop) {
    return o.hasOwnProperty(prop)
  }

  function replaceObjectProps (target, source) {
    let clone = cloneObject(target)
    for (let prop in clone) {
      // Note that typeof null === 'object'.
      if (clone[prop] && typeof clone[prop] === 'object' && !_.isArray(clone[prop])) {
        if (source[prop]) {
          clone[prop] = replaceObjectProps(clone[prop], source[prop])
        }
      }
      else {
        clone[prop] = hasProp(source, prop) ? source[prop] : clone[prop]
      }
    }
    return clone
  }

  function createInstanceSetting (params) {
    let el
    if (!params.el || !(el = document.querySelectorAll(params.el)[0])) {
      return null
    }

    let instanceSetting = replaceObjectProps(defaultInstanceSettings, params)
    instanceSetting.el = el

    if (params.toolbar.el && (el = document.querySelectorAll(params.toolbar.el)[0])) {
      instanceSetting.toolbar.el = el
      let tools = instanceSetting.toolbar.tools
      for (let i = 0; i < tools.length; i++) {
        tools[i] = tools[i].toLowerCase().trim()
      }
    }

    return instanceSetting
  }

  class FlowChart {
    constructor (options) {
      this.instanceSetting = createInstanceSetting(options)
      if (!this.instanceSetting) {
        return {}
      }

      this.shapeList = []
      this.init()
    }
    init() {
      init(this.instanceSetting, this.shapeList)
    }
    generateImage () {
      return generateImage(this.shapeList)
    }
  }

  let FreeFlowChart = (function () {
    let instance = null

    return function (options) {
      if (instance) { return instance }
      else {
        let instance = new FlowChart(options)
        if (!instance.init) {
          console.log('Invalid options!')
          instance = null
        }
        return instance
      }
    }
  })()

  window.FreeFlowChart = FreeFlowChart
})(window, document)
