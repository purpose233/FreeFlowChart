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

export default _
