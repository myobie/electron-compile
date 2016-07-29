'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _digestForObject = require('./digest-for-object');

var _digestForObject2 = _interopRequireDefault(_digestForObject);

var _promise = require('./promise');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = require('debug-electron')('electron-compile:compile-cache');

/**
 * CompileCache manages getting and setting entries for a single compiler; each
 * in-use compiler will have an instance of this class, usually created via
 * {@link createFromCompiler}.
 *
 * You usually will not use this class directly, it is an implementation class
 * for {@link CompileHost}.
 */

var CompileCache = function () {
  /**
   * Creates an instance, usually used for testing only.
   *
   * @param  {string} cachePath  The root directory to use as a cache path
   *
   * @param  {FileChangedCache} fileChangeCache  A file-change cache that is
   *                                             optionally pre-loaded.
   */
  function CompileCache(cachePath, fileChangeCache) {
    (0, _classCallCheck3.default)(this, CompileCache);

    this.cachePath = cachePath;
    this.fileChangeCache = fileChangeCache;
  }

  /**
   * Creates a CompileCache from a class compatible with the CompilerBase
   * interface. This method uses the compiler name / version / options to
   * generate a unique directory name for cached results
   *
   * @param  {string} cachePath  The root path to use for the cache, a directory
   *                             representing the hash of the compiler parameters
   *                             will be created here.
   *
   * @param  {CompilerBase} compiler  The compiler to use for version / option
   *                                  information.
   *
   * @param  {FileChangedCache} fileChangeCache  A file-change cache that is
   *                                             optionally pre-loaded.
   *
   * @param  {boolean} readOnlyMode  Don't attempt to create the cache directory.
   *
   * @return {CompileCache}  A configured CompileCache instance.
   */


  (0, _createClass3.default)(CompileCache, [{
    key: 'get',


    /**
     * Returns a file's compiled contents from the cache.
     *
     * @param  {string} filePath  The path to the file. FileChangedCache will look
     *                            up the hash and use that as the key in the cache.
     *
     * @return {Promise<Object>}  An object with all kinds of information
     *
     * @property {Object} hashInfo  The hash information returned from getHashForPath
     * @property {string} code  The source code if the file was a text file
     * @property {Buffer} binaryData  The file if it was a binary file
     * @property {string} mimeType  The MIME type saved in the cache.
     * @property {string[]} dependentFiles  The dependent files returned from
     *                                      compiling the file, if any.
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(filePath) {
        var hashInfo, code, mimeType, binaryData, dependentFiles, cacheFile, result, info, buf, str;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                d('Fetching ' + filePath + ' from cache');
                _context.next = 3;
                return this.fileChangeCache.getHashForPath(_path2.default.resolve(filePath));

              case 3:
                hashInfo = _context.sent;
                code = null;
                mimeType = null;
                binaryData = null;
                dependentFiles = null;
                cacheFile = null;
                _context.prev = 9;

                cacheFile = _path2.default.join(this.getCachePath(), hashInfo.hash);
                result = null;

                if (!hashInfo.isFileBinary) {
                  _context.next = 31;
                  break;
                }

                d("File is binary, reading out info");
                _context.t0 = JSON;
                _context.next = 17;
                return _promise.pfs.readFile(cacheFile + '.info');

              case 17:
                _context.t1 = _context.sent;
                info = _context.t0.parse.call(_context.t0, _context.t1);

                mimeType = info.mimeType;
                dependentFiles = info.dependentFiles;

                binaryData = hashInfo.binaryData;

                if (binaryData) {
                  _context.next = 29;
                  break;
                }

                _context.next = 25;
                return _promise.pfs.readFile(cacheFile);

              case 25:
                binaryData = _context.sent;
                _context.next = 28;
                return _promise.pzlib.gunzip(binaryData);

              case 28:
                binaryData = _context.sent;

              case 29:
                _context.next = 41;
                break;

              case 31:
                _context.next = 33;
                return _promise.pfs.readFile(cacheFile);

              case 33:
                buf = _context.sent;
                _context.next = 36;
                return _promise.pzlib.gunzip(buf);

              case 36:
                str = _context.sent.toString('utf8');


                result = JSON.parse(str);
                code = result.code;
                mimeType = result.mimeType;
                dependentFiles = result.dependentFiles;

              case 41:
                _context.next = 46;
                break;

              case 43:
                _context.prev = 43;
                _context.t2 = _context['catch'](9);

                d('Failed to read cache for ' + filePath + ', looked in ' + cacheFile + ': ' + _context.t2.message);

              case 46:
                return _context.abrupt('return', { hashInfo: hashInfo, code: code, mimeType: mimeType, binaryData: binaryData, dependentFiles: dependentFiles });

              case 47:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[9, 43]]);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }()

    /**
     * Saves a compiled result to cache
     *
     * @param  {Object} hashInfo  The hash information returned from getHashForPath
     *
     * @param  {string / Buffer} codeOrBinaryData   The file's contents, either as
     *                                              a string or a Buffer.
     * @param  {string} mimeType  The MIME type returned by the compiler.
     *
     * @param  {string[]} dependentFiles  The list of dependent files returned by
     *                                    the compiler.
     * @return {Promise}  Completion.
     */

  }, {
    key: 'save',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(hashInfo, codeOrBinaryData, mimeType, dependentFiles) {
        var buf, target;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                buf = null;
                target = _path2.default.join(this.getCachePath(), hashInfo.hash);

                d('Saving to ' + target);

                if (!hashInfo.isFileBinary) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 6;
                return _promise.pzlib.gzip(codeOrBinaryData);

              case 6:
                buf = _context2.sent;
                _context2.next = 9;
                return _promise.pfs.writeFile(target + '.info', (0, _stringify2.default)({ mimeType: mimeType, dependentFiles: dependentFiles }), 'utf8');

              case 9:
                _context2.next = 14;
                break;

              case 11:
                _context2.next = 13;
                return _promise.pzlib.gzip(new Buffer((0, _stringify2.default)({ code: codeOrBinaryData, mimeType: mimeType, dependentFiles: dependentFiles })));

              case 13:
                buf = _context2.sent;

              case 14:
                _context2.next = 16;
                return _promise.pfs.writeFile(target, buf);

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return save;
    }()

    /**
     * Attempts to first get a key via {@link get}, then if it fails, call a method
     * to retrieve the contents, then save the result to cache.
     *
     * The fetcher parameter is expected to have the signature:
     *
     * Promise<Object> fetcher(filePath : string, hashInfo : Object);
     *
     * hashInfo is a value returned from getHashForPath
     * The return value of fetcher must be an Object with the properties:
     *
     * mimeType - the MIME type of the data to save
     * code (optional) - the source code as a string, if file is text
     * binaryData (optional) - the file contents as a Buffer, if file is binary
     * dependentFiles - the dependent files returned by the compiler.
     *
     * @param  {string} filePath  The path to the file. FileChangedCache will look
     *                            up the hash and use that as the key in the cache.
     *
     * @param  {Function} fetcher  A method which conforms to the description above.
     *
     * @return {Promise<Object>}  An Object which has the same fields as the
     *                            {@link get} method return result.
     */

  }, {
    key: 'getOrFetch',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filePath, fetcher) {
        var cacheResult, result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.get(filePath);

              case 2:
                cacheResult = _context3.sent;

                if (!(cacheResult.code || cacheResult.binaryData)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt('return', cacheResult);

              case 5:
                _context3.next = 7;
                return fetcher(filePath, cacheResult.hashInfo);

              case 7:
                _context3.t0 = _context3.sent;

                if (_context3.t0) {
                  _context3.next = 10;
                  break;
                }

                _context3.t0 = { hashInfo: cacheResult.hashInfo };

              case 10:
                result = _context3.t0;

                if (!(result.mimeType && !cacheResult.hashInfo.isInNodeModules)) {
                  _context3.next = 15;
                  break;
                }

                d('Cache miss: saving out info for ' + filePath);
                _context3.next = 15;
                return this.save(cacheResult.hashInfo, result.code || result.binaryData, result.mimeType, result.dependentFiles);

              case 15:

                result.hashInfo = cacheResult.hashInfo;
                return _context3.abrupt('return', result);

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getOrFetch(_x6, _x7) {
        return _ref3.apply(this, arguments);
      }

      return getOrFetch;
    }()
  }, {
    key: 'getSync',
    value: function getSync(filePath) {
      d('Fetching ' + filePath + ' from cache');
      var hashInfo = this.fileChangeCache.getHashForPathSync(_path2.default.resolve(filePath));

      var code = null;
      var mimeType = null;
      var binaryData = null;
      var dependentFiles = null;

      try {
        var cacheFile = _path2.default.join(this.getCachePath(), hashInfo.hash);

        var result = null;
        if (hashInfo.isFileBinary) {
          d("File is binary, reading out info");
          var info = JSON.parse(_fs2.default.readFileSync(cacheFile + '.info'));
          mimeType = info.mimeType;
          dependentFiles = info.dependentFiles;

          binaryData = hashInfo.binaryData;
          if (!binaryData) {
            binaryData = _fs2.default.readFileSync(cacheFile);
            binaryData = _zlib2.default.gunzipSync(binaryData);
          }
        } else {
          var buf = _fs2.default.readFileSync(cacheFile);
          var str = _zlib2.default.gunzipSync(buf).toString('utf8');

          result = JSON.parse(str);
          code = result.code;
          mimeType = result.mimeType;
          dependentFiles = result.dependentFiles;
        }
      } catch (e) {
        d('Failed to read cache for ' + filePath);
      }

      return { hashInfo: hashInfo, code: code, mimeType: mimeType, binaryData: binaryData, dependentFiles: dependentFiles };
    }
  }, {
    key: 'saveSync',
    value: function saveSync(hashInfo, codeOrBinaryData, mimeType, dependentFiles) {
      var buf = null;
      var target = _path2.default.join(this.getCachePath(), hashInfo.hash);
      d('Saving to ' + target);

      if (hashInfo.isFileBinary) {
        buf = _zlib2.default.gzipSync(codeOrBinaryData);
        _fs2.default.writeFileSync(target + '.info', (0, _stringify2.default)({ mimeType: mimeType, dependentFiles: dependentFiles }), 'utf8');
      } else {
        buf = _zlib2.default.gzipSync(new Buffer((0, _stringify2.default)({ code: codeOrBinaryData, mimeType: mimeType, dependentFiles: dependentFiles })));
      }

      _fs2.default.writeFileSync(target, buf);
    }
  }, {
    key: 'getOrFetchSync',
    value: function getOrFetchSync(filePath, fetcher) {
      var cacheResult = this.getSync(filePath);
      if (cacheResult.code || cacheResult.binaryData) return cacheResult;

      var result = fetcher(filePath, cacheResult.hashInfo) || { hashInfo: cacheResult.hashInfo };

      if (result.mimeType && !cacheResult.hashInfo.isInNodeModules) {
        d('Cache miss: saving out info for ' + filePath);
        this.saveSync(cacheResult.hashInfo, result.code || result.binaryData, result.mimeType, result.dependentFiles);
      }

      result.hashInfo = cacheResult.hashInfo;
      return result;
    }

    /**
     * @private
     */

  }, {
    key: 'getCachePath',
    value: function getCachePath() {
      // NB: This is an evil hack so that createFromCompiler can stomp it
      // at will
      return this.cachePath;
    }

    /**
     * Returns whether a file should not be compiled. Note that this doesn't
     * necessarily mean it won't end up in the cache, only that its contents are
     * saved verbatim instead of trying to find an appropriate compiler.
     *
     * @param  {Object} hashInfo  The hash information returned from getHashForPath
     *
     * @return {boolean}  True if a file should be ignored
     */

  }], [{
    key: 'createFromCompiler',
    value: function createFromCompiler(cachePath, compiler, fileChangeCache) {
      var readOnlyMode = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      var newCachePath = null;
      var getCachePath = function getCachePath() {
        if (newCachePath) return newCachePath;

        var digestObj = {
          name: compiler.name || (0, _getPrototypeOf2.default)(compiler).constructor.name,
          version: compiler.getCompilerVersion(),
          options: compiler.compilerOptions
        };

        newCachePath = _path2.default.join(cachePath, (0, _digestForObject2.default)(digestObj));

        d('Path for ' + digestObj.name + ': ' + newCachePath);
        d('Set up with parameters: ' + (0, _stringify2.default)(digestObj));

        if (!readOnlyMode) _mkdirp2.default.sync(newCachePath);
        return newCachePath;
      };

      var ret = new CompileCache('', fileChangeCache);
      ret.getCachePath = getCachePath;

      return ret;
    }
  }, {
    key: 'shouldPassthrough',
    value: function shouldPassthrough(hashInfo) {
      return hashInfo.isMinified || hashInfo.isInNodeModules || hashInfo.hasSourceMap || hashInfo.isFileBinary;
    }
  }]);
  return CompileCache;
}();

