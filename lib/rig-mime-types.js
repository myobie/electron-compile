'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.init = init;

var _mimeTypes = require('@paulcbetts/mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typesToRig = {
  'text/typescript': 'ts',
  'text/jade': 'jade',
  'text/cson': 'cson',
  'text/stylus': 'styl'
};

/**
 * Adds MIME types for types not in the mime-types package
 *
 * @private
 */
function init() {
  (0, _keys2.default)(typesToRig).forEach(function (type) {
    var ext = typesToRig[type];

    _mimeTypes2.default.types[ext] = type;
    _mimeTypes2.default.extensions[type] = [ext];
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yaWctbWltZS10eXBlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBZWdCLEksR0FBQSxJOztBQWZoQjs7Ozs7O0FBRUEsSUFBTSxhQUFhO0FBQ2pCLHFCQUFtQixJQURGO0FBRWpCLGVBQWEsTUFGSTtBQUdqQixlQUFhLE1BSEk7QUFJakIsaUJBQWU7QUFKRSxDQUFuQjs7QUFRQTs7Ozs7QUFLTyxTQUFTLElBQVQsR0FBZ0I7QUFDckIsc0JBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFDLElBQUQsRUFBVTtBQUN4QyxRQUFJLE1BQU0sV0FBVyxJQUFYLENBQVY7O0FBRUEsd0JBQVUsS0FBVixDQUFnQixHQUFoQixJQUF1QixJQUF2QjtBQUNBLHdCQUFVLFVBQVYsQ0FBcUIsSUFBckIsSUFBNkIsQ0FBQyxHQUFELENBQTdCO0FBQ0QsR0FMRDtBQU1EIiwiZmlsZSI6InJpZy1taW1lLXR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1pbWVUeXBlcyBmcm9tICdAcGF1bGNiZXR0cy9taW1lLXR5cGVzJztcblxuY29uc3QgdHlwZXNUb1JpZyA9IHtcbiAgJ3RleHQvdHlwZXNjcmlwdCc6ICd0cycsXG4gICd0ZXh0L2phZGUnOiAnamFkZScsXG4gICd0ZXh0L2Nzb24nOiAnY3NvbicsXG4gICd0ZXh0L3N0eWx1cyc6ICdzdHlsJ1xufTtcblxuXG4vKipcbiAqIEFkZHMgTUlNRSB0eXBlcyBmb3IgdHlwZXMgbm90IGluIHRoZSBtaW1lLXR5cGVzIHBhY2thZ2VcbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgT2JqZWN0LmtleXModHlwZXNUb1JpZykuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIGxldCBleHQgPSB0eXBlc1RvUmlnW3R5cGVdO1xuXG4gICAgbWltZVR5cGVzLnR5cGVzW2V4dF0gPSB0eXBlO1xuICAgIG1pbWVUeXBlcy5leHRlbnNpb25zW3R5cGVdID0gW2V4dF07XG4gIH0pO1xufVxuIl19