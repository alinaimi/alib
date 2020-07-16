// Shared lib between NodeJS and JScript
var gl_var = 1 // inside this module only
gl_var = 1 // global

require("alib_print.js")
require("alib_csv.js")
require("alib_misc.js")
require("alib_trnsp.js")

addZero = function(i) {
  return (i > 9 ? '' : '0') + i;
}

var ali = function(radius) {
  this.radius = radius
}

ali.PI = 3.14
ali.prototype = {
  area: function() {
    return ali.PI * this.radius * this.radius;
  }
}

// console.log("");
var invisible = function() {
  console.log("invisible");
}

var foo = {};
foo.greet = function() {
  console.log('Hello from Foo!');
}

// foo.greet();
bar = 5;
x = function() {
  console.log('xx!');
}

// export default myFunc;
var exports = {} // to bypass JScript error regarding exports
exports.message = "hi";
exports.say = function() {
  console.log(exports.message);
}
