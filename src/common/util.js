let _ = {}

_.find = function (list, predicate) {
  let result
  for (let i = 0; i < list.length; i++) {
    result = predicate(list[i], i, list)
    if (result) { return }
  }
}

_.throttle = function (func, wait, trailing) {
  let timeout, previous

  let later = function (context, args) {
    previous = (new Date()).getTime()
    func.apply(context, args)
  }

  let throttled = function () {
    let result
    let now = (new Date()).getTime()

    if (!previous) {
      previous = now
      result = func.apply(this, arguments)
    }
    else {
      let remaining = wait - (now - previous)
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(this, arguments);
      } else if (!timeout && trailing) {
        timeout = setTimeout(later.bind(this, this, arguments), remaining);
      }
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
  }

  return throttled
}

_.debounce = function (func, wait) {
  let timeout

  let later = function (context, args) {
    timeout = null
    func.apply(context, args)
  }

  let debounced = function () {
    let args = [].slice.call(arguments)
    if (timeout) { clearTimeout(timeout) }
    setTimeout(later.bind(this, args), wait)
  }

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced
}

_.isObject = function (list) {
  return (typeof list === 'object' || typeof list === 'function')
}

_.isArray = function (list) {
  return Array.isArray(list)
}

_.contains = function (list, value, compare) {
  if (!_.isObject(list)) {
    return compare ? compare(list, value) : list === value
  }
  else {
    for (let i in list) {
      if (compare ? compare(value, list[i]) : value === list[i]) {
        return true
      }
    }
  }
  return false
}

_.containsProp = function (list, prop) {
  if (!_.isObject(list)) {
    return false
  }
  else {
    for (let p in list) {
      if (p === prop) { return true }
    }
  }
  return false
}

_.clone = function (o) {
  let clone
  if (_.isArray(o)) { clone = [] }
  else if (_.isObject(o)) { clone = {} }
  else { return o }

  for (let prop in o) {
    if (_.isObject(o[prop])) {
      clone[prop] = _.clone(o[prop])
    }
    else {
      clone[prop] = o[prop]
    }
  }
  return clone
}

_.properties = function (o) {
  if (!_.isObject(o)) { return null }
  let props = []
  for (let prop in o) {
    props.push(prop)
  }
  return props
}

_.find = function (list, predicate) {
  if (!_.isObject(list)) { return null }
  for (let prop in list) {
    let result = predicate(list[prop], prop)
    if (false !== result) { return result }
  }
  return false
}

_.colorToString = function (color) {
  let result
  let regHex = /^\s*#([0-9a-fA-F]{6})\s*$/
  let regRGB = /^\s*(rgb|RGB)\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$\s*/
  let regRBGA = /^\s*(rgba|RGBA)\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$\s*/
  if (result = regHex.exec(color)) {
    return result[1].toLowerCase()
  }
  else if (result = regRGB.exec(color)) {
    let r = parseInt(result[2]).toString(16)
    let g = parseInt(result[3]).toString(16)
    let b = parseInt(result[4]).toString(16)
    return r + g + b
  }
  else if (result = regRBGA.exec(color)) {
    let r = parseInt(result[2]).toString(16)
    let g = parseInt(result[3]).toString(16)
    let b = parseInt(result[4]).toString(16)
    return r + g + b + ',' + result[5]
  }
}

_.compareColor = function (colorA, colorB) {
  return _.colorToString(colorA) === _.colorToString(colorB)
}

_.compare = function (a, b, deep) {
  if (!_.isObject(a) || !_.isObject(b)) {
    return a === b
  }
  if (_.properties(a).length !== _.properties(b).length) {
    return false
  }
  for (let prop in a) {
    let result
    if (_.isObject(a[prop]) && deep) {
      result = _.compare(a[prop], b[prop], true)
    }
    else {
      result = a[prop] === b[prop]
    }
    if (!result) { return false }
  }
  return true
}

export default _
