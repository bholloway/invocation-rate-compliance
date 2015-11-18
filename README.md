# Invocation Rate Compliance

[![NPM](https://nodei.co/npm/invocation-rate-compliance.png)](http://github.com/bholloway/invocation-rate-compliance)

A throttle utility that ensures invocation complies to a limited rate

## Usage

```javascript
var invocationRateCompliance = require('invocation-rate-compliance');

var throttled = invocationRateCompliance({
  delay        : 100,
  before       : function before() {
      return 'invocation was';
    },
  compliant    : function compliant(previous) {
      return previous + ' compliant';
    },
  antiCompliant: function antiCompliant(previous) {
      return previous + ' anti-compliant';
    },
  after        : function after(previous, x) {
      return previous + ' with argument ' + String(x);
    }
});

throttled(5);                // invocation was compliant with argument 5
throttled('a');              // invocation was anti-compliant with argument a
setTimeout(throttled, 200);  // invocation was compliant with argument undefined

```

The utility is a factory for a method that may be invoked. The first invocation is always **compliant** and a chain of methods `[before, compliant, after]` is called. If the method is called again before the given delay then invocation is **anti-compliant** and a chain of methods `[before, antiCompliant, after]` is called.

The delay is milliseconds measured from the last compliant invocation. Anti-compliant invocations do not change internal state.

At each stage in the method chain the value returned by the previous function is the first argument to the following function. Successive arguments will match those of the invocation. The first argument to the `before` method is always `undefined`.