'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pzlib = exports.pfs = undefined;

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NB: We do this so that every module doesn't have to run pify
// on fs and zlib


/**
 * @private
 */
var pfs = exports.pfs = (0, _pify2.default)(require('fs'));

/**
 * @private
 */
var pzlib = exports.pzlib = (0, _pify2.default)(require('zlib'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9taXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7QUFDQTs7O0FBR0E7OztBQUdPLElBQU0sb0JBQU0sb0JBQUssUUFBUSxJQUFSLENBQUwsQ0FBWjs7QUFFUDs7O0FBR08sSUFBTSx3QkFBUSxvQkFBSyxRQUFRLE1BQVIsQ0FBTCxDQUFkIiwiZmlsZSI6InByb21pc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGlmeSBmcm9tICdwaWZ5JztcblxuLy8gTkI6IFdlIGRvIHRoaXMgc28gdGhhdCBldmVyeSBtb2R1bGUgZG9lc24ndCBoYXZlIHRvIHJ1biBwaWZ5XG4vLyBvbiBmcyBhbmQgemxpYlxuXG5cbi8qKlxuICogQHByaXZhdGVcbiAqLyBcbmV4cG9ydCBjb25zdCBwZnMgPSBwaWZ5KHJlcXVpcmUoJ2ZzJykpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi8gXG5leHBvcnQgY29uc3QgcHpsaWIgPSBwaWZ5KHJlcXVpcmUoJ3psaWInKSk7XG4iXX0=