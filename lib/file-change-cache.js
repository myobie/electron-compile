'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _promise = require('./promise');

var _sanitizePaths = require('./sanitize-paths');

var _sanitizePaths2 = _interopRequireDefault(_sanitizePaths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = require('debug-electron')('electron-compile:file-change-cache');

/**
 * This class caches information about files and determines whether they have
 * changed contents or not. Most importantly, this class caches the hash of seen
 * files so that at development time, we don't have to recalculate them constantly.
 *
 * This class is also the core of how electron-compile runs quickly in production
 * mode - after precompilation, the cache is serialized along with the rest of the
 * data in {@link CompilerHost}, so that when we load the app in production mode,
 * we don't end up calculating hashes of file content at all, only using the contents
 * of this cache.
 */

var FileChangedCache = function () {
  function FileChangedCache(appRoot) {
    var failOnCacheMiss = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    (0, _classCallCheck3.default)(this, FileChangedCache);

    this.appRoot = (0, _sanitizePaths2.default)(appRoot);

    this.failOnCacheMiss = failOnCacheMiss;
    this.changeCache = {};
  }

  /**
   * Allows you to create a FileChangedCache from serialized data saved from
   * {@link getSavedData}.
   *
   * @param  {Object} data  Saved data from getSavedData.
   *
   * @param  {string} appRoot  The top-level directory for your application (i.e.
   *                           the one which has your package.json).
   *
   * @param  {boolean} failOnCacheMiss (optional)  If True, cache misses will throw.
   *
   * @return {FileChangedCache}
   */


  (0, _createClass3.default)(FileChangedCache, [{
    key: 'getHashForPath',


    /**
     * Returns information about a given file, including its hash. This method is
     * the main method for this cache.
     *
     * @param  {string} absoluteFilePath  The path to a file to retrieve info on.
     *
     * @return {Promise<Object>}
     *
     * @property {string} hash  The SHA1 hash of the file
     * @property {boolean} isMinified  True if the file is minified
     * @property {boolean} isInNodeModules  True if the file is in a library directory
     * @property {boolean} hasSourceMap  True if the file has a source map
     * @property {boolean} isFileBinary  True if the file is not a text file
     * @property {Buffer} binaryData (optional)  The buffer that was read if the file
     *                                           was binary and there was a cache miss.
     * @property {string} code (optional)  The string that was read if the file
     *                                     was text and there was a cache miss
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(absoluteFilePath) {
        var cacheKey, cacheEntry, stat, ctime, size, _ref2, digest, sourceCode, binaryData, info;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                cacheKey = (0, _sanitizePaths2.default)(absoluteFilePath);

                if (this.appRoot) {
                  cacheKey = cacheKey.replace(this.appRoot, '');
                }

                // NB: We do this because x-require will include an absolute path from the
                // original built app and we need to still grok it
                if (this.originalAppRoot) {
                  cacheKey = cacheKey.replace(this.originalAppRoot, '');
                }

                cacheEntry = this.changeCache[cacheKey];

                if (!this.failOnCacheMiss) {
                  _context.next = 10;
                  break;
                }

                if (cacheEntry) {
                  _context.next = 9;
                  break;
                }

                d('Tried to read file cache entry for ' + absoluteFilePath);
                d('cacheKey: ' + cacheKey + ', appRoot: ' + this.appRoot + ', originalAppRoot: ' + this.originalAppRoot);
                throw new Error('Asked for ' + absoluteFilePath + ' but it was not precompiled!');

              case 9:
                return _context.abrupt('return', cacheEntry.info);

              case 10:
                _context.next = 12;
                return _promise.pfs.stat(absoluteFilePath);

              case 12:
                stat = _context.sent;
                ctime = stat.ctime.getTime();
                size = stat.size;

                if (!(!stat || !stat.isFile())) {
                  _context.next = 17;
                  break;
                }

                throw new Error('Can\'t stat ' + absoluteFilePath);

              case 17:
                if (!cacheEntry) {
                  _context.next = 22;
                  break;
                }

                if (!(cacheEntry.ctime >= ctime && cacheEntry.size === size)) {
                  _context.next = 20;
                  break;
                }

                return _context.abrupt('return', cacheEntry.info);

              case 20:

                d('Invalidating cache entry: ' + cacheEntry.ctime + ' === ' + ctime + ' && ' + cacheEntry.size + ' === ' + size);
                delete this.changeCache.cacheEntry;

              case 22:
                _context.next = 24;
                return this.calculateHashForFile(absoluteFilePath);

              case 24:
                _ref2 = _context.sent;
                digest = _ref2.digest;
                sourceCode = _ref2.sourceCode;
                binaryData = _ref2.binaryData;
                info = {
                  hash: digest,
                  isMinified: FileChangedCache.contentsAreMinified(sourceCode || ''),
                  isInNodeModules: FileChangedCache.isInNodeModules(absoluteFilePath),
                  hasSourceMap: FileChangedCache.hasSourceMap(sourceCode || ''),
                  isFileBinary: !!binaryData
                };


                this.changeCache[cacheKey] = { ctime: ctime, size: size, info: info };
                d('Cache entry for ' + cacheKey + ': ' + (0, _stringify2.default)(this.changeCache[cacheKey]));

                if (!binaryData) {
                  _context.next = 35;
                  break;
                }

                return _context.abrupt('return', (0, _assign2.default)({ binaryData: binaryData }, info));

              case 35:
                return _context.abrupt('return', (0, _assign2.default)({ sourceCode: sourceCode }, info));

              case 36:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getHashForPath(_x2) {
        return _ref.apply(this, arguments);
      }

      return getHashForPath;
    }()

    /**
     * Returns data that can passed to {@link loadFromData} to rehydrate this cache.
     *
     * @return {Object}
     */

  }, {
    key: 'getSavedData',
    value: function getSavedData() {
      return { changeCache: this.changeCache, appRoot: this.appRoot };
    }

    /**
     * Serializes this object's data to a file.
     *
     * @param {string} filePath  The path to save data to.
     *
     * @return {Promise} Completion.
     */

  }, {
    key: 'save',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePath) {
        var toSave, buf;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                toSave = this.getSavedData();
                _context2.next = 3;
                return _promise.pzlib.gzip(new Buffer((0, _stringify2.default)(toSave)));

              case 3:
                buf = _context2.sent;
                _context2.next = 6;
                return _promise.pfs.writeFile(filePath, buf);

              case 6:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function save(_x3) {
        return _ref3.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'calculateHashForFile',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(absoluteFilePath) {
        var buf, encoding, _digest, sourceCode, digest;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _promise.pfs.readFile(absoluteFilePath);

              case 2:
                buf = _context3.sent;
                encoding = FileChangedCache.detectFileEncoding(buf);

                if (encoding) {
                  _context3.next = 7;
                  break;
                }

                _digest = _crypto2.default.createHash('sha1').update(buf).digest('hex');
                return _context3.abrupt('return', { sourceCode: null, digest: _digest, binaryData: buf });

              case 7:
                _context3.next = 9;
                return _promise.pfs.readFile(absoluteFilePath, encoding);

              case 9:
                sourceCode = _context3.sent;
                digest = _crypto2.default.createHash('sha1').update(sourceCode, 'utf8').digest('hex');
                return _context3.abrupt('return', { sourceCode: sourceCode, digest: digest, binaryData: null });

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function calculateHashForFile(_x4) {
        return _ref4.apply(this, arguments);
      }

      return calculateHashForFile;
    }()
  }, {
    key: 'getHashForPathSync',
    value: function getHashForPathSync(absoluteFilePath) {
      var cacheKey = (0, _sanitizePaths2.default)(absoluteFilePath);
      if (this.appRoot) {
        cacheKey = cacheKey.replace(this.appRoot, '');
      }

      // NB: We do this because x-require will include an absolute path from the
      // original built app and we need to still grok it
      if (this.originalAppRoot) {
        cacheKey = cacheKey.replace(this.originalAppRoot, '');
      }

      if (this.realAppRoot) {
        cacheKey = cacheKey.replace(this.realAppRoot, '');
      }

      var cacheEntry = this.changeCache[cacheKey];

      if (this.failOnCacheMiss) {
        if (!cacheEntry) {
          d('Tried to read file cache entry for ' + absoluteFilePath);
          d('cacheKey: ' + cacheKey + ', appRoot: ' + this.appRoot + ', originalAppRoot: ' + this.originalAppRoot);
          throw new Error('Asked for ' + absoluteFilePath + ' but it was not precompiled!');
        }

        return cacheEntry.info;
      }

      var stat = _fs2.default.statSync(absoluteFilePath);
      var ctime = stat.ctime.getTime();
      var size = stat.size;
      if (!stat || !stat.isFile()) throw new Error('Can\'t stat ' + absoluteFilePath);

      if (cacheEntry) {
        if (cacheEntry.ctime >= ctime && cacheEntry.size === size) {
          return cacheEntry.info;
        }

        d('Invalidating cache entry: ' + cacheEntry.ctime + ' === ' + ctime + ' && ' + cacheEntry.size + ' === ' + size);
        delete this.changeCache.cacheEntry;
      }

      var _calculateHashForFile = this.calculateHashForFileSync(absoluteFilePath);

      var digest = _calculateHashForFile.digest;
      var sourceCode = _calculateHashForFile.sourceCode;
      var binaryData = _calculateHashForFile.binaryData;


      var info = {
        hash: digest,
        isMinified: FileChangedCache.contentsAreMinified(sourceCode || ''),
        isInNodeModules: FileChangedCache.isInNodeModules(absoluteFilePath),
        hasSourceMap: FileChangedCache.hasSourceMap(sourceCode || ''),
        isFileBinary: !!binaryData
      };

      this.changeCache[cacheKey] = { ctime: ctime, size: size, info: info };
      d('Cache entry for ' + cacheKey + ': ' + (0, _stringify2.default)(this.changeCache[cacheKey]));

      if (binaryData) {
        return (0, _assign2.default)({ binaryData: binaryData }, info);
      } else {
        return (0, _assign2.default)({ sourceCode: sourceCode }, info);
      }
    }
  }, {
    key: 'saveSync',
    value: function saveSync(filePath) {
      var toSave = this.getSavedData();

      var buf = _zlib2.default.gzipSync(new Buffer((0, _stringify2.default)(toSave)));
      _fs2.default.writeFileSync(filePath, buf);
    }
  }, {
    key: 'calculateHashForFileSync',
    value: function calculateHashForFileSync(absoluteFilePath) {
      var buf = _fs2.default.readFileSync(absoluteFilePath);
      var encoding = FileChangedCache.detectFileEncoding(buf);

      if (!encoding) {
        var _digest2 = _crypto2.default.createHash('sha1').update(buf).digest('hex');
        return { sourceCode: null, digest: _digest2, binaryData: buf };
      }

      var sourceCode = _fs2.default.readFileSync(absoluteFilePath, encoding);
      var digest = _crypto2.default.createHash('sha1').update(sourceCode, 'utf8').digest('hex');

      return { sourceCode: sourceCode, digest: digest, binaryData: null };
    }

    /**
     * Determines via some statistics whether a file is likely to be minified.
     *
     * @private
     */

  }], [{
    key: 'loadFromData',
    value: function loadFromData(data, appRoot) {
      var failOnCacheMiss = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      var ret = new FileChangedCache(appRoot, failOnCacheMiss);
      ret.changeCache = data.changeCache;
      ret.originalAppRoot = data.appRoot;

      return ret;
    }

    /**
     * Allows you to create a FileChangedCache from serialized data saved from
     * {@link save}.
     *
     * @param  {string} file  Saved data from save.
     *
     * @param  {string} appRoot  The top-level directory for your application (i.e.
     *                           the one which has your package.json).
     *
     * @param  {boolean} failOnCacheMiss (optional)  If True, cache misses will throw.
     *
     * @return {Promise<FileChangedCache>}
     */

  }, {
    key: 'loadFromFile',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(file, appRoot) {
        var failOnCacheMiss = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
        var buf;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                d('Loading canned FileChangedCache from ' + file);

                _context4.next = 3;
                return _promise.pfs.readFile(file);

              case 3:
                buf = _context4.sent;
                _context4.t0 = FileChangedCache;
                _context4.t1 = JSON;
                _context4.next = 8;
                return _promise.pzlib.gunzip(buf);

              case 8:
                _context4.t2 = _context4.sent;
                _context4.t3 = _context4.t1.parse.call(_context4.t1, _context4.t2);
                _context4.t4 = appRoot;
                _context4.t5 = failOnCacheMiss;
                return _context4.abrupt('return', _context4.t0.loadFromData.call(_context4.t0, _context4.t3, _context4.t4, _context4.t5));

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function loadFromFile(_x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return loadFromFile;
    }()
  }, {
    key: 'contentsAreMinified',
    value: function contentsAreMinified(source) {
      var length = source.length;
      if (length > 1024) length = 1024;

      var newlineCount = 0;

      // Roll through the characters and determine the average line length
      for (var i = 0; i < source.length; i++) {
        if (source[i] === '\n') newlineCount++;
      }

      // No Newlines? Any file other than a super small one is minified
      if (newlineCount === 0) {
        return length > 80;
      }

      var avgLineLength = length / newlineCount;
      return avgLineLength > 80;
    }

    /**
     * Determines whether a path is in node_modules or the Electron init code
     *
     * @private
     */

  }, {
    key: 'isInNodeModules',
    value: function isInNodeModules(filePath) {
      return !!(filePath.match(/(node_modules|bower_components)[\\\/]/i) || filePath.match(/(atom|electron)\.asar/));
    }

    /**
     * Returns whether a file has an inline source map
     *
     * @private
     */

  }, {
    key: 'hasSourceMap',
    value: function hasSourceMap(sourceCode) {
      var trimmed = sourceCode.trim();
      return trimmed.lastIndexOf('//# sourceMap') > trimmed.lastIndexOf('\n');
    }

    /**
     * Determines the encoding of a file from the two most common encodings by trying
     * to decode it then looking for encoding errors
     *
     * @private
     */

  }, {
    key: 'detectFileEncoding',
    value: function detectFileEncoding(buffer) {
      if (buffer.length < 1) return false;
      var buf = buffer.length < 4096 ? buffer : buffer.slice(0, 4096);

      var encodings = ['utf8', 'utf16le'];

      var encoding = encodings.find(function (x) {
        return !FileChangedCache.containsControlCharacters(buf.toString(x));
      });

      return encoding;
    }

    /**
     * Determines whether a string is likely to be poorly encoded by looking for
     * control characters above a certain threshold
     *
     * @private
     */

  }, {
    key: 'containsControlCharacters',
    value: function containsControlCharacters(str) {
      var controlCount = 0;
      var spaceCount = 0;
      var threshold = 2;
      if (str.length > 64) threshold = 4;
      if (str.length > 512) threshold = 8;

      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c === 65536 || c < 8) controlCount++;
        if (c > 14 && c < 32) controlCount++;
        if (c === 32) spaceCount++;

        if (controlCount > threshold) return true;
      }

      if (spaceCount < threshold) return true;

      if (controlCount === 0) return false;
      return controlCount / str.length < 0.02;
    }
  }]);
  return FileChangedCache;
}();

exports.default = FileChangedCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maWxlLWNoYW5nZS1jYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxJQUFJLFFBQVEsZ0JBQVIsRUFBMEIsb0NBQTFCLENBQVY7O0FBRUE7Ozs7Ozs7Ozs7OztJQVdxQixnQjtBQUNuQiw0QkFBWSxPQUFaLEVBQTRDO0FBQUEsUUFBdkIsZUFBdUIseURBQVAsS0FBTztBQUFBOztBQUMxQyxTQUFLLE9BQUwsR0FBZSw2QkFBaUIsT0FBakIsQ0FBZjs7QUFFQSxTQUFLLGVBQUwsR0FBdUIsZUFBdkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2RkFrQnFCLGdCOzs7Ozs7O0FBQ2Ysd0IsR0FBVyw2QkFBaUIsZ0JBQWpCLEM7O0FBQ2Ysb0JBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLDZCQUFXLFNBQVMsT0FBVCxDQUFpQixLQUFLLE9BQXRCLEVBQStCLEVBQS9CLENBQVg7QUFDRDs7QUFFRDtBQUNBO0FBQ0Esb0JBQUksS0FBSyxlQUFULEVBQTBCO0FBQ3hCLDZCQUFXLFNBQVMsT0FBVCxDQUFpQixLQUFLLGVBQXRCLEVBQXVDLEVBQXZDLENBQVg7QUFDRDs7QUFFRywwQixHQUFhLEtBQUssV0FBTCxDQUFpQixRQUFqQixDOztxQkFFYixLQUFLLGU7Ozs7O29CQUNGLFU7Ozs7O0FBQ0gsMERBQXdDLGdCQUF4QztBQUNBLGlDQUFlLFFBQWYsbUJBQXFDLEtBQUssT0FBMUMsMkJBQXVFLEtBQUssZUFBNUU7c0JBQ00sSUFBSSxLQUFKLGdCQUF1QixnQkFBdkIsa0M7OztpREFHRCxXQUFXLEk7Ozs7dUJBR0gsYUFBSSxJQUFKLENBQVMsZ0JBQVQsQzs7O0FBQWIsb0I7QUFDQSxxQixHQUFRLEtB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QUFYLEVBQWMsSUFBSSxJQUFJLE1BQXRCLEVBQThCLEdBQTlCLEVBQW1DO0FBQ2pDLFlBQUksSUFBSSxJQUFJLFVBQUosQ0FBZSxDQUFmLENBQVI7QUFDQSxZQUFJLE1BQU0sS0FBTixJQUFlLElBQUksQ0FBdkIsRUFBMEI7QUFDMUIsWUFBSSxJQUFJLEVBQUosSUFBVSxJQUFJLEVBQWxCLEVBQXNCO0FBQ3RCLFlBQUksTUFBTSxFQUFWLEVBQWM7O0FBRWQsWUFBSSxlQUFlLFNBQW5CLEVBQThCLE9BQU8sSUFBUDtBQUMvQjs7QUFFRCxVQUFJLGFBQWEsU0FBakIsRUFBNEIsT0FBTyxJQUFQOztBQUU1QixVQUFJLGlCQUFpQixDQUFyQixFQUF3QixPQUFPLEtBQVA7QUFDeEIsYUFBUSxlQUFlLElBQUksTUFBcEIsR0FBOEIsSUFBckM7QUFDRDs7Ozs7a0JBclZrQixnQiIsImZpbGUiOiJmaWxlLWNoYW5nZS1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgemxpYiBmcm9tICd6bGliJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7cGZzLCBwemxpYn0gZnJvbSAnLi9wcm9taXNlJztcbmltcG9ydCBzYW5pdGl6ZUZpbGVQYXRoIGZyb20gJy4vc2FuaXRpemUtcGF0aHMnO1xuXG5jb25zdCBkID0gcmVxdWlyZSgnZGVidWctZWxlY3Ryb24nKSgnZWxlY3Ryb24tY29tcGlsZTpmaWxlLWNoYW5nZS1jYWNoZScpO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgY2FjaGVzIGluZm9ybWF0aW9uIGFib3V0IGZpbGVzIGFuZCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhleSBoYXZlXG4gKiBjaGFuZ2VkIGNvbnRlbnRzIG9yIG5vdC4gTW9zdCBpbXBvcnRhbnRseSwgdGhpcyBjbGFzcyBjYWNoZXMgdGhlIGhhc2ggb2Ygc2VlblxuICogZmlsZXMgc28gdGhhdCBhdCBkZXZlbG9wbWVudCB0aW1lLCB3ZSBkb24ndCBoYXZlIHRvIHJlY2FsY3VsYXRlIHRoZW0gY29uc3RhbnRseS5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIGFsc28gdGhlIGNvcmUgb2YgaG93IGVsZWN0cm9uLWNvbXBpbGUgcnVucyBxdWlja2x5IGluIHByb2R1Y3Rpb25cbiAqIG1vZGUgLSBhZnRlciBwcmVjb21waWxhdGlvbiwgdGhlIGNhY2hlIGlzIHNlcmlhbGl6ZWQgYWxvbmcgd2l0aCB0aGUgcmVzdCBvZiB0aGVcbiAqIGRhdGEgaW4ge0BsaW5rIENvbXBpbGVySG9zdH0sIHNvIHRoYXQgd2hlbiB3ZSBsb2FkIHRoZSBhcHAgaW4gcHJvZHVjdGlvbiBtb2RlLFxuICogd2UgZG9uJ3QgZW5kIHVwIGNhbGN1bGF0aW5nIGhhc2hlcyBvZiBmaWxlIGNvbnRlbnQgYXQgYWxsLCBvbmx5IHVzaW5nIHRoZSBjb250ZW50c1xuICogb2YgdGhpcyBjYWNoZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZUNoYW5nZWRDYWNoZSB7XG4gIGNvbnN0cnVjdG9yKGFwcFJvb3QsIGZhaWxPbkNhY2hlTWlzcz1mYWxzZSkge1xuICAgIHRoaXMuYXBwUm9vdCA9IHNhbml0aXplRmlsZVBhdGgoYXBwUm9vdCk7XG5cbiAgICB0aGlzLmZhaWxPbkNhY2hlTWlzcyA9IGZhaWxPbkNhY2hlTWlzcztcbiAgICB0aGlzLmNoYW5nZUNhY2hlID0ge307XG4gIH1cblxuICAvKipcbiAgICogQWxsb3dzIHlvdSB0byBjcmVhdGUgYSBGaWxlQ2hhbmdlZENhY2hlIGZyb20gc2VyaWFsaXplZCBkYXRhIHNhdmVkIGZyb21cbiAgICoge0BsaW5rIGdldFNhdmVkRGF0YX0uXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSAgU2F2ZWQgZGF0YSBmcm9tIGdldFNhdmVkRGF0YS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBhcHBSb290ICBUaGUgdG9wLWxldmVsIGRpcmVjdG9yeSBmb3IgeW91ciBhcHBsaWNhdGlvbiAoaS5lLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvbmUgd2hpY2ggaGFzIHlvdXIgcGFja2FnZS5qc29uKS5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gZmFpbE9uQ2FjaGVNaXNzIChvcHRpb25hbCkgIElmIFRydWUsIGNhY2hlIG1pc3NlcyB3aWxsIHRocm93LlxuICAgKlxuICAgKiBAcmV0dXJuIHtGaWxlQ2hhbmdlZENhY2hlfVxuICAgKi9cbiAgc3RhdGljIGxvYWRGcm9tRGF0YShkYXRhLCBhcHBSb290LCBmYWlsT25DYWNoZU1pc3M9dHJ1ZSkge1xuICAgIGxldCByZXQgPSBuZXcgRmlsZUNoYW5nZWRDYWNoZShhcHBSb290LCBmYWlsT25DYWNoZU1pc3MpO1xuICAgIHJldC5jaGFuZ2VDYWNoZSA9IGRhdGEuY2hhbmdlQ2FjaGU7XG4gICAgcmV0Lm9yaWdpbmFsQXBwUm9vdCA9IGRhdGEuYXBwUm9vdDtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBBbGxvd3MgeW91IHRvIGNyZWF0ZSBhIEZpbGVDaGFuZ2VkQ2FjaGUgZnJvbSBzZXJpYWxpemVkIGRhdGEgc2F2ZWQgZnJvbVxuICAgKiB7QGxpbmsgc2F2ZX0uXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZmlsZSAgU2F2ZWQgZGF0YSBmcm9tIHNhdmUuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYXBwUm9vdCAgVGhlIHRvcC1sZXZlbCBkaXJlY3RvcnkgZm9yIHlvdXIgYXBwbGljYXRpb24gKGkuZS5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgb25lIHdoaWNoIGhhcyB5b3VyIHBhY2thZ2UuanNvbikuXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGZhaWxPbkNhY2hlTWlzcyAob3B0aW9uYWwpICBJZiBUcnVlLCBjYWNoZSBtaXNzZXMgd2lsbCB0aHJvdy5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxGaWxlQ2hhbmdlZENhY2hlPn1cbiAgICovXG4gIHN0YXRpYyBhc3luYyBsb2FkRnJvbUZpbGUoZmlsZSwgYXBwUm9vdCwgZmFpbE9uQ2FjaGVNaXNzPXRydWUpIHtcbiAgICBkKGBMb2FkaW5nIGNhbm5lZCBGaWxlQ2hhbmdlZENhY2hlIGZyb20gJHtmaWxlfWApO1xuXG4gICAgbGV0IGJ1ZiA9IGF3YWl0IHBmcy5yZWFkRmlsZShmaWxlKTtcbiAgICByZXR1cm4gRmlsZUNoYW5nZWRDYWNoZS5sb2FkRnJvbURhdGEoSlNPTi5wYXJzZShhd2FpdCBwemxpYi5ndW56aXAoYnVmKSksIGFwcFJvb3QsIGZhaWxPbkNhY2hlTWlzcyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGluZm9ybWF0aW9uIGFib3V0IGEgZ2l2ZW4gZmlsZSwgaW5jbHVkaW5nIGl0cyBoYXNoLiBUaGlzIG1ldGhvZCBpc1xuICAgKiB0aGUgbWFpbiBtZXRob2QgZm9yIHRoaXMgY2FjaGUuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYWJzb2x1dGVGaWxlUGF0aCAgVGhlIHBhdGggdG8gYSBmaWxlIHRvIHJldHJpZXZlIGluZm8gb24uXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0Pn1cbiAgICpcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGhhc2ggIFRoZSBTSEExIGhhc2ggb2YgdGhlIGZpbGVcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBpc01pbmlmaWVkICBUcnVlIGlmIHRoZSBmaWxlIGlzIG1pbmlmaWVkXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNJbk5vZGVNb2R1bGVzICBUcnVlIGlmIHRoZSBmaWxlIGlzIGluIGEgbGlicmFyeSBkaXJlY3RvcnlcbiAgICogQHByb3BlcnR5IHtib29sZWFufSBoYXNTb3VyY2VNYXAgIFRydWUgaWYgdGhlIGZpbGUgaGFzIGEgc291cmNlIG1hcFxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzRmlsZUJpbmFyeSAgVHJ1ZSBpZiB0aGUgZmlsZSBpcyBub3QgYSB0ZXh0IGZpbGVcbiAgICogQHByb3BlcnR5IHtCdWZmZXJ9IGJpbmFyeURhdGEgKG9wdGlvbmFsKSAgVGhlIGJ1ZmZlciB0aGF0IHdhcyByZWFkIGlmIHRoZSBmaWxlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcyBiaW5hcnkgYW5kIHRoZXJlIHdhcyBhIGNhY2hlIG1pc3MuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjb2RlIChvcHRpb25hbCkgIFRoZSBzdHJpbmcgdGhhdCB3YXMgcmVhZCBpZiB0aGUgZmlsZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXMgdGV4dCBhbmQgdGhlcmUgd2FzIGEgY2FjaGUgbWlzc1xuICAgKi9cbiAgYXN5bmMgZ2V0SGFzaEZvclBhdGgoYWJzb2x1dGVGaWxlUGF0aCkge1xuICAgIGxldCBjYWNoZUtleSA9IHNhbml0aXplRmlsZVBhdGgoYWJzb2x1dGVGaWxlUGF0aCk7XG4gICAgaWYgKHRoaXMuYXBwUm9vdCkge1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleS5yZXBsYWNlKHRoaXMuYXBwUm9vdCwgJycpO1xuICAgIH1cblxuICAgIC8vIE5COiBXZSBkbyB0aGlzIGJlY2F1c2UgeC1yZXF1aXJlIHdpbGwgaW5jbHVkZSBhbiBhYnNvbHV0ZSBwYXRoIGZyb20gdGhlXG4gICAgLy8gb3JpZ2luYWwgYnVpbHQgYXBwIGFuZCB3ZSBuZWVkIHRvIHN0aWxsIGdyb2sgaXRcbiAgICBpZiAodGhpcy5vcmlnaW5hbEFwcFJvb3QpIHtcbiAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXkucmVwbGFjZSh0aGlzLm9yaWdpbmFsQXBwUm9vdCwgJycpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZUVudHJ5ID0gdGhpcy5jaGFuZ2VDYWNoZVtjYWNoZUtleV07XG5cbiAgICBpZiAodGhpcy5mYWlsT25DYWNoZU1pc3MpIHtcbiAgICAgIGlmICghY2FjaGVFbnRyeSkge1xuICAgICAgICBkKGBUcmllZCB0byByZWFkIGZpbGUgY2FjaGUgZW50cnkgZm9yICR7YWJzb2x1dGVGaWxlUGF0aH1gKTtcbiAgICAgICAgZChgY2FjaGVLZXk6ICR7Y2FjaGVLZXl9LCBhcHBSb290OiAke3RoaXMuYXBwUm9vdH0sIG9yaWdpbmFsQXBwUm9vdDogJHt0aGlzLm9yaWdpbmFsQXBwUm9vdH1gKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc2tlZCBmb3IgJHthYnNvbHV0ZUZpbGVQYXRofSBidXQgaXQgd2FzIG5vdCBwcmVjb21waWxlZCFgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhY2hlRW50cnkuaW5mbztcbiAgICB9XG5cbiAgICBsZXQgc3RhdCA9IGF3YWl0IHBmcy5zdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICAgIGxldCBjdGltZSA9IHN0YXQuY3RpbWUuZ2V0VGltZSgpO1xuICAgIGxldCBzaXplID0gc3RhdC5zaXplO1xuICAgIGlmICghc3RhdCB8fCAhc3RhdC5pc0ZpbGUoKSkgdGhyb3cgbmV3IEVycm9yKGBDYW4ndCBzdGF0ICR7YWJzb2x1dGVGaWxlUGF0aH1gKTtcblxuICAgIGlmIChjYWNoZUVudHJ5KSB7XG4gICAgICBpZiAoY2FjaGVFbnRyeS5jdGltZSA+PSBjdGltZSAmJiBjYWNoZUVudHJ5LnNpemUgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlRW50cnkuaW5mbztcbiAgICAgIH1cblxuICAgICAgZChgSW52YWxpZGF0aW5nIGNhY2hlIGVudHJ5OiAke2NhY2hlRW50cnkuY3RpbWV9ID09PSAke2N0aW1lfSAmJiAke2NhY2hlRW50cnkuc2l6ZX0gPT09ICR7c2l6ZX1gKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmNoYW5nZUNhY2hlLmNhY2hlRW50cnk7XG4gICAgfVxuXG4gICAgbGV0IHtkaWdlc3QsIHNvdXJjZUNvZGUsIGJpbmFyeURhdGF9ID0gYXdhaXQgdGhpcy5jYWxjdWxhdGVIYXNoRm9yRmlsZShhYnNvbHV0ZUZpbGVQYXRoKTtcblxuICAgIGxldCBpbmZvID0ge1xuICAgICAgaGFzaDogZGlnZXN0LFxuICAgICAgaXNNaW5pZmllZDogRmlsZUNoYW5nZWRDYWNoZS5jb250ZW50c0FyZU1pbmlmaWVkKHNvdXJjZUNvZGUgfHwgJycpLFxuICAgICAgaXNJbk5vZGVNb2R1bGVzOiBGaWxlQ2hhbmdlZENhY2hlLmlzSW5Ob2RlTW9kdWxlcyhhYnNvbHV0ZUZpbGVQYXRoKSxcbiAgICAgIGhhc1NvdXJjZU1hcDogRmlsZUNoYW5nZWRDYWNoZS5oYXNTb3VyY2VNYXAoc291cmNlQ29kZSB8fCAnJyksXG4gICAgICBpc0ZpbGVCaW5hcnk6ICEhYmluYXJ5RGF0YVxuICAgIH07XG5cbiAgICB0aGlzLmNoYW5nZUNhY2hlW2NhY2hlS2V5XSA9IHsgY3RpbWUsIHNpemUsIGluZm8gfTtcbiAgICBkKGBDYWNoZSBlbnRyeSBmb3IgJHtjYWNoZUtleX06ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5jaGFuZ2VDYWNoZVtjYWNoZUtleV0pfWApO1xuXG4gICAgaWYgKGJpbmFyeURhdGEpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtiaW5hcnlEYXRhfSwgaW5mbyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtzb3VyY2VDb2RlfSwgaW5mbyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyBkYXRhIHRoYXQgY2FuIHBhc3NlZCB0byB7QGxpbmsgbG9hZEZyb21EYXRhfSB0byByZWh5ZHJhdGUgdGhpcyBjYWNoZS5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0U2F2ZWREYXRhKCkge1xuICAgIHJldHVybiB7IGNoYW5nZUNhY2hlOiB0aGlzLmNoYW5nZUNhY2hlLCBhcHBSb290OiB0aGlzLmFwcFJvb3QgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoaXMgb2JqZWN0J3MgZGF0YSB0byBhIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAgVGhlIHBhdGggdG8gc2F2ZSBkYXRhIHRvLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBDb21wbGV0aW9uLlxuICAgKi9cbiAgYXN5bmMgc2F2ZShmaWxlUGF0aCkge1xuICAgIGxldCB0b1NhdmUgPSB0aGlzLmdldFNhdmVkRGF0YSgpO1xuXG4gICAgbGV0IGJ1ZiA9IGF3YWl0IHB6bGliLmd6aXAobmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeSh0b1NhdmUpKSk7XG4gICAgYXdhaXQgcGZzLndyaXRlRmlsZShmaWxlUGF0aCwgYnVmKTtcbiAgfVxuXG4gIGFzeW5jIGNhbGN1bGF0ZUhhc2hGb3JGaWxlKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgICBsZXQgYnVmID0gYXdhaXQgcGZzLnJlYWRGaWxlKGFic29sdXRlRmlsZVBhdGgpO1xuICAgIGxldCBlbmNvZGluZyA9IEZpbGVDaGFuZ2VkQ2FjaGUuZGV0ZWN0RmlsZUVuY29kaW5nKGJ1Zik7XG5cbiAgICBpZiAoIWVuY29kaW5nKSB7XG4gICAgICBsZXQgZGlnZXN0ID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUoYnVmKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgcmV0dXJuIHsgc291cmNlQ29kZTogbnVsbCwgZGlnZXN0LCBiaW5hcnlEYXRhOiBidWYgfTtcbiAgICB9XG5cbiAgICBsZXQgc291cmNlQ29kZSA9IGF3YWl0IHBmcy5yZWFkRmlsZShhYnNvbHV0ZUZpbGVQYXRoLCBlbmNvZGluZyk7XG4gICAgbGV0IGRpZ2VzdCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJykudXBkYXRlKHNvdXJjZUNvZGUsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcblxuICAgIHJldHVybiB7c291cmNlQ29kZSwgZGlnZXN0LCBiaW5hcnlEYXRhOiBudWxsIH07XG4gIH1cblxuICBnZXRIYXNoRm9yUGF0aFN5bmMoYWJzb2x1dGVGaWxlUGF0aCkge1xuICAgIGxldCBjYWNoZUtleSA9IHNhbml0aXplRmlsZVBhdGgoYWJzb2x1dGVGaWxlUGF0aCk7XG4gICAgaWYgKHRoaXMuYXBwUm9vdCkge1xuICAgICAgY2FjaGVLZXkgPSBjYWNoZUtleS5yZXBsYWNlKHRoaXMuYXBwUm9vdCwgJycpO1xuICAgIH1cblxuICAgIC8vIE5COiBXZSBkbyB0aGlzIGJlY2F1c2UgeC1yZXF1aXJlIHdpbGwgaW5jbHVkZSBhbiBhYnNvbHV0ZSBwYXRoIGZyb20gdGhlXG4gICAgLy8gb3JpZ2luYWwgYnVpbHQgYXBwIGFuZCB3ZSBuZWVkIHRvIHN0aWxsIGdyb2sgaXRcbiAgICBpZiAodGhpcy5vcmlnaW5hbEFwcFJvb3QpIHtcbiAgICAgIGNhY2hlS2V5ID0gY2FjaGVLZXkucmVwbGFjZSh0aGlzLm9yaWdpbmFsQXBwUm9vdCwgJycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlYWxBcHBSb290KSB7XG4gICAgICBjYWNoZUtleSA9IGNhY2hlS2V5LnJlcGxhY2UodGhpcy5yZWFsQXBwUm9vdCwgJycpO1xuICAgIH1cblxuICAgIGxldCBjYWNoZUVudHJ5ID0gdGhpcy5jaGFuZ2VDYWNoZVtjYWNoZUtleV07XG5cbiAgICBpZiAodGhpcy5mYWlsT25DYWNoZU1pc3MpIHtcbiAgICAgIGlmICghY2FjaGVFbnRyeSkge1xuICAgICAgICBkKGBUcmllZCB0byByZWFkIGZpbGUgY2FjaGUgZW50cnkgZm9yICR7YWJzb2x1dGVGaWxlUGF0aH1gKTtcbiAgICAgICAgZChgY2FjaGVLZXk6ICR7Y2FjaGVLZXl9LCBhcHBSb290OiAke3RoaXMuYXBwUm9vdH0sIG9yaWdpbmFsQXBwUm9vdDogJHt0aGlzLm9yaWdpbmFsQXBwUm9vdH1gKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc2tlZCBmb3IgJHthYnNvbHV0ZUZpbGVQYXRofSBidXQgaXQgd2FzIG5vdCBwcmVjb21waWxlZCFgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhY2hlRW50cnkuaW5mbztcbiAgICB9XG5cbiAgICBsZXQgc3RhdCA9IGZzLnN0YXRTeW5jKGFic29sdXRlRmlsZVBhdGgpO1xuICAgIGxldCBjdGltZSA9IHN0YXQuY3RpbWUuZ2V0VGltZSgpO1xuICAgIGxldCBzaXplID0gc3RhdC5zaXplO1xuICAgIGlmICghc3RhdCB8fCAhc3RhdC5pc0ZpbGUoKSkgdGhyb3cgbmV3IEVycm9yKGBDYW4ndCBzdGF0ICR7YWJzb2x1dGVGaWxlUGF0aH1gKTtcblxuICAgIGlmIChjYWNoZUVudHJ5KSB7XG4gICAgICBpZiAoY2FjaGVFbnRyeS5jdGltZSA+PSBjdGltZSAmJiBjYWNoZUVudHJ5LnNpemUgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlRW50cnkuaW5mbztcbiAgICAgIH1cblxuICAgICAgZChgSW52YWxpZGF0aW5nIGNhY2hlIGVudHJ5OiAke2NhY2hlRW50cnkuY3RpbWV9ID09PSAke2N0aW1lfSAmJiAke2NhY2hlRW50cnkuc2l6ZX0gPT09ICR7c2l6ZX1gKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmNoYW5nZUNhY2hlLmNhY2hlRW50cnk7XG4gICAgfVxuXG4gICAgbGV0IHtkaWdlc3QsIHNvdXJjZUNvZGUsIGJpbmFyeURhdGF9ID0gdGhpcy5jYWxjdWxhdGVIYXNoRm9yRmlsZVN5bmMoYWJzb2x1dGVGaWxlUGF0aCk7XG5cbiAgICBsZXQgaW5mbyA9IHtcbiAgICAgIGhhc2g6IGRpZ2VzdCxcbiAgICAgIGlzTWluaWZpZWQ6IEZpbGVDaGFuZ2VkQ2FjaGUuY29udGVudHNBcmVNaW5pZmllZChzb3VyY2VDb2RlIHx8ICcnKSxcbiAgICAgIGlzSW5Ob2RlTW9kdWxlczogRmlsZUNoYW5nZWRDYWNoZS5pc0luTm9kZU1vZHVsZXMoYWJzb2x1dGVGaWxlUGF0aCksXG4gICAgICBoYXNTb3VyY2VNYXA6IEZpbGVDaGFuZ2VkQ2FjaGUuaGFzU291cmNlTWFwKHNvdXJjZUNvZGUgfHwgJycpLFxuICAgICAgaXNGaWxlQmluYXJ5OiAhIWJpbmFyeURhdGFcbiAgICB9O1xuXG4gICAgdGhpcy5jaGFuZ2VDYWNoZVtjYWNoZUtleV0gPSB7IGN0aW1lLCBzaXplLCBpbmZvIH07XG4gICAgZChgQ2FjaGUgZW50cnkgZm9yICR7Y2FjaGVLZXl9OiAke0pTT04uc3RyaW5naWZ5KHRoaXMuY2hhbmdlQ2FjaGVbY2FjaGVLZXldKX1gKTtcblxuICAgIGlmIChiaW5hcnlEYXRhKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7YmluYXJ5RGF0YX0sIGluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7c291cmNlQ29kZX0sIGluZm8pO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVTeW5jKGZpbGVQYXRoKSB7XG4gICAgbGV0IHRvU2F2ZSA9IHRoaXMuZ2V0U2F2ZWREYXRhKCk7XG5cbiAgICBsZXQgYnVmID0gemxpYi5nemlwU3luYyhuZXcgQnVmZmVyKEpTT04uc3RyaW5naWZ5KHRvU2F2ZSkpKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBidWYpO1xuICB9XG5cbiAgY2FsY3VsYXRlSGFzaEZvckZpbGVTeW5jKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgICBsZXQgYnVmID0gZnMucmVhZEZpbGVTeW5jKGFic29sdXRlRmlsZVBhdGgpO1xuICAgIGxldCBlbmNvZGluZyA9IEZpbGVDaGFuZ2VkQ2FjaGUuZGV0ZWN0RmlsZUVuY29kaW5nKGJ1Zik7XG5cbiAgICBpZiAoIWVuY29kaW5nKSB7XG4gICAgICBsZXQgZGlnZXN0ID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUoYnVmKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgcmV0dXJuIHsgc291cmNlQ29kZTogbnVsbCwgZGlnZXN0LCBiaW5hcnlEYXRhOiBidWZ9O1xuICAgIH1cblxuICAgIGxldCBzb3VyY2VDb2RlID0gZnMucmVhZEZpbGVTeW5jKGFic29sdXRlRmlsZVBhdGgsIGVuY29kaW5nKTtcbiAgICBsZXQgZGlnZXN0ID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUoc291cmNlQ29kZSwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuXG4gICAgcmV0dXJuIHtzb3VyY2VDb2RlLCBkaWdlc3QsIGJpbmFyeURhdGE6IG51bGx9O1xuICB9XG5cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB2aWEgc29tZSBzdGF0aXN0aWNzIHdoZXRoZXIgYSBmaWxlIGlzIGxpa2VseSB0byBiZSBtaW5pZmllZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBjb250ZW50c0FyZU1pbmlmaWVkKHNvdXJjZSkge1xuICAgIGxldCBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPiAxMDI0KSBsZW5ndGggPSAxMDI0O1xuXG4gICAgbGV0IG5ld2xpbmVDb3VudCA9IDA7XG5cbiAgICAvLyBSb2xsIHRocm91Z2ggdGhlIGNoYXJhY3RlcnMgYW5kIGRldGVybWluZSB0aGUgYXZlcmFnZSBsaW5lIGxlbmd0aFxuICAgIGZvcihsZXQgaT0wOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc291cmNlW2ldID09PSAnXFxuJykgbmV3bGluZUNvdW50Kys7XG4gICAgfVxuXG4gICAgLy8gTm8gTmV3bGluZXM/IEFueSBmaWxlIG90aGVyIHRoYW4gYSBzdXBlciBzbWFsbCBvbmUgaXMgbWluaWZpZWRcbiAgICBpZiAobmV3bGluZUNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gKGxlbmd0aCA+IDgwKTtcbiAgICB9XG5cbiAgICBsZXQgYXZnTGluZUxlbmd0aCA9IGxlbmd0aCAvIG5ld2xpbmVDb3VudDtcbiAgICByZXR1cm4gKGF2Z0xpbmVMZW5ndGggPiA4MCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBwYXRoIGlzIGluIG5vZGVfbW9kdWxlcyBvciB0aGUgRWxlY3Ryb24gaW5pdCBjb2RlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgaXNJbk5vZGVNb2R1bGVzKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuICEhKGZpbGVQYXRoLm1hdGNoKC8obm9kZV9tb2R1bGVzfGJvd2VyX2NvbXBvbmVudHMpW1xcXFxcXC9dL2kpIHx8IGZpbGVQYXRoLm1hdGNoKC8oYXRvbXxlbGVjdHJvbilcXC5hc2FyLykpO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIGEgZmlsZSBoYXMgYW4gaW5saW5lIHNvdXJjZSBtYXBcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBoYXNTb3VyY2VNYXAoc291cmNlQ29kZSkge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBzb3VyY2VDb2RlLnRyaW0oKTtcbiAgICByZXR1cm4gdHJpbW1lZC5sYXN0SW5kZXhPZignLy8jIHNvdXJjZU1hcCcpID4gdHJpbW1lZC5sYXN0SW5kZXhPZignXFxuJyk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB0aGUgZW5jb2Rpbmcgb2YgYSBmaWxlIGZyb20gdGhlIHR3byBtb3N0IGNvbW1vbiBlbmNvZGluZ3MgYnkgdHJ5aW5nXG4gICAqIHRvIGRlY29kZSBpdCB0aGVuIGxvb2tpbmcgZm9yIGVuY29kaW5nIGVycm9yc1xuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhdGljIGRldGVjdEZpbGVFbmNvZGluZyhidWZmZXIpIHtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZTtcbiAgICBsZXQgYnVmID0gKGJ1ZmZlci5sZW5ndGggPCA0MDk2ID8gYnVmZmVyIDogYnVmZmVyLnNsaWNlKDAsIDQwOTYpKTtcblxuICAgIGNvbnN0IGVuY29kaW5ncyA9IFsndXRmOCcsICd1dGYxNmxlJ107XG5cbiAgICBsZXQgZW5jb2RpbmcgPSBlbmNvZGluZ3MuZmluZChcbiAgICAgICh4KSA9PiAhRmlsZUNoYW5nZWRDYWNoZS5jb250YWluc0NvbnRyb2xDaGFyYWN0ZXJzKGJ1Zi50b1N0cmluZyh4KSkpO1xuXG4gICAgcmV0dXJuIGVuY29kaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBhIHN0cmluZyBpcyBsaWtlbHkgdG8gYmUgcG9vcmx5IGVuY29kZWQgYnkgbG9va2luZyBmb3JcbiAgICogY29udHJvbCBjaGFyYWN0ZXJzIGFib3ZlIGEgY2VydGFpbiB0aHJlc2hvbGRcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXRpYyBjb250YWluc0NvbnRyb2xDaGFyYWN0ZXJzKHN0cikge1xuICAgIGxldCBjb250cm9sQ291bnQgPSAwO1xuICAgIGxldCBzcGFjZUNvdW50ID0gMDtcbiAgICBsZXQgdGhyZXNob2xkID0gMjtcbiAgICBpZiAoc3RyLmxlbmd0aCA+IDY0KSB0aHJlc2hvbGQgPSA0O1xuICAgIGlmIChzdHIubGVuZ3RoID4gNTEyKSB0aHJlc2hvbGQgPSA4O1xuXG4gICAgZm9yIChsZXQgaT0wOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGMgPT09IDY1NTM2IHx8IGMgPCA4KSBjb250cm9sQ291bnQrKztcbiAgICAgIGlmIChjID4gMTQgJiYgYyA8IDMyKSBjb250cm9sQ291bnQrKztcbiAgICAgIGlmIChjID09PSAzMikgc3BhY2VDb3VudCsrO1xuXG4gICAgICBpZiAoY29udHJvbENvdW50ID4gdGhyZXNob2xkKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3BhY2VDb3VudCA8IHRocmVzaG9sZCkgcmV0dXJuIHRydWU7XG5cbiAgICBpZiAoY29udHJvbENvdW50ID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIChjb250cm9sQ291bnQgLyBzdHIubGVuZ3RoKSA8IDAuMDI7XG4gIH1cbn1cbiJdfQ==