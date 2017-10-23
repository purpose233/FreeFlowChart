import init from './init'

(function (window, document) {
  const defaultInstanceSettings = {
    shapes: ['process']
  }

  function cloneObject (o) {
    let clone = {}
    for (let prop in o)
      clone[prop] = o[prop]
    return clone
  }

  function hasProp (o, prop) {
    return o.hasOwnProperty(prop)
  }

  function replaceObjectProps (target, source) {
    let clone = cloneObject(target)
    for (let prop in clone)
      clone[prop] = hasProp(source, prop) ? source[prop] : clone[prop]
    return clone
  }

  function createInstanceSetting (params) {
    let el
    if (!params.el || !(el = document.querySelectorAll(params.el)[0])) {
      return null
    }

    let instanceSetting = replaceObjectProps(defaultInstanceSettings, params)
    instanceSetting.el = el

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