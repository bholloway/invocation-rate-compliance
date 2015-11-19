'use strict';

/**
 * A utility that ensures invocation of a function complies to a limited rate.
 *
 * The utility is a factory for a method that may be invoked. The first invocation is always `compliant` and a chain of
 * methods `[before, compliant, after]` is called. If the factoried method is invocated again before the given delay
 * then invocation is `anti-compliant` and a chain of methods `[before, antiCompliant, after]` is called.
 *
 * The delay is milliseconds measured from the last compliant invocation. Anti-compliant invocations do not change
 * internal state.
 *
 * At each stage in the method chain the value returned by the previous function is the first argument to the following
 * function. Successive arguments will match those of the invocation. The first argument to the `before` method is
 * always `undefined`.
 *
 * @param {{delay:number, before:function, after:function, compliant:function, antiCompliant:function}} options
 * @returns {function} A function that will invoke the method chain
 */
function invocationRateCompliance(options) {
  options = options || {};
  var delay         = options.delay || 0,
      before        = options.before,
      compliant     = options.compliant,
      antiCompliant = options.antiCompliant,
      after         = options.after;
  var nextTime;

  return function instance() {
    var args        = Array.prototype.slice.call(arguments),
        now         = Date.now(),
        isCompliant = !nextTime || (now > nextTime),
        methodChain = [before, (isCompliant ? compliant : antiCompliant), after];

    if (isCompliant) {
      nextTime = now + delay;
    }
    return methodChain.reduce(eachMethod, undefined);

    function eachMethod(previousValue, method) {
      return (typeof method === 'function') ? method.apply(null, [previousValue].concat(args)) :
        (typeof method !== 'undefined') ? method : previousValue;
    }
  };
}

module.exports = invocationRateCompliance;