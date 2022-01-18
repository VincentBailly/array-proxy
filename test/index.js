
const tap = require('tap')
const { arrayHandler } = require('..')

tap.test('Readme code works', t => {
  const handler = {
    get: (target, prop, receiver) => {
      if (prop === 'foo') {
        return 'bar'
      }
      return Reflect.get(target, prop, receiver)
    }
  }
  const newHandler = arrayHandler(handler)

  const arrayProxy = new Proxy([42], newHandler)

  t.equal(arrayProxy.foo, 'bar', 'initial handler is used')
  const a = []
  arrayProxy.forEach(e => a.push(e))
  t.same(a, [42], 'Array methods work') 
  t.end()
})

tap.test('the input handler does not have a get field', t => {
  const newHandler = arrayHandler({})

  const arrayProxy = new Proxy([42], newHandler)

  const a = []
  arrayProxy.forEach(e => a.push(e))
  t.same(a, [42], 'Array methods work') 
  t.end()
})

tap.test('this is bound to proxy in class methods', t => {
  const handler = {
    get: (target, prop, receiver) => {
      if (prop === '__foo') {
        return 'bar'
      }
      return Reflect.get(target, prop, receiver)
    }
  }
  const newHandler = arrayHandler(handler)

  class MyArray extends Array {
    getFoo() {
      return this.__foo
    }
  }

  const arrayProxy = new Proxy(new MyArray(42, 42), newHandler)

  const a = []
  arrayProxy.forEach(e => a.push(e))
  t.same(a, [42, 42], 'Array methods work') 

  t.equal(arrayProxy.getFoo(), 'bar', 'class methods use proxy and not its target')
  t.end()
})
