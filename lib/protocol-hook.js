'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.rigHtmlDocumentToInitializeElectronCompile = rigHtmlDocumentToInitializeElectronCompile;
exports.initializeProtocolHook = initializeProtocolHook;

require('./babel-maybefill');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mimeTypes = require('@paulcbetts/mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var magicWords = "__magic__file__to__help__electron__compile.js";

// NB: These are duped in initialize-renderer so we can save startup time, make
// sure to run both!
var magicGlobalForRootCacheDir = '__electron_compile_root_cache_dir';
var magicGlobalForAppRootDir = '__electron_compile_app_root_dir';

var d = require('debug-electron')('electron-compile:protocol-hook');

var protocol = null;

/**
 * Adds our script header to the top of all HTML files
 *
 * @private
 */
function rigHtmlDocumentToInitializeElectronCompile(doc) {
  var lines = doc.split("\n");
  var replacement = '<head><script src="' + magicWords + '"></script>';
  var replacedHead = false;

  for (var i = 0; i < lines.length; i++) {
    if (!lines[i].match(/<head>/i)) continue;

    lines[i] = lines[i].replace(/<head>/i, replacement);
    replacedHead = true;
    break;
  }

  if (!replacedHead) {
    replacement = '<html$1><head><script src="' + magicWords + '"></script></head>';
    for (var _i = 0; _i < lines.length; _i++) {
      if (!lines[_i].match(/<html/i)) continue;

      lines[_i] = lines[_i].replace(/<html([^>]+)>/i, replacement);
      break;
    }
  }

  return lines.join("\n");
}

function requestFileJob(filePath, finish) {
  _fs2.default.readFile(filePath, function (err, buf) {
    if (err) {
      if (err.errno === 34) {
        finish(-6); // net::ERR_FILE_NOT_FOUND
        return;
      } else {
        finish(-2); // net::FAILED
        return;
      }
    }

    finish({
      data: buf,
      mimeType: _mimeTypes2.default.lookup(filePath) || 'text/plain'
    });
  });
}

/**
 * Initializes the protocol hook on file: that allows us to intercept files
 * loaded by Chromium and rewrite them. This method along with
 * {@link registerRequireExtension} are the top-level methods that electron-compile
 * actually uses to intercept code that Electron loads.
 *
 * @param  {CompilerHost} compilerHost  The compiler host to use for compilation.
 */
function initializeProtocolHook(compilerHost) {
  protocol = protocol || require('electron').protocol;

  global[magicGlobalForRootCacheDir] = compilerHost.rootCacheDir;
  global[magicGlobalForAppRootDir] = compilerHost.appRoot;

  var electronCompileSetupCode = 'if (window.require) require(\'electron-compile/lib/initialize-renderer\').initializeRendererProcess(' + compilerHost.readOnlyMode + ');';

  protocol.interceptBufferProtocol('file', function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(request, finish) {
      var uri, filePath, _ret, result, err;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              uri = _url2.default.parse(request.url);


              d('Intercepting url ' + request.url);

              if (!(request.url.indexOf(magicWords) > -1)) {
                _context.next = 5;
                break;
              }

              finish({
                mimeType: 'application/javascript',
                data: new Buffer(electronCompileSetupCode, 'utf8')
              });

              return _context.abrupt('return');

            case 5:
              if (!(uri.host && uri.host.length > 1)) {
                _context.next = 9;
                break;
              }

              //let newUri = request.url.replace(/^file:/, "https:");
              // TODO: Jump off this bridge later
              d('TODO: Found bogus protocol-relative URL, can\'t fix it up!!');
              finish(-2);
              return _context.abrupt('return');

            case 9:
              filePath = decodeURIComponent(uri.pathname);

              // NB: pathname has a leading '/' on Win32 for some reason

              if (process.platform === 'win32') {
                filePath = filePath.slice(1);
              }

              // NB: Special-case files coming from atom.asar or node_modules

              if (!(filePath.match(/[\/\\](atom|electron).asar/) || filePath.match(/[\/\\](node_modules|bower_components)/))) {
                _context.next = 18;
                break;
              }

              if (!filePath.match(/\.html?$/i)) {
                _context.next = 16;
                break;
              }

              _ret = function () {
                var riggedContents = null;
                _fs2.default.readFile(filePath, 'utf8', function (err, contents) {
                  if (err) {
                    if (err.errno === 34) {
                      finish(-6); // net::ERR_FILE_NOT_FOUND
                      return;
                    } else {
                      finish(-2); // net::FAILED
                      return;
                    }
                  }

                  riggedContents = rigHtmlDocumentToInitializeElectronCompile(contents);
                  finish({ data: new Buffer(riggedContents), mimeType: 'text/html' });
                  return;
                });

                return {
                  v: void 0
                };
              }();

              if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
                _context.next = 16;
                break;
              }

              return _context.abrupt('return', _ret.v);

            case 16:

              requestFileJob(filePath, finish);
              return _context.abrupt('return');

            case 18:
              _context.prev = 18;
              _context.next = 21;
              return compilerHost.compile(filePath);

            case 21:
              result = _context.sent;


              if (result.mimeType === 'text/html') {
                result.code = rigHtmlDocumentToInitializeElectronCompile(result.code);
              }

              if (!(result.binaryData || result.code instanceof Buffer)) {
                _context.next = 28;
                break;
              }

              finish({ data: result.binaryData || result.code, mimeType: result.mimeType });
              return _context.abrupt('return');

            case 28:
              finish({ data: new Buffer(result.code), mimeType: result.mimeType });
              return _context.abrupt('return');

            case 30:
              _context.next = 41;
              break;

            case 32:
              _context.prev = 32;
              _context.t0 = _context['catch'](18);
              err = 'Failed to compile ' + filePath + ': ' + _context.t0.message + '\n' + _context.t0.stack;

              d(err);

              if (!(_context.t0.errno === 34 /*ENOENT*/)) {
                _context.next = 39;
                break;
              }

              finish(-6); // net::ERR_FILE_NOT_FOUND
              return _context.abrupt('return');

            case 39:

              finish({ mimeType: 'text/plain', data: new Buffer(err) });
              return _context.abrupt('return');

            case 41:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[18, 32]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm90b2NvbC1ob29rLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXNCZ0IsMEMsR0FBQSwwQztRQXFEQSxzQixHQUFBLHNCOztBQTNFaEI7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsK0NBQW5COztBQUVBO0FBQ0E7QUFDQSxJQUFNLDZCQUE2QixtQ0FBbkM7QUFDQSxJQUFNLDJCQUEyQixpQ0FBakM7O0FBRUEsSUFBTSxJQUFJLFFBQVEsZ0JBQVIsRUFBMEIsZ0NBQTFCLENBQVY7O0FBRUEsSUFBSSxXQUFXLElBQWY7O0FBRUE7Ozs7O0FBS08sU0FBUywwQ0FBVCxDQUFvRCxHQUFwRCxFQUF5RDtBQUM5RCxNQUFJLFFBQVEsSUFBSSxLQUFKLENBQVUsSUFBVixDQUFaO0FBQ0EsTUFBSSxzQ0FBb0MsVUFBcEMsZ0JBQUo7QUFDQSxNQUFJLGVBQWUsS0FBbkI7O0FBRUEsT0FBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUksTUFBTSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxRQUFJLENBQUMsTUFBTSxDQUFOLEVBQVMsS0FBVCxDQUFlLFNBQWYsQ0FBTCxFQUFnQzs7QUFFaEMsVUFBTSxDQUFOLElBQVksTUFBTSxDQUFOLENBQUQsQ0FBVyxPQUFYLENBQW1CLFNBQW5CLEVBQThCLFdBQTlCLENBQVg7QUFDQSxtQkFBZSxJQUFmO0FBQ0E7QUFDRDs7QUFFRCxNQUFJLENBQUMsWUFBTCxFQUFtQjtBQUNqQixrREFBNEMsVUFBNUM7QUFDQSxTQUFLLElBQUksS0FBRSxDQUFYLEVBQWMsS0FBSSxNQUFNLE1BQXhCLEVBQWdDLElBQWhDLEVBQXFDO0FBQ25DLFVBQUksQ0FBQyxNQUFNLEVBQU4sRUFBUyxLQUFULENBQWUsUUFBZixDQUFMLEVBQStCOztBQUUvQixZQUFNLEVBQU4sSUFBWSxNQUFNLEVBQU4sQ0FBRCxDQUFXLE9BQVgsQ0FBbUIsZ0JBQW5CLEVBQXFD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ZSxRQUFmLEVBQXlCLE1BQXpCO0FBdkRxQzs7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkE0RGxCLGFBQWEsT0FBYixDQUFxQixRQUFyQixDQTVEa0I7O0FBQUE7QUE0RGpDLG9CQTVEaUM7OztBQThEckMsa0JBQUksT0FBTyxRQUFQLEtBQW9CLFdBQXhCLEVBQXFDO0FBQ25DLHVCQUFPLElBQVAsR0FBYywyQ0FBMkMsT0FBTyxJQUFsRCxDQUFkO0FBQ0Q7O0FBaEVvQyxvQkFrRWpDLE9BQU8sVUFBUCxJQUFxQixPQUFPLElBQVAsWUFBdUIsTUFsRVg7QUFBQTtBQUFBO0FBQUE7O0FBbUVuQyxxQkFBTyxFQUFFLE1BQU0sT0FBTyxVQUFQLElBQXFCLE9BQU8sSUFBcEMsRUFBMEMsVUFBVSxPQUFPLFFBQTNELEVBQVA7QUFuRW1DOztBQUFBO0FBc0VuQyxxQkFBTyxFQUFFLE1BQU0sSUFBSSxNQUFKLENBQVcsT0FBTyxJQUFsQixDQUFSLEVBQWlDLFVBQVUsT0FBTyxRQUFsRCxFQUFQO0FBdEVtQzs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBMEVqQyxpQkExRWlDLDBCQTBFTixRQTFFTSxVQTBFTyxZQUFFLE9BMUVULFVBMEVxQixZQUFFLEtBMUV2Qjs7QUEyRXJDLGdCQUFFLEdBQUY7O0FBM0VxQyxvQkE2RWpDLFlBQUUsS0FBRixLQUFZLEVBN0VxQixDQTZFbEIsVUE3RWtCO0FBQUE7QUFBQTtBQUFBOztBQThFbkMscUJBQU8sQ0FBQyxDQUFSLEVBOUVtQyxDQThFdkI7QUE5RXVCOztBQUFBOztBQWtGckMscUJBQU8sRUFBRSxVQUFVLFlBQVosRUFBMEIsTUFBTSxJQUFJLE1BQUosQ0FBVyxHQUFYLENBQWhDLEVBQVA7QUFsRnFDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQXpDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0ZEIiwiZmlsZSI6InByb3RvY29sLWhvb2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vYmFiZWwtbWF5YmVmaWxsJztcblxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBtaW1lIGZyb20gJ0BwYXVsY2JldHRzL21pbWUtdHlwZXMnO1xuXG5jb25zdCBtYWdpY1dvcmRzID0gXCJfX21hZ2ljX19maWxlX190b19faGVscF9fZWxlY3Ryb25fX2NvbXBpbGUuanNcIjtcblxuLy8gTkI6IFRoZXNlIGFyZSBkdXBlZCBpbiBpbml0aWFsaXplLXJlbmRlcmVyIHNvIHdlIGNhbiBzYXZlIHN0YXJ0dXAgdGltZSwgbWFrZVxuLy8gc3VyZSB0byBydW4gYm90aCFcbmNvbnN0IG1hZ2ljR2xvYmFsRm9yUm9vdENhY2hlRGlyID0gJ19fZWxlY3Ryb25fY29tcGlsZV9yb290X2NhY2hlX2Rpcic7XG5jb25zdCBtYWdpY0dsb2JhbEZvckFwcFJvb3REaXIgPSAnX19lbGVjdHJvbl9jb21waWxlX2FwcF9yb290X2Rpcic7XG5cbmNvbnN0IGQgPSByZXF1aXJlKCdkZWJ1Zy1lbGVjdHJvbicpKCdlbGVjdHJvbi1jb21waWxlOnByb3RvY29sLWhvb2snKTtcblxubGV0IHByb3RvY29sID0gbnVsbDtcblxuLyoqXG4gKiBBZGRzIG91ciBzY3JpcHQgaGVhZGVyIHRvIHRoZSB0b3Agb2YgYWxsIEhUTUwgZmlsZXNcbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmlnSHRtbERvY3VtZW50VG9Jbml0aWFsaXplRWxlY3Ryb25Db21waWxlKGRvYykge1xuICBsZXQgbGluZXMgPSBkb2Muc3BsaXQoXCJcXG5cIik7XG4gIGxldCByZXBsYWNlbWVudCA9IGA8aGVhZD48c2NyaXB0IHNyYz1cIiR7bWFnaWNXb3Jkc31cIj48L3NjcmlwdD5gO1xuICBsZXQgcmVwbGFjZWRIZWFkID0gZmFsc2U7XG5cbiAgZm9yIChsZXQgaT0wOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoIWxpbmVzW2ldLm1hdGNoKC88aGVhZD4vaSkpIGNvbnRpbnVlO1xuXG4gICAgbGluZXNbaV0gPSAobGluZXNbaV0pLnJlcGxhY2UoLzxoZWFkPi9pLCByZXBsYWNlbWVudCk7XG4gICAgcmVwbGFjZWRIZWFkID0gdHJ1ZTtcbiAgICBicmVhaztcbiAgfVxuXG4gIGlmICghcmVwbGFjZWRIZWFkKSB7XG4gICAgcmVwbGFjZW1lbnQgPSBgPGh0bWwkMT48aGVhZD48c2NyaXB0IHNyYz1cIiR7bWFnaWNXb3Jkc31cIj48L3NjcmlwdD48L2hlYWQ+YDtcbiAgICBmb3IgKGxldCBpPTA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFsaW5lc1tpXS5tYXRjaCgvPGh0bWwvaSkpIGNvbnRpbnVlO1xuXG4gICAgICBsaW5lc1tpXSA9IChsaW5lc1tpXSkucmVwbGFjZSgvPGh0bWwoW14+XSspPi9pLCByZXBsYWNlbWVudCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcbn1cblxuZnVuY3Rpb24gcmVxdWVzdEZpbGVKb2IoZmlsZVBhdGgsIGZpbmlzaCkge1xuICBmcy5yZWFkRmlsZShmaWxlUGF0aCwgKGVyciwgYnVmKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgaWYgKGVyci5lcnJubyA9PT0gMzQpIHtcbiAgICAgICAgZmluaXNoKC02KTsgLy8gbmV0OjpFUlJfRklMRV9OT1RfRk9VTkRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluaXNoKC0yKTsgLy8gbmV0OjpGQUlMRURcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmlzaCh7XG4gICAgICBkYXRhOiBidWYsXG4gICAgICBtaW1lVHlwZTogbWltZS5sb29rdXAoZmlsZVBhdGgpIHx8ICd0ZXh0L3BsYWluJ1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgcHJvdG9jb2wgaG9vayBvbiBmaWxlOiB0aGF0IGFsbG93cyB1cyB0byBpbnRlcmNlcHQgZmlsZXNcbiAqIGxvYWRlZCBieSBDaHJvbWl1bSBhbmQgcmV3cml0ZSB0aGVtLiBUaGlzIG1ldGhvZCBhbG9uZyB3aXRoXG4gKiB7QGxpbmsgcmVnaXN0ZXJSZXF1aXJlRXh0ZW5zaW9ufSBhcmUgdGhlIHRvcC1sZXZlbCBtZXRob2RzIHRoYXQgZWxlY3Ryb24tY29tcGlsZVxuICogYWN0dWFsbHkgdXNlcyB0byBpbnRlcmNlcHQgY29kZSB0aGF0IEVsZWN0cm9uIGxvYWRzLlxuICpcbiAqIEBwYXJhbSAge0NvbXBpbGVySG9zdH0gY29tcGlsZXJIb3N0ICBUaGUgY29tcGlsZXIgaG9zdCB0byB1c2UgZm9yIGNvbXBpbGF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVByb3RvY29sSG9vayhjb21waWxlckhvc3QpIHtcbiAgcHJvdG9jb2wgPSBwcm90b2NvbCB8fCByZXF1aXJlKCdlbGVjdHJvbicpLnByb3RvY29sO1xuXG4gIGdsb2JhbFttYWdpY0dsb2JhbEZvclJvb3RDYWNoZURpcl0gPSBjb21waWxlckhvc3Qucm9vdENhY2hlRGlyO1xuICBnbG9iYWxbbWFnaWNHbG9iYWxGb3JBcHBSb290RGlyXSA9IGNvbXBpbGVySG9zdC5hcHBSb290O1xuXG4gIGNvbnN0IGVsZWN0cm9uQ29tcGlsZVNldHVwQ29kZSA9IGBpZiAod2luZG93LnJlcXVpcmUpIHJlcXVpcmUoJ2VsZWN0cm9uLWNvbXBpbGUvbGliL2luaXRpYWxpemUtcmVuZGVyZXInKS5pbml0aWFsaXplUmVuZGVyZXJQcm9jZXNzKCR7Y29tcGlsZXJIb3N0LnJlYWRPbmx5TW9kZX0pO2A7XG5cbiAgcHJvdG9jb2wuaW50ZXJjZXB0QnVmZmVyUHJvdG9jb2woJ2ZpbGUnLCBhc3luYyBmdW5jdGlvbihyZXF1ZXN0LCBmaW5pc2gpIHtcbiAgICBsZXQgdXJpID0gdXJsLnBhcnNlKHJlcXVlc3QudXJsKTtcblxuICAgIGQoYEludGVyY2VwdGluZyB1cmwgJHtyZXF1ZXN0LnVybH1gKTtcbiAgICBpZiAocmVxdWVzdC51cmwuaW5kZXhPZihtYWdpY1dvcmRzKSA+IC0xKSB7XG4gICAgICBmaW5pc2goe1xuICAgICAgICBtaW1lVHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnLFxuICAgICAgICBkYXRhOiBuZXcgQnVmZmVyKGVsZWN0cm9uQ29tcGlsZVNldHVwQ29kZSwgJ3V0ZjgnKVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGEgcHJvdG9jb2wtcmVsYXRpdmUgVVJMIHRoYXQgaGFzIGdvbmUgcGVhci1zaGFwZWQgaW4gRWxlY3Ryb24sXG4gICAgLy8gbGV0J3MgcmV3cml0ZSBpdFxuICAgIGlmICh1cmkuaG9zdCAmJiB1cmkuaG9zdC5sZW5ndGggPiAxKSB7XG4gICAgICAvL2xldCBuZXdVcmkgPSByZXF1ZXN0LnVybC5yZXBsYWNlKC9eZmlsZTovLCBcImh0dHBzOlwiKTtcbiAgICAgIC8vIFRPRE86IEp1bXAgb2ZmIHRoaXMgYnJpZGdlIGxhdGVyXG4gICAgICBkKGBUT0RPOiBGb3VuZCBib2d1cyBwcm90b2NvbC1yZWxhdGl2ZSBVUkwsIGNhbid0IGZpeCBpdCB1cCEhYCk7XG4gICAgICBmaW5pc2goLTIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaWxlUGF0aCA9IGRlY29kZVVSSUNvbXBvbmVudCh1cmkucGF0aG5hbWUpO1xuXG4gICAgLy8gTkI6IHBhdGhuYW1lIGhhcyBhIGxlYWRpbmcgJy8nIG9uIFdpbjMyIGZvciBzb21lIHJlYXNvblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIC8vIE5COiBTcGVjaWFsLWNhc2UgZmlsZXMgY29taW5nIGZyb20gYXRvbS5hc2FyIG9yIG5vZGVfbW9kdWxlc1xuICAgIGlmIChmaWxlUGF0aC5tYXRjaCgvW1xcL1xcXFxdKGF0b218ZWxlY3Ryb24pLmFzYXIvKSB8fCBmaWxlUGF0aC5tYXRjaCgvW1xcL1xcXFxdKG5vZGVfbW9kdWxlc3xib3dlcl9jb21wb25lbnRzKS8pKSB7XG4gICAgICAvLyBOQnMgb24gTkJzOiBJZiB3ZSdyZSBsb2FkaW5nIGFuIEhUTUwgZmlsZSBmcm9tIG5vZGVfbW9kdWxlcywgd2Ugc3RpbGwgaGF2ZVxuICAgICAgLy8gdG8gZG8gdGhlIEhUTUwgZG9jdW1lbnQgcmlnZ2luZ1xuICAgICAgaWYgKGZpbGVQYXRoLm1hdGNoKC9cXC5odG1sPyQvaSkpIHtcbiAgICAgICAgbGV0IHJpZ2dlZENvbnRlbnRzID0gbnVsbDtcbiAgICAgICAgZnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4JywgKGVyciwgY29udGVudHMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLmVycm5vID09PSAzNCkge1xuICAgICAgICAgICAgICBmaW5pc2goLTYpOyAvLyBuZXQ6OkVSUl9GSUxFX05PVF9GT1VORFxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaW5pc2goLTIpOyAvLyBuZXQ6OkZBSUxFRFxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmlnZ2VkQ29udGVudHMgPSByaWdIdG1sRG9jdW1lbnRUb0luaXRpYWxpemVFbGVjdHJvbkNvbXBpbGUoY29udGVudHMpO1xuICAgICAgICAgIGZpbmlzaCh7IGRhdGE6IG5ldyBCdWZmZXIocmlnZ2VkQ29udGVudHMpLCBtaW1lVHlwZTogJ3RleHQvaHRtbCcgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3RGaWxlSm9iKGZpbGVQYXRoLCBmaW5pc2gpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgY29tcGlsZXJIb3N0LmNvbXBpbGUoZmlsZVBhdGgpO1xuXG4gICAgICBpZiAocmVzdWx0Lm1pbWVUeXBlID09PSAndGV4dC9odG1sJykge1xuICAgICAgICByZXN1bHQuY29kZSA9IHJpZ0h0bWxEb2N1bWVudFRvSW5pdGlhbGl6ZUVsZWN0cm9uQ29tcGlsZShyZXN1bHQuY29kZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQuYmluYXJ5RGF0YSB8fCByZXN1bHQuY29kZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICBmaW5pc2goeyBkYXRhOiByZXN1bHQuYmluYXJ5RGF0YSB8fCByZXN1bHQuY29kZSwgbWltZVR5cGU6IHJlc3VsdC5taW1lVHlwZSB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmluaXNoKHsgZGF0YTogbmV3IEJ1ZmZlcihyZXN1bHQuY29kZSksIG1pbWVUeXBlOiByZXN1bHQubWltZVR5cGUgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsZXQgZXJyID0gYEZhaWxlZCB0byBjb21waWxlICR7ZmlsZVBhdGh9OiAke2UubWVzc2FnZX1cXG4ke2Uuc3RhY2t9YDtcbiAgICAgIGQoZXJyKTtcblxuICAgICAgaWYgKGUuZXJybm8gPT09IDM0IC8qRU5PRU5UKi8pIHtcbiAgICAgICAgZmluaXNoKC02KTsgLy8gbmV0OjpFUlJfRklMRV9OT1RfRk9VTkRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaW5pc2goeyBtaW1lVHlwZTogJ3RleHQvcGxhaW4nLCBkYXRhOiBuZXcgQnVmZmVyKGVycikgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==