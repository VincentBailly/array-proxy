# Array proxy

## Description

JavaScript proxy objects don't work with arrays because they have native properties that are not proxied.
This library make them work.

## Usage

```javascript

const { arrayHandler } = require('array-proxy')

const handler = {
  get: (target, prop, receiver) => {
    if (prop === 'foo') {
      return 'bar'
    }
    return Reflect.get(target, prop, receiver)
  }
}
const newHandler = arrayHandler(handler)

const nativeProxy = new Proxy([42], handler)
const arrayProxy = new Proxy([42], newHandler)

console.log(nativeProxy.foo)
// => bar
console.log(nativeProxy.forEach(e => console.log(e)))
// => throws
//    Uncaught TypeError: Method Array.prototype.forEach called on incompatible receiver #<Array>
//        at Proxy.forEach (<anonymous>)

console.log(arrayProxy.foo)
// => bar
arrayProxy.forEach(e => console.log(e))
// => 42


```

## API

### arrayHandler(handler)

The input is a [proxy handler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy).

Returns a new proxy handler which wraps the input in a handler which make proxies work with arrays.

