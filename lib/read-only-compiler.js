"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ReadOnlyCompiler is a compiler which allows the host to inject all of the compiler
 * metadata information so that {@link CompileCache} et al are able to recreate the
 * hash without having two separate code paths.
 */
var ReadOnlyCompiler = function () {
  /**  
   * Creates a ReadOnlyCompiler instance
   *    
   * @private
   */
  function ReadOnlyCompiler(name, compilerVersion, compilerOptions, inputMimeTypes) {
    (0, _classCallCheck3.default)(this, ReadOnlyCompiler);

    (0, _assign2.default)(this, { name: name, compilerVersion: compilerVersion, compilerOptions: compilerOptions, inputMimeTypes: inputMimeTypes });
  }

  (0, _createClass3.default)(ReadOnlyCompiler, [{
    key: "shouldCompileFile",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", true);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function shouldCompileFile() {
        return _ref.apply(this, arguments);
      }

      return shouldCompileFile;
    }()
  }, {
    key: "determineDependentFiles",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", []);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function determineDependentFiles() {
        return _ref2.apply(this, arguments);
      }

      return determineDependentFiles;
    }()
  }, {
    key: "compile",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                throw new Error("Read-only compilers can't compile");

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function compile() {
        return _ref3.apply(this, arguments);
      }

      return compile;
    }()
  }, {
    key: "shouldCompileFileSync",
    value: function shouldCompileFileSync() {
      return true;
    }
  }, {
    key: "determineDependentFilesSync",
    value: function determineDependentFilesSync() {
      return [];
    }
  }, {
    key: "compileSync",
    value: function compileSync() {
      throw new Error("Read-only compilers can't compile");
    }
  }, {
    key: "getCompilerVersion",
    value: function getCompilerVersion() {
      return this.compilerVersion;
    }
  }]);
  return ReadOnlyCompiler;
}();

exports.default = ReadOnlyCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWFkLW9ubHktY29tcGlsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7OztJQUtxQixnQjtBQUNuQjs7Ozs7QUFLQSw0QkFBWSxJQUFaLEVBQWtCLGVBQWxCLEVBQW1DLGVBQW5DLEVBQW9ELGNBQXBELEVBQW9FO0FBQUE7O0FBQ2xFLDBCQUFjLElBQWQsRUFBb0IsRUFBRSxVQUFGLEVBQVEsZ0NBQVIsRUFBeUIsZ0NBQXpCLEVBQTBDLDhCQUExQyxFQUFwQjtBQUNEOzs7Ozs7Ozs7O2lEQUVrQyxJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0RBQ00sRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUdqQyxJQUFJLEtBQUosQ0FBVSxtQ0FBVixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NENBR2dCO0FBQUUsYUFBTyxJQUFQO0FBQWM7OztrREFDVjtBQUFFLGFBQU8sRUFBUDtBQUFZOzs7a0NBRTlCO0FBQ1osWUFBTSxJQUFJLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBQ0Q7Ozt5Q0FFb0I7QUFDbkIsYUFBTyxLQUFLLGVBQVo7QUFDRDs7Ozs7a0JBMUJrQixnQiIsImZpbGUiOiJyZWFkLW9ubHktY29tcGlsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWRPbmx5Q29tcGlsZXIgaXMgYSBjb21waWxlciB3aGljaCBhbGxvd3MgdGhlIGhvc3QgdG8gaW5qZWN0IGFsbCBvZiB0aGUgY29tcGlsZXJcbiAqIG1ldGFkYXRhIGluZm9ybWF0aW9uIHNvIHRoYXQge0BsaW5rIENvbXBpbGVDYWNoZX0gZXQgYWwgYXJlIGFibGUgdG8gcmVjcmVhdGUgdGhlXG4gKiBoYXNoIHdpdGhvdXQgaGF2aW5nIHR3byBzZXBhcmF0ZSBjb2RlIHBhdGhzLlxuICovIFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVhZE9ubHlDb21waWxlciB7XG4gIC8qKiAgXG4gICAqIENyZWF0ZXMgYSBSZWFkT25seUNvbXBpbGVyIGluc3RhbmNlXG4gICAqICAgIFxuICAgKiBAcHJpdmF0ZVxuICAgKi8gICBcbiAgY29uc3RydWN0b3IobmFtZSwgY29tcGlsZXJWZXJzaW9uLCBjb21waWxlck9wdGlvbnMsIGlucHV0TWltZVR5cGVzKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IG5hbWUsIGNvbXBpbGVyVmVyc2lvbiwgY29tcGlsZXJPcHRpb25zLCBpbnB1dE1pbWVUeXBlcyB9KTtcbiAgfVxuICBcbiAgYXN5bmMgc2hvdWxkQ29tcGlsZUZpbGUoKSB7IHJldHVybiB0cnVlOyB9XG4gIGFzeW5jIGRldGVybWluZURlcGVuZGVudEZpbGVzKCkgeyByZXR1cm4gW107IH1cblxuICBhc3luYyBjb21waWxlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlJlYWQtb25seSBjb21waWxlcnMgY2FuJ3QgY29tcGlsZVwiKTtcbiAgfVxuXG4gIHNob3VsZENvbXBpbGVGaWxlU3luYygpIHsgcmV0dXJuIHRydWU7IH1cbiAgZGV0ZXJtaW5lRGVwZW5kZW50RmlsZXNTeW5jKCkgeyByZXR1cm4gW107IH1cblxuICBjb21waWxlU3luYygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkLW9ubHkgY29tcGlsZXJzIGNhbid0IGNvbXBpbGVcIik7XG4gIH1cblxuICBnZXRDb21waWxlclZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tcGlsZXJWZXJzaW9uO1xuICB9XG59XG4iXX0=