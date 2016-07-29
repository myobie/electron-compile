'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.forAllFiles = forAllFiles;
exports.forAllFilesSync = forAllFilesSync;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promise = require('./promise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Invokes a method on all files in a directory recursively.
 * 
 * @private
 */
function forAllFiles(rootDirectory, func) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var _this = this;

  var rec = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(dir) {
      var entries, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, fullName, stats;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _promise.pfs.readdir(dir);

            case 2:
              entries = _context.sent;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 6;
              _iterator = (0, _getIterator3.default)(entries);

            case 8:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 23;
                break;
              }

              name = _step.value;
              fullName = _path2.default.join(dir, name);
              _context.next = 13;
              return _promise.pfs.stat(fullName);

            case 13:
              stats = _context.sent;

              if (!stats.isDirectory()) {
                _context.next = 17;
                break;
              }

              _context.next = 17;
              return rec(fullName);

            case 17:
              if (!stats.isFile()) {
                _context.next = 20;
                break;
              }

              _context.next = 20;
              return func.apply(undefined, [fullName].concat(args));

            case 20:
              _iteratorNormalCompletion = true;
              _context.next = 8;
              break;

            case 23:
              _context.next = 29;
              break;

            case 25:
              _context.prev = 25;
              _context.t0 = _context['catch'](6);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 29:
              _context.prev = 29;
              _context.prev = 30;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 32:
              _context.prev = 32;

              if (!_didIteratorError) {
                _context.next = 35;
                break;
              }

              throw _iteratorError;

            case 35:
              return _context.finish(32);

            case 36:
              return _context.finish(29);

            case 37:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[6, 25, 29, 37], [30,, 32, 36]]);
    }));

    return function rec(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return rec(rootDirectory);
}

function forAllFilesSync(rootDirectory, func) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var rec = function rec(dir) {
    _fs2.default.readdirSync(dir).forEach(function (name) {
      var fullName = _path2.default.join(dir, name);
      var stats = _fs2.default.statSync(fullName);

      if (stats.isDirectory()) {
        rec(fullName);
        return;
      }

      if (stats.isFile()) {
        func.apply(undefined, [fullName].concat(args));
        return;
      }
    });
  };

  rec(rootDirectory);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3ItYWxsLWZpbGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVVnQixXLEdBQUEsVztRQXFCQSxlLEdBQUEsZTs7QUEvQmhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7OztBQUtPLFNBQVMsV0FBVCxDQUFxQixhQUFyQixFQUFvQyxJQUFwQyxFQUFtRDtBQUFBLG9DQUFOLElBQU07QUFBTixRQUFNO0FBQUE7O0FBQUE7O0FBQ3hELE1BQUk7QUFBQSwwRUFBTSxpQkFBTyxHQUFQO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNZLGFBQUksT0FBSixDQUFZLEdBQVosQ0FEWjs7QUFBQTtBQUNKLHFCQURJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxREFHUyxPQUhUOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBR0Msa0JBSEQ7QUFJRixzQkFKRSxHQUlTLGVBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxJQUFmLENBSlQ7QUFBQTtBQUFBLHFCQUtZLGFBQUksSUFBSixDQUFTLFFBQVQsQ0FMWjs7QUFBQTtBQUtGLG1CQUxFOztBQUFBLG1CQU9GLE1BQU0sV0FBTixFQVBFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEscUJBUUUsSUFBSSxRQUFKLENBUkY7O0FBQUE7QUFBQSxtQkFXRixNQUFNLE1BQU4sRUFYRTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLHFCQVlFLHVCQUFLLFFBQUwsU0FBa0IsSUFBbEIsRUFaRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQU47O0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBSjs7QUFpQkEsU0FBTyxJQUFJLGFBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVMsZUFBVCxDQUF5QixhQUF6QixFQUF3QyxJQUF4QyxFQUF1RDtBQUFBLHFDQUFOLElBQU07QUFBTixRQUFNO0FBQUE7O0FBQzVELE1BQUksTUFBTSxTQUFOLEdBQU0sQ0FBQyxHQUFELEVBQVM7QUFDakIsaUJBQUcsV0FBSCxDQUFlLEdBQWYsRUFBb0IsT0FBcEIsQ0FBNEIsVUFBQyxJQUFELEVBQVU7QUFDcEMsVUFBSSxXQUFXLGVBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxJQUFmLENBQWY7QUFDQSxVQUFJLFFBQVEsYUFBRyxRQUFILENBQVksUUFBWixDQUFaOztBQUVBLFVBQUksTUFBTSxXQUFOLEVBQUosRUFBeUI7QUFDdkIsWUFBSSxRQUFKO0FBQ0E7QUFDRDs7QUFFRCxVQUFJLE1BQU0sTUFBTixFQUFKLEVBQW9CO0FBQ2xCLCtCQUFLLFFBQUwsU0FBa0IsSUFBbEI7QUFDQTtBQUNEO0FBQ0YsS0FiRDtBQWNELEdBZkQ7O0FBaUJBLE1BQUksYUFBSjtBQUNEIiwiZmlsZSI6ImZvci1hbGwtZmlsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge3Bmc30gZnJvbSAnLi9wcm9taXNlJztcblxuXG4vKipcbiAqIEludm9rZXMgYSBtZXRob2Qgb24gYWxsIGZpbGVzIGluIGEgZGlyZWN0b3J5IHJlY3Vyc2l2ZWx5LlxuICogXG4gKiBAcHJpdmF0ZVxuICovIFxuZXhwb3J0IGZ1bmN0aW9uIGZvckFsbEZpbGVzKHJvb3REaXJlY3RvcnksIGZ1bmMsIC4uLmFyZ3MpIHtcbiAgbGV0IHJlYyA9IGFzeW5jIChkaXIpID0+IHtcbiAgICBsZXQgZW50cmllcyA9IGF3YWl0IHBmcy5yZWFkZGlyKGRpcik7XG4gICAgXG4gICAgZm9yIChsZXQgbmFtZSBvZiBlbnRyaWVzKSB7XG4gICAgICBsZXQgZnVsbE5hbWUgPSBwYXRoLmpvaW4oZGlyLCBuYW1lKTtcbiAgICAgIGxldCBzdGF0cyA9IGF3YWl0IHBmcy5zdGF0KGZ1bGxOYW1lKTtcblxuICAgICAgaWYgKHN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgYXdhaXQgcmVjKGZ1bGxOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgIGF3YWl0IGZ1bmMoZnVsbE5hbWUsIC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcmVjKHJvb3REaXJlY3RvcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yQWxsRmlsZXNTeW5jKHJvb3REaXJlY3RvcnksIGZ1bmMsIC4uLmFyZ3MpIHtcbiAgbGV0IHJlYyA9IChkaXIpID0+IHtcbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGxldCBmdWxsTmFtZSA9IHBhdGguam9pbihkaXIsIG5hbWUpO1xuICAgICAgbGV0IHN0YXRzID0gZnMuc3RhdFN5bmMoZnVsbE5hbWUpO1xuICAgICAgXG4gICAgICBpZiAoc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICByZWMoZnVsbE5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChzdGF0cy5pc0ZpbGUoKSkge1xuICAgICAgICBmdW5jKGZ1bGxOYW1lLCAuLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBcbiAgcmVjKHJvb3REaXJlY3RvcnkpO1xufVxuIl19