exports.default = CompileCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlLWNhY2hlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU0sSUFBSSxRQUFRLGdCQUFSLEVBQTBCLGdDQUExQixDQUFWOztBQUVBOzs7Ozs7Ozs7SUFRcUIsWTtBQUNuQjs7Ozs7Ozs7QUFRQSx3QkFBWSxTQUFaLEVBQXVCLGVBQXZCLEVBQXdDO0FBQUE7O0FBQ3RDLFNBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFNBQUssZUFBTCxHQUF1QixlQUF2QjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkNBOzs7Ozs7Ozs7Ozs7Ozs7OzZGQWVVLFE7Ozs7OztBQUNSLGdDQUFjLFFBQWQ7O3VCQUNxQixLQUFLLGVBQUwsQ0FBcUIsY0FBckIsQ0FBb0MsZUFBSyxPQUFMLENBQWEsUUFBYixDQUFwQyxDOzs7QUFBakIsd0I7QUFFQSxvQixHQUFPLEk7QUFDUCx3QixHQUFXLEk7QUFDWCwwQixHQUFhLEk7QUFDYiw4QixHQUFpQixJO0FBRWpCLHlCLEdBQVksSTs7O0FBRWQsNEJBQVksZUFBSyxJQUFMLENBQVUsS0FBSyxZQUFMLEVBQVYsRUFBK0IsU0FBUyxJQUF4QyxDQUFaO0FBQ0ksc0IsR0FBUyxJOztxQkFFVCxTQUFTLFk7Ozs7O0FBQ1gsa0JBQUUsa0NBQUY7OEJBQ1csSTs7dUJBQWlCLGFBQUksUUFBSixDQUFhLFlBQVksT0FBekIsQzs7OztBQUF4QixvQixlQUFZLEs7O0FBQ2hCLDJCQUFXLEtBQUssUUFBaEI7QUFDQSxpQ0FBaUIsS0FBSyxjQUF0Qjs7QUFFQSw2QkFBYSxTQUFTLFVBQXRCOztvQkFDSyxVOzs7Ozs7dUJBQ2dCLGFBQUksUUFBSixDQUFhLFNBQWIsQzs7O0FBQW5CLDBCOzt1QkFDbUIsZUFBTSxNQUFOLENBQWEsVUFBYixDOzs7QUFB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LFNBQWYsQ0FBN0I7O0FBRUEsWUFBSSxDQUFDLFlBQUwsRUFBbUIsaUJBQU8sSUFBUCxDQUFZLFlBQVo7QUFDbkIsZUFBTyxZQUFQO0FBQ0QsT0FoQkQ7O0FBa0JBLFVBQUksTUFBTSxJQUFJLFlBQUosQ0FBaUIsRUFBakIsRUFBcUIsZUFBckIsQ0FBVjtBQUNBLFVBQUksWUFBSixHQUFtQixZQUFuQjs7QUFFQSxhQUFPLEdBQVA7QUFDRDs7O3NDQXdOd0IsUSxFQUFVO0FBQ2pDLGFBQU8sU0FBUyxVQUFULElBQXVCLFNBQVMsZUFBaEMsSUFBbUQsU0FBUyxZQUE1RCxJQUE0RSxTQUFTLFlBQTVGO0FBQ0Q7Ozs7O2tCQW5Sa0IsWSIsImZpbGUiOiJjb21waWxlLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQgY3JlYXRlRGlnZXN0Rm9yT2JqZWN0IGZyb20gJy4vZGlnZXN0LWZvci1vYmplY3QnO1xuaW1wb3J0IHtwZnMsIHB6bGlifSBmcm9tICcuL3Byb21pc2UnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuXG5jb25zdCBkID0gcmVxdWlyZSgnZGVidWctZWxlY3Ryb24nKSgnZWxlY3Ryb24tY29tcGlsZTpjb21waWxlLWNhY2hlJyk7XG5cbi8qKlxuICogQ29tcGlsZUNhY2hlIG1hbmFnZXMgZ2V0dGluZyBhbmQgc2V0dGluZyBlbnRyaWVzIGZvciBhIHNpbmdsZSBjb21waWxlcjsgZWFjaFxuICogaW4tdXNlIGNvbXBpbGVyIHdpbGwgaGF2ZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzLCB1c3VhbGx5IGNyZWF0ZWQgdmlhXG4gKiB7QGxpbmsgY3JlYXRlRnJvbUNvbXBpbGVyfS5cbiAqXG4gKiBZb3UgdXN1YWxseSB3aWxsIG5vdCB1c2UgdGhpcyBjbGFzcyBkaXJlY3RseSwgaXQgaXMgYW4gaW1wbGVtZW50YXRpb24gY2xhc3NcbiAqIGZvciB7QGxpbmsgQ29tcGlsZUhvc3R9LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlQ2FjaGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSwgdXN1YWxseSB1c2VkIGZvciB0ZXN0aW5nIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY2FjaGVQYXRoICBUaGUgcm9vdCBkaXJlY3RvcnkgdG8gdXNlIGFzIGEgY2FjaGUgcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gIHtGaWxlQ2hhbmdlZENhY2hlfSBmaWxlQ2hhbmdlQ2FjaGUgIEEgZmlsZS1jaGFuZ2UgY2FjaGUgdGhhdCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsbHkgcHJlLWxvYWRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNhY2hlUGF0aCwgZmlsZUNoYW5nZUNhY2hlKSB7XG4gICAgdGhpcy5jYWNoZVBhdGggPSBjYWNoZVBhdGg7XG4gICAgdGhpcy5maWxlQ2hhbmdlQ2FjaGUgPSBmaWxlQ2hhbmdlQ2FjaGU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIENvbXBpbGVDYWNoZSBmcm9tIGEgY2xhc3MgY29tcGF0aWJsZSB3aXRoIHRoZSBDb21waWxlckJhc2VcbiAgICogaW50ZXJmYWNlLiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBjb21waWxlciBuYW1lIC8gdmVyc2lvbiAvIG9wdGlvbnMgdG9cbiAgICogZ2VuZXJhdGUgYSB1bmlxdWUgZGlyZWN0b3J5IG5hbWUgZm9yIGNhY2hlZCByZXN1bHRzXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY2FjaGVQYXRoICBUaGUgcm9vdCBwYXRoIHRvIHVzZSBmb3IgdGhlIGNhY2hlLCBhIGRpcmVjdG9yeVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwcmVzZW50aW5nIHRoZSBoYXNoIG9mIHRoZSBjb21waWxlciBwYXJhbWV0ZXJzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWxsIGJlIGNyZWF0ZWQgaGVyZS5cbiAgICpcbiAgICogQHBhcmFtICB7Q29tcGlsZXJCYXNlfSBjb21waWxlciAgVGhlIGNvbXBpbGVyIHRvIHVzZSBmb3IgdmVyc2lvbiAvIG9wdGlvblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7RmlsZUNoYW5nZWRDYWNoZX0gZmlsZUNoYW5nZUNhY2hlICBBIGZpbGUtY2hhbmdlIGNhY2hlIHRoYXQgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25hbGx5IHByZS1sb2FkZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IHJlYWRPbmx5TW9kZSAgRG9uJ3QgYXR0ZW1wdCB0byBjcmVhdGUgdGhlIGNhY2hlIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHJldHVybiB7Q29tcGlsZUNhY2hlfSAgQSBjb25maWd1cmVkIENvbXBpbGVDYWNoZSBpbnN0YW5jZS5cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVGcm9tQ29tcGlsZXIoY2FjaGVQYXRoLCBjb21waWxlciwgZmlsZUNoYW5nZUNhY2hlLCByZWFkT25seU1vZGU9ZmFsc2UpIHtcbiAgICBsZXQgbmV3Q2FjaGVQYXRoID0gbnVsbDtcbiAgICBsZXQgZ2V0Q2FjaGVQYXRoID0gKCkgPT4ge1xuICAgICAgaWYgKG5ld0NhY2hlUGF0aCkgcmV0dXJuIG5ld0NhY2hlUGF0aDtcblxuICAgICAgY29uc3QgZGlnZXN0T2JqID0ge1xuICAgICAgICBuYW1lOiBjb21waWxlci5uYW1lIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb21waWxlcikuY29uc3RydWN0b3IubmFtZSxcbiAgICAgICAgdmVyc2lvbjogY29tcGlsZXIuZ2V0Q29tcGlsZXJWZXJzaW9uKCksXG4gICAgICAgIG9wdGlvbnM6IGNvbXBpbGVyLmNvbXBpbGVyT3B0aW9uc1xuICAgICAgfTtcblxuICAgICAgbmV3Q2FjaGVQYXRoID0gcGF0aC5qb2luKGNhY2hlUGF0aCwgY3JlYXRlRGlnZXN0Rm9yT2JqZWN0KGRpZ2VzdE9iaikpO1xuXG4gICAgICBkKGBQYXRoIGZvciAke2RpZ2VzdE9iai5uYW1lfTogJHtuZXdDYWNoZVBhdGh9YCk7XG4gICAgICBkKGBTZXQgdXAgd2l0aCBwYXJhbWV0ZXJzOiAke0pTT04uc3RyaW5naWZ5KGRpZ2VzdE9iail9YCk7XG5cbiAgICAgIGlmICghcmVhZE9ubHlNb2RlKSBta2RpcnAuc3luYyhuZXdDYWNoZVBhdGgpO1xuICAgICAgcmV0dXJuIG5ld0NhY2hlUGF0aDtcbiAgICB9O1xuXG4gICAgbGV0IHJldCA9IG5ldyBDb21waWxlQ2FjaGUoJycsIGZpbGVDaGFuZ2VDYWNoZSk7XG4gICAgcmV0LmdldENhY2hlUGF0aCA9IGdldENhY2hlUGF0aDtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGZpbGUncyBjb21waWxlZCBjb250ZW50cyBmcm9tIHRoZSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBmaWxlUGF0aCAgVGhlIHBhdGggdG8gdGhlIGZpbGUuIEZpbGVDaGFuZ2VkQ2FjaGUgd2lsbCBsb29rXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwIHRoZSBoYXNoIGFuZCB1c2UgdGhhdCBhcyB0aGUga2V5IGluIHRoZSBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSAgQW4gb2JqZWN0IHdpdGggYWxsIGtpbmRzIG9mIGluZm9ybWF0aW9uXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoYXNoSW5mbyAgVGhlIGhhc2ggaW5mb3JtYXRpb24gcmV0dXJuZWQgZnJvbSBnZXRIYXNoRm9yUGF0aFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29kZSAgVGhlIHNvdXJjZSBjb2RlIGlmIHRoZSBmaWxlIHdhcyBhIHRleHQgZmlsZVxuICAgKiBAcHJvcGVydHkge0J1ZmZlcn0gYmluYXJ5RGF0YSAgVGhlIGZpbGUgaWYgaXQgd2FzIGEgYmluYXJ5IGZpbGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1pbWVUeXBlICBUaGUgTUlNRSB0eXBlIHNhdmVkIGluIHRoZSBjYWNoZS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmdbXX0gZGVwZW5kZW50RmlsZXMgIFRoZSBkZXBlbmRlbnQgZmlsZXMgcmV0dXJuZWQgZnJvbVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsaW5nIHRoZSBmaWxlLCBpZiBhbnkuXG4gICAqL1xuICBhc3luYyBnZXQoZmlsZVBhdGgpIHtcbiAgICBkKGBGZXRjaGluZyAke2ZpbGVQYXRofSBmcm9tIGNhY2hlYCk7XG4gICAgbGV0IGhhc2hJbmZvID0gYXdhaXQgdGhpcy5maWxlQ2hhbmdlQ2FjaGUuZ2V0SGFzaEZvclBhdGgocGF0aC5yZXNvbHZlKGZpbGVQYXRoKSk7XG5cbiAgICBsZXQgY29kZSA9IG51bGw7XG4gICAgbGV0IG1pbWVUeXBlID0gbnVsbDtcbiAgICBsZXQgYmluYXJ5RGF0YSA9IG51bGw7XG4gICAgbGV0IGRlcGVuZGVudEZpbGVzID0gbnVsbDtcblxuICAgIGxldCBjYWNoZUZpbGUgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjYWNoZUZpbGUgPSBwYXRoLmpvaW4odGhpcy5nZXRDYWNoZVBhdGgoKSwgaGFzaEluZm8uaGFzaCk7XG4gICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgaWYgKGhhc2hJbmZvLmlzRmlsZUJpbmFyeSkge1xuICAgICAgICBkKFwiRmlsZSBpcyBiaW5hcnksIHJlYWRpbmcgb3V0IGluZm9cIik7XG4gICAgICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShhd2FpdCBwZnMucmVhZEZpbGUoY2FjaGVGaWxlICsgJy5pbmZvJykpO1xuICAgICAgICBtaW1lVHlwZSA9IGluZm8ubWltZVR5cGU7XG4gICAgICAgIGRlcGVuZGVudEZpbGVzID0gaW5mby5kZXBlbmRlbnRGaWxlcztcblxuICAgICAgICBiaW5hcnlEYXRhID0gaGFzaEluZm8uYmluYXJ5RGF0YTtcbiAgICAgICAgaWYgKCFiaW5hcnlEYXRhKSB7XG4gICAgICAgICAgYmluYXJ5RGF0YSA9IGF3YWl0IHBmcy5yZWFkRmlsZShjYWNoZUZpbGUpO1xuICAgICAgICAgIGJpbmFyeURhdGEgPSBhd2FpdCBwemxpYi5ndW56aXAoYmluYXJ5RGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBidWYgPSBhd2FpdCBwZnMucmVhZEZpbGUoY2FjaGVGaWxlKTtcbiAgICAgICAgbGV0IHN0ciA9IChhd2FpdCBwemxpYi5ndW56aXAoYnVmKSkudG9TdHJpbmcoJ3V0ZjgnKTtcblxuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIGNvZGUgPSByZXN1bHQuY29kZTtcbiAgICAgICAgbWltZVR5cGUgPSByZXN1bHQubWltZVR5cGU7XG4gICAgICAgIGRlcGVuZGVudEZpbGVzID0gcmVzdWx0LmRlcGVuZGVudEZpbGVzO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGQoYEZhaWxlZCB0byByZWFkIGNhY2hlIGZvciAke2ZpbGVQYXRofSwgbG9va2VkIGluICR7Y2FjaGVGaWxlfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgaGFzaEluZm8sIGNvZGUsIG1pbWVUeXBlLCBiaW5hcnlEYXRhLCBkZXBlbmRlbnRGaWxlcyB9O1xuICB9XG5cblxuICAvKipcbiAgICogU2F2ZXMgYSBjb21waWxlZCByZXN1bHQgdG8gY2FjaGVcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBoYXNoSW5mbyAgVGhlIGhhc2ggaW5mb3JtYXRpb24gcmV0dXJuZWQgZnJvbSBnZXRIYXNoRm9yUGF0aFxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmcgLyBCdWZmZXJ9IGNvZGVPckJpbmFyeURhdGEgICBUaGUgZmlsZSdzIGNvbnRlbnRzLCBlaXRoZXIgYXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBzdHJpbmcgb3IgYSBCdWZmZXIuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbWltZVR5cGUgIFRoZSBNSU1FIHR5cGUgcmV0dXJuZWQgYnkgdGhlIGNvbXBpbGVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmdbXX0gZGVwZW5kZW50RmlsZXMgIFRoZSBsaXN0IG9mIGRlcGVuZGVudCBmaWxlcyByZXR1cm5lZCBieVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjb21waWxlci5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gIENvbXBsZXRpb24uXG4gICAqL1xuICBhc3luYyBzYXZlKGhhc2hJbmZvLCBjb2RlT3JCaW5hcnlEYXRhLCBtaW1lVHlwZSwgZGVwZW5kZW50RmlsZXMpIHtcbiAgICBsZXQgYnVmID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0ID0gcGF0aC5qb2luKHRoaXMuZ2V0Q2FjaGVQYXRoKCksIGhhc2hJbmZvLmhhc2gpO1xuICAgIGQoYFNhdmluZyB0byAke3RhcmdldH1gKTtcblxuICAgIGlmIChoYXNoSW5mby5pc0ZpbGVCaW5hcnkpIHtcbiAgICAgIGJ1ZiA9IGF3YWl0IHB6bGliLmd6aXAoY29kZU9yQmluYXJ5RGF0YSk7XG4gICAgICBhd2FpdCBwZnMud3JpdGVGaWxlKHRhcmdldCArICcuaW5mbycsIEpTT04uc3RyaW5naWZ5KHttaW1lVHlwZSwgZGVwZW5kZW50RmlsZXN9KSwgJ3V0ZjgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmID0gYXdhaXQgcHpsaWIuZ3ppcChuZXcgQnVmZmVyKEpTT04uc3RyaW5naWZ5KHtjb2RlOiBjb2RlT3JCaW5hcnlEYXRhLCBtaW1lVHlwZSwgZGVwZW5kZW50RmlsZXN9KSkpO1xuICAgIH1cblxuICAgIGF3YWl0IHBmcy53cml0ZUZpbGUodGFyZ2V0LCBidWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGZpcnN0IGdldCBhIGtleSB2aWEge0BsaW5rIGdldH0sIHRoZW4gaWYgaXQgZmFpbHMsIGNhbGwgYSBtZXRob2RcbiAgICogdG8gcmV0cmlldmUgdGhlIGNvbnRlbnRzLCB0aGVuIHNhdmUgdGhlIHJlc3VsdCB0byBjYWNoZS5cbiAgICpcbiAgICogVGhlIGZldGNoZXIgcGFyYW1ldGVyIGlzIGV4cGVjdGVkIHRvIGhhdmUgdGhlIHNpZ25hdHVyZTpcbiAgICpcbiAgICogUHJvbWlzZTxPYmplY3Q+IGZldGNoZXIoZmlsZVBhdGggOiBzdHJpbmcsIGhhc2hJbmZvIDogT2JqZWN0KTtcbiAgICpcbiAgICogaGFzaEluZm8gaXMgYSB2YWx1ZSByZXR1cm5lZCBmcm9tIGdldEhhc2hGb3JQYXRoXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgb2YgZmV0Y2hlciBtdXN0IGJlIGFuIE9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiBtaW1lVHlwZSAtIHRoZSBNSU1FIHR5cGUgb2YgdGhlIGRhdGEgdG8gc2F2ZVxuICAgKiBjb2RlIChvcHRpb25hbCkgLSB0aGUgc291cmNlIGNvZGUgYXMgYSBzdHJpbmcsIGlmIGZpbGUgaXMgdGV4dFxuICAgKiBiaW5hcnlEYXRhIChvcHRpb25hbCkgLSB0aGUgZmlsZSBjb250ZW50cyBhcyBhIEJ1ZmZlciwgaWYgZmlsZSBpcyBiaW5hcnlcbiAgICogZGVwZW5kZW50RmlsZXMgLSB0aGUgZGVwZW5kZW50IGZpbGVzIHJldHVybmVkIGJ5IHRoZSBjb21waWxlci5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBmaWxlUGF0aCAgVGhlIHBhdGggdG8gdGhlIGZpbGUuIEZpbGVDaGFuZ2VkQ2FjaGUgd2lsbCBsb29rXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwIHRoZSBoYXNoIGFuZCB1c2UgdGhhdCBhcyB0aGUga2V5IGluIHRoZSBjYWNoZS5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZldGNoZXIgIEEgbWV0aG9kIHdoaWNoIGNvbmZvcm1zIHRvIHRoZSBkZXNjcmlwdGlvbiBhYm92ZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxPYmplY3Q+fSAgQW4gT2JqZWN0IHdoaWNoIGhhcyB0aGUgc2FtZSBmaWVsZHMgYXMgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtAbGluayBnZXR9IG1ldGhvZCByZXR1cm4gcmVzdWx0LlxuICAgKi9cbiAgYXN5bmMgZ2V0T3JGZXRjaChmaWxlUGF0aCwgZmV0Y2hlcikge1xuICAgIGxldCBjYWNoZVJlc3VsdCA9IGF3YWl0IHRoaXMuZ2V0KGZpbGVQYXRoKTtcbiAgICBpZiAoY2FjaGVSZXN1bHQuY29kZSB8fCBjYWNoZVJlc3VsdC5iaW5hcnlEYXRhKSByZXR1cm4gY2FjaGVSZXN1bHQ7XG5cbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2hlcihmaWxlUGF0aCwgY2FjaGVSZXN1bHQuaGFzaEluZm8pIHx8IHsgaGFzaEluZm86IGNhY2hlUmVzdWx0Lmhhc2hJbmZvIH07XG5cbiAgICBpZiAocmVzdWx0Lm1pbWVUeXBlICYmICFjYWNoZVJlc3VsdC5oYXNoSW5mby5pc0luTm9kZU1vZHVsZXMpIHtcbiAgICAgIGQoYENhY2hlIG1pc3M6IHNhdmluZyBvdXQgaW5mbyBmb3IgJHtmaWxlUGF0aH1gKTtcbiAgICAgIGF3YWl0IHRoaXMuc2F2ZShjYWNoZVJlc3VsdC5oYXNoSW5mbywgcmVzdWx0LmNvZGUgfHwgcmVzdWx0LmJpbmFyeURhdGEsIHJlc3VsdC5taW1lVHlwZSwgcmVzdWx0LmRlcGVuZGVudEZpbGVzKTtcbiAgICB9XG5cbiAgICByZXN1bHQuaGFzaEluZm8gPSBjYWNoZVJlc3VsdC5oYXNoSW5mbztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0U3luYyhmaWxlUGF0aCkge1xuICAgIGQoYEZldGNoaW5nICR7ZmlsZVBhdGh9IGZyb20gY2FjaGVgKTtcbiAgICBsZXQgaGFzaEluZm8gPSB0aGlzLmZpbGVDaGFuZ2VDYWNoZS5nZXRIYXNoRm9yUGF0aFN5bmMocGF0aC5yZXNvbHZlKGZpbGVQYXRoKSk7XG5cbiAgICBsZXQgY29kZSA9IG51bGw7XG4gICAgbGV0IG1pbWVUeXBlID0gbnVsbDtcbiAgICBsZXQgYmluYXJ5RGF0YSA9IG51bGw7XG4gICAgbGV0IGRlcGVuZGVudEZpbGVzID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICBsZXQgY2FjaGVGaWxlID0gcGF0aC5qb2luKHRoaXMuZ2V0Q2FjaGVQYXRoKCksIGhhc2hJbmZvLmhhc2gpO1xuXG4gICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICAgIGlmIChoYXNoSW5mby5pc0ZpbGVCaW5hcnkpIHtcbiAgICAgICAgZChcIkZpbGUgaXMgYmluYXJ5LCByZWFkaW5nIG91dCBpbmZvXCIpO1xuICAgICAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGNhY2hlRmlsZSArICcuaW5mbycpKTtcbiAgICAgICAgbWltZVR5cGUgPSBpbmZvLm1pbWVUeXBlO1xuICAgICAgICBkZXBlbmRlbnRGaWxlcyA9IGluZm8uZGVwZW5kZW50RmlsZXM7XG5cbiAgICAgICAgYmluYXJ5RGF0YSA9IGhhc2hJbmZvLmJpbmFyeURhdGE7XG4gICAgICAgIGlmICghYmluYXJ5RGF0YSkge1xuICAgICAgICAgIGJpbmFyeURhdGEgPSBmcy5yZWFkRmlsZVN5bmMoY2FjaGVGaWxlKTtcbiAgICAgICAgICBiaW5hcnlEYXRhID0gemxpYi5ndW56aXBTeW5jKGJpbmFyeURhdGEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYnVmID0gZnMucmVhZEZpbGVTeW5jKGNhY2hlRmlsZSk7XG4gICAgICAgIGxldCBzdHIgPSAoemxpYi5ndW56aXBTeW5jKGJ1ZikpLnRvU3RyaW5nKCd1dGY4Jyk7XG5cbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShzdHIpO1xuICAgICAgICBjb2RlID0gcmVzdWx0LmNvZGU7XG4gICAgICAgIG1pbWVUeXBlID0gcmVzdWx0Lm1pbWVUeXBlO1xuICAgICAgICBkZXBlbmRlbnRGaWxlcyA9IHJlc3VsdC5kZXBlbmRlbnRGaWxlcztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkKGBGYWlsZWQgdG8gcmVhZCBjYWNoZSBmb3IgJHtmaWxlUGF0aH1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBoYXNoSW5mbywgY29kZSwgbWltZVR5cGUsIGJpbmFyeURhdGEsIGRlcGVuZGVudEZpbGVzIH07XG4gIH1cblxuICBzYXZlU3luYyhoYXNoSW5mbywgY29kZU9yQmluYXJ5RGF0YSwgbWltZVR5cGUsIGRlcGVuZGVudEZpbGVzKSB7XG4gICAgbGV0IGJ1ZiA9IG51bGw7XG4gICAgbGV0IHRhcmdldCA9IHBhdGguam9pbih0aGlzLmdldENhY2hlUGF0aCgpLCBoYXNoSW5mby5oYXNoKTtcbiAgICBkKGBTYXZpbmcgdG8gJHt0YXJnZXR9YCk7XG5cbiAgICBpZiAoaGFzaEluZm8uaXNGaWxlQmluYXJ5KSB7XG4gICAgICBidWYgPSB6bGliLmd6aXBTeW5jKGNvZGVPckJpbmFyeURhdGEpO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJnZXQgKyAnLmluZm8nLCBKU09OLnN0cmluZ2lmeSh7bWltZVR5cGUsIGRlcGVuZGVudEZpbGVzfSksICd1dGY4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZiA9IHpsaWIuZ3ppcFN5bmMobmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeSh7Y29kZTogY29kZU9yQmluYXJ5RGF0YSwgbWltZVR5cGUsIGRlcGVuZGVudEZpbGVzfSkpKTtcbiAgICB9XG5cbiAgICBmcy53cml0ZUZpbGVTeW5jKHRhcmdldCwgYnVmKTtcbiAgfVxuXG4gIGdldE9yRmV0Y2hTeW5jKGZpbGVQYXRoLCBmZXRjaGVyKSB7XG4gICAgbGV0IGNhY2hlUmVzdWx0ID0gdGhpcy5nZXRTeW5jKGZpbGVQYXRoKTtcbiAgICBpZiAoY2FjaGVSZXN1bHQuY29kZSB8fCBjYWNoZVJlc3VsdC5iaW5hcnlEYXRhKSByZXR1cm4gY2FjaGVSZXN1bHQ7XG5cbiAgICBsZXQgcmVzdWx0ID0gZmV0Y2hlcihmaWxlUGF0aCwgY2FjaGVSZXN1bHQuaGFzaEluZm8pIHx8IHsgaGFzaEluZm86IGNhY2hlUmVzdWx0Lmhhc2hJbmZvIH07XG5cbiAgICBpZiAocmVzdWx0Lm1pbWVUeXBlICYmICFjYWNoZVJlc3VsdC5oYXNoSW5mby5pc0luTm9kZU1vZHVsZXMpIHtcbiAgICAgIGQoYENhY2hlIG1pc3M6IHNhdmluZyBvdXQgaW5mbyBmb3IgJHtmaWxlUGF0aH1gKTtcbiAgICAgIHRoaXMuc2F2ZVN5bmMoY2FjaGVSZXN1bHQuaGFzaEluZm8sIHJlc3VsdC5jb2RlIHx8IHJlc3VsdC5iaW5hcnlEYXRhLCByZXN1bHQubWltZVR5cGUsIHJlc3VsdC5kZXBlbmRlbnRGaWxlcyk7XG4gICAgfVxuXG4gICAgcmVzdWx0Lmhhc2hJbmZvID0gY2FjaGVSZXN1bHQuaGFzaEluZm87XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRDYWNoZVBhdGgoKSB7XG4gICAgLy8gTkI6IFRoaXMgaXMgYW4gZXZpbCBoYWNrIHNvIHRoYXQgY3JlYXRlRnJvbUNvbXBpbGVyIGNhbiBzdG9tcCBpdFxuICAgIC8vIGF0IHdpbGxcbiAgICByZXR1cm4gdGhpcy5jYWNoZVBhdGg7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgYSBmaWxlIHNob3VsZCBub3QgYmUgY29tcGlsZWQuIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3RcbiAgICogbmVjZXNzYXJpbHkgbWVhbiBpdCB3b24ndCBlbmQgdXAgaW4gdGhlIGNhY2hlLCBvbmx5IHRoYXQgaXRzIGNvbnRlbnRzIGFyZVxuICAgKiBzYXZlZCB2ZXJiYXRpbSBpbnN0ZWFkIG9mIHRyeWluZyB0byBmaW5kIGFuIGFwcHJvcHJpYXRlIGNvbXBpbGVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IGhhc2hJbmZvICBUaGUgaGFzaCBpbmZvcm1hdGlvbiByZXR1cm5lZCBmcm9tIGdldEhhc2hGb3JQYXRoXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICBUcnVlIGlmIGEgZmlsZSBzaG91bGQgYmUgaWdub3JlZFxuICAgKi9cbiAgc3RhdGljIHNob3VsZFBhc3N0aHJvdWdoKGhhc2hJbmZvKSB7XG4gICAgcmV0dXJuIGhhc2hJbmZvLmlzTWluaWZpZWQgfHwgaGFzaEluZm8uaXNJbk5vZGVNb2R1bGVzIHx8IGhhc2hJbmZvLmhhc1NvdXJjZU1hcCB8fCBoYXNoSW5mby5pc0ZpbGVCaW5hcnk7XG4gIH1cbn1cbiJdfQ==