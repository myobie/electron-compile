'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = registerRequireExtension;

var _mimeTypes = require('@paulcbetts/mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initializes the node.js hook that allows us to intercept files loaded by 
 * node.js and rewrite them. This method along with {@link initializeProtocolHook} 
 * are the top-level methods that electron-compile actually uses to intercept 
 * code that Electron loads.
 *  
 * @param  {CompilerHost} compilerHost  The compiler host to use for compilation.
 */
function registerRequireExtension(compilerHost) {
  (0, _keys2.default)(compilerHost.compilersByMimeType).forEach(function (mimeType) {
    var ext = _mimeTypes2.default.extension(mimeType);

    require.extensions['.' + ext] = function (module, filename) {
      var _compilerHost$compile = compilerHost.compileSync(filename);

      var code = _compilerHost$compile.code;

      module._compile(code, filename);
    };
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1aXJlLWhvb2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkFVd0Isd0I7O0FBVnhCOzs7Ozs7QUFFQTs7Ozs7Ozs7QUFRZSxTQUFTLHdCQUFULENBQWtDLFlBQWxDLEVBQWdEO0FBQzdELHNCQUFZLGFBQWEsbUJBQXpCLEVBQThDLE9BQTlDLENBQXNELFVBQUMsUUFBRCxFQUFjO0FBQ2xFLFFBQUksTUFBTSxvQkFBVSxTQUFWLENBQW9CLFFBQXBCLENBQVY7O0FBRUEsWUFBUSxVQUFSLE9BQXVCLEdBQXZCLElBQWdDLFVBQUMsTUFBRCxFQUFTLFFBQVQsRUFBc0I7QUFBQSxrQ0FDdkMsYUFBYSxXQUFiLENBQXlCLFFBQXpCLENBRHVDOztBQUFBLFVBQy9DLElBRCtDLHlCQUMvQyxJQUQrQzs7QUFFcEQsYUFBTyxRQUFQLENBQWdCLElBQWhCLEVBQXNCLFFBQXRCO0FBQ0QsS0FIRDtBQUlELEdBUEQ7QUFRRCIsImZpbGUiOiJyZXF1aXJlLWhvb2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWltZVR5cGVzIGZyb20gJ0BwYXVsY2JldHRzL21pbWUtdHlwZXMnO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBub2RlLmpzIGhvb2sgdGhhdCBhbGxvd3MgdXMgdG8gaW50ZXJjZXB0IGZpbGVzIGxvYWRlZCBieSBcbiAqIG5vZGUuanMgYW5kIHJld3JpdGUgdGhlbS4gVGhpcyBtZXRob2QgYWxvbmcgd2l0aCB7QGxpbmsgaW5pdGlhbGl6ZVByb3RvY29sSG9va30gXG4gKiBhcmUgdGhlIHRvcC1sZXZlbCBtZXRob2RzIHRoYXQgZWxlY3Ryb24tY29tcGlsZSBhY3R1YWxseSB1c2VzIHRvIGludGVyY2VwdCBcbiAqIGNvZGUgdGhhdCBFbGVjdHJvbiBsb2Fkcy5cbiAqICBcbiAqIEBwYXJhbSAge0NvbXBpbGVySG9zdH0gY29tcGlsZXJIb3N0ICBUaGUgY29tcGlsZXIgaG9zdCB0byB1c2UgZm9yIGNvbXBpbGF0aW9uLlxuICovIFxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVnaXN0ZXJSZXF1aXJlRXh0ZW5zaW9uKGNvbXBpbGVySG9zdCkge1xuICBPYmplY3Qua2V5cyhjb21waWxlckhvc3QuY29tcGlsZXJzQnlNaW1lVHlwZSkuZm9yRWFjaCgobWltZVR5cGUpID0+IHtcbiAgICBsZXQgZXh0ID0gbWltZVR5cGVzLmV4dGVuc2lvbihtaW1lVHlwZSk7XG4gICAgXG4gICAgcmVxdWlyZS5leHRlbnNpb25zW2AuJHtleHR9YF0gPSAobW9kdWxlLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgbGV0IHtjb2RlfSA9IGNvbXBpbGVySG9zdC5jb21waWxlU3luYyhmaWxlbmFtZSk7XG4gICAgICBtb2R1bGUuX2NvbXBpbGUoY29kZSwgZmlsZW5hbWUpO1xuICAgIH07XG4gIH0pO1xufVxuIl19