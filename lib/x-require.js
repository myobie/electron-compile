'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requireModule(href) {
  var filePath = href;

  if (filePath.match(/^file:/i)) {
    var theUrl = _url2.default.parse(filePath);
    filePath = decodeURIComponent(theUrl.pathname);

    if (process.platform === 'win32') {
      filePath = filePath.slice(1);
    }
  }

  // NB: We don't do any path canonicalization here because we rely on
  // InlineHtmlCompiler to have already converted any relative paths that
  // were used with x-require into absolute paths.
  require(filePath);
}

/**
 * @private
 */

exports.default = function () {
  if (process.type !== 'renderer' || !window || !window.document) return null;

  var proto = (0, _assign2.default)((0, _create2.default)(HTMLElement.prototype), {
    createdCallback: function createdCallback() {
      var href = this.getAttribute('src');
      if (href && href.length > 0) {
        requireModule(href);
      }
    },
    attributeChangedCallback: function attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName !== 'src') return;
      requireModule(newVal);
    }
  });

  return document.registerElement('x-require', { prototype: proto });
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy94LXJlcXVpcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCO0FBQzNCLE1BQUksV0FBVyxJQUFmOztBQUVBLE1BQUksU0FBUyxLQUFULENBQWUsU0FBZixDQUFKLEVBQStCO0FBQzdCLFFBQUksU0FBUyxjQUFJLEtBQUosQ0FBVSxRQUFWLENBQWI7QUFDQSxlQUFXLG1CQUFtQixPQUFPLFFBQTFCLENBQVg7O0FBRUEsUUFBSSxRQUFRLFFBQVIsS0FBcUIsT0FBekIsRUFBa0M7QUFDaEMsaUJBQVcsU0FBUyxLQUFULENBQWUsQ0FBZixDQUFYO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxVQUFRLFFBQVI7QUFDRDs7QUFFRDs7OztrQkFHZ0IsWUFBTTtBQUNwQixNQUFJLFFBQVEsSUFBUixLQUFpQixVQUFqQixJQUErQixDQUFDLE1BQWhDLElBQTBDLENBQUMsT0FBTyxRQUF0RCxFQUFnRSxPQUFPLElBQVA7O0FBRWhFLE1BQUksUUFBUSxzQkFBYyxzQkFBYyxZQUFZLFNBQTFCLENBQWQsRUFBb0Q7QUFDOUQscUJBQWlCLDJCQUFXO0FBQzFCLFVBQUksT0FBTyxLQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBWDtBQUNBLFVBQUksUUFBUSxLQUFLLE1BQUwsR0FBYyxDQUExQixFQUE2QjtBQUMzQixzQkFBYyxJQUFkO0FBQ0Q7QUFDRixLQU42RDtBQU85RCw4QkFBMEIsa0NBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEyQixNQUEzQixFQUFtQztBQUMzRCxVQUFJLGFBQWEsS0FBakIsRUFBd0I7QUFDeEIsb0JBQWMsTUFBZDtBQUNEO0FBVjZELEdBQXBELENBQVo7O0FBYUEsU0FBTyxTQUFTLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0MsRUFBRSxXQUFXLEtBQWIsRUFBdEMsQ0FBUDtBQUNELENBakJjLEUiLCJmaWxlIjoieC1yZXF1aXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG5mdW5jdGlvbiByZXF1aXJlTW9kdWxlKGhyZWYpIHtcbiAgbGV0IGZpbGVQYXRoID0gaHJlZjtcbiAgXG4gIGlmIChmaWxlUGF0aC5tYXRjaCgvXmZpbGU6L2kpKSB7XG4gICAgbGV0IHRoZVVybCA9IHVybC5wYXJzZShmaWxlUGF0aCk7XG4gICAgZmlsZVBhdGggPSBkZWNvZGVVUklDb21wb25lbnQodGhlVXJsLnBhdGhuYW1lKTtcblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnNsaWNlKDEpO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gTkI6IFdlIGRvbid0IGRvIGFueSBwYXRoIGNhbm9uaWNhbGl6YXRpb24gaGVyZSBiZWNhdXNlIHdlIHJlbHkgb25cbiAgLy8gSW5saW5lSHRtbENvbXBpbGVyIHRvIGhhdmUgYWxyZWFkeSBjb252ZXJ0ZWQgYW55IHJlbGF0aXZlIHBhdGhzIHRoYXRcbiAgLy8gd2VyZSB1c2VkIHdpdGggeC1yZXF1aXJlIGludG8gYWJzb2x1dGUgcGF0aHMuXG4gIHJlcXVpcmUoZmlsZVBhdGgpO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi8gXG5leHBvcnQgZGVmYXVsdCAoKCkgPT4ge1xuICBpZiAocHJvY2Vzcy50eXBlICE9PSAncmVuZGVyZXInIHx8ICF3aW5kb3cgfHwgIXdpbmRvdy5kb2N1bWVudCkgcmV0dXJuIG51bGw7XG4gIFxuICBsZXQgcHJvdG8gPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlKSwge1xuICAgIGNyZWF0ZWRDYWxsYmFjazogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgaHJlZiA9IHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgIGlmIChocmVmICYmIGhyZWYubGVuZ3RoID4gMCkge1xuICAgICAgICByZXF1aXJlTW9kdWxlKGhyZWYpO1xuICAgICAgfVxuICAgIH0sIFxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjazogZnVuY3Rpb24oYXR0ck5hbWUsIG9sZFZhbCwgbmV3VmFsKSB7XG4gICAgICBpZiAoYXR0ck5hbWUgIT09ICdzcmMnKSByZXR1cm47XG4gICAgICByZXF1aXJlTW9kdWxlKG5ld1ZhbCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCd4LXJlcXVpcmUnLCB7IHByb3RvdHlwZTogcHJvdG8gfSk7XG59KSgpO1xuIl19