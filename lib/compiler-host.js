'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _mimeTypes = require('@paulcbetts/mime-types');

var _mimeTypes2 = _interopRequireDefault(_mimeTypes);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promise = require('./promise');

var _forAllFiles = require('./for-all-files');

var _compileCache = require('./compile-cache');

var _compileCache2 = _interopRequireDefault(_compileCache);

var _fileChangeCache = require('./file-change-cache');

var _fileChangeCache2 = _interopRequireDefault(_fileChangeCache);

var _readOnlyCompiler = require('./read-only-compiler');

var _readOnlyCompiler2 = _interopRequireDefault(_readOnlyCompiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = require('debug-electron')('electron-compile:compiler-host');

require('./rig-mime-types').init();

// This isn't even my
var finalForms = {
  'text/javascript': true,
  'application/javascript': true,
  'text/html': true,
  'text/css': true,
  'image/svg+xml': true,
  'application/json': true
};

/**
 * This class is the top-level class that encapsulates all of the logic of
 * compiling and caching application code. If you're looking for a "Main class",
 * this is it.
 *
 * This class can be created directly but it is usually created via the methods
 * in config-parser, which will among other things, set up the compiler options
 * given a project root.
 *
 * CompilerHost is also the top-level class that knows how to serialize all of the
 * information necessary to recreate itself, either as a development host (i.e.
 * will allow cache misses and actual compilation), or as a read-only version of
 * itself for production.
 */

var CompilerHost = function () {
  /**
   * Creates an instance of CompilerHost. You probably want to use the methods
   * in config-parser for development, or {@link createReadonlyFromConfiguration}
   * for production instead.
   *
   * @param  {string} rootCacheDir  The root directory to use for the cache
   *
   * @param  {Object} compilers  an Object whose keys are input MIME types and
   *                             whose values are instances of CompilerBase. Create
   *                             this via the {@link createCompilers} method in
   *                             config-parser.
   *
   * @param  {FileChangedCache} fileChangeCache  A file-change cache that is
   *                                             optionally pre-loaded.
   *
   * @param  {boolean} readOnlyMode  If True, cache misses will fail and
   *                                 compilation will not be attempted.
   *
   * @param  {CompilerBase} fallbackCompiler (optional)  When a file is compiled
   *                                         which doesn't have a matching compiler,
   *                                         this compiler will be used instead. If
   *                                         null, will fail compilation. A good
   *                                         alternate fallback is the compiler for
   *                                         'text/plain', which is guaranteed to be
   *                                         present.
   */
  function CompilerHost(rootCacheDir, compilers, fileChangeCache, readOnlyMode) {
    var fallbackCompiler = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    (0, _classCallCheck3.default)(this, CompilerHost);

    var compilersByMimeType = (0, _assign2.default)({}, compilers);
    (0, _assign2.default)(this, { rootCacheDir: rootCacheDir, compilersByMimeType: compilersByMimeType, fileChangeCache: fileChangeCache, readOnlyMode: readOnlyMode, fallbackCompiler: fallbackCompiler });
    this.appRoot = this.fileChangeCache.appRoot;

    this.cachesForCompilers = (0, _keys2.default)(compilersByMimeType).reduce(function (acc, x) {
      var compiler = compilersByMimeType[x];
      if (acc.has(compiler)) return acc;

      acc.set(compiler, _compileCache2.default.createFromCompiler(rootCacheDir, compiler, fileChangeCache, readOnlyMode));
      return acc;
    }, new _map2.default());
  }

  /**
   * Creates a production-mode CompilerHost from the previously saved
   * configuration
   *
   * @param  {string} rootCacheDir  The root directory to use for the cache. This
   *                                cache must have cache information saved via
   *                                {@link saveConfiguration}
   *
   * @param  {string} appRoot  The top-level directory for your application (i.e.
   *                           the one which has your package.json).
   *
   * @param  {CompilerBase} fallbackCompiler (optional)  When a file is compiled
   *                                         which doesn't have a matching compiler,
   *                                         this compiler will be used instead. If
   *                                         null, will fail compilation. A good
   *                                         alternate fallback is the compiler for
   *                                         'text/plain', which is guaranteed to be
   *                                         present.
   *
   * @return {Promise<CompilerHost>}  A read-only CompilerHost
   */


  (0, _createClass3.default)(CompilerHost, [{
    key: 'saveConfiguration',


    /**
     * Saves the current compiler configuration to a file that
     * {@link createReadonlyFromConfiguration} can use to recreate the current
     * compiler environment
     *
     * @return {Promise}  Completion
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var _this = this;

        var serializedCompilerOpts, info, target, buf;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                serializedCompilerOpts = (0, _keys2.default)(this.compilersByMimeType).reduce(function (acc, x) {
                  var compiler = _this.compilersByMimeType[x];
                  var Klass = (0, _getPrototypeOf2.default)(compiler).constructor;

                  var val = {
                    name: Klass.name,
                    inputMimeTypes: Klass.getInputMimeTypes(),
                    compilerOptions: compiler.compilerOptions,
                    compilerVersion: compiler.getCompilerVersion()
                  };

                  acc[x] = val;
                  return acc;
                }, {});
                info = {
                  fileChangeCache: this.fileChangeCache.getSavedData(),
                  compilers: serializedCompilerOpts
                };
                target = _path2.default.join(this.rootCacheDir, 'compiler-info.json.gz');
                _context.next = 5;
                return _promise.pzlib.gzip(new Buffer((0, _stringify2.default)(info)));

              case 5:
                buf = _context.sent;
                _context.next = 8;
                return _promise.pfs.writeFile(target, buf);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function saveConfiguration() {
        return _ref.apply(this, arguments);
      }

      return saveConfiguration;
    }()

    /**
     * Compiles a file and returns the compiled result.
     *
     * @param  {string} filePath  The path to the file to compile
     *
     * @return {Promise<object>}  An Object with the compiled result
     *
     * @property {Object} hashInfo  The hash information returned from getHashForPath
     * @property {string} code  The source code if the file was a text file
     * @property {Buffer} binaryData  The file if it was a binary file
     * @property {string} mimeType  The MIME type saved in the cache.
     * @property {string[]} dependentFiles  The dependent files returned from
     *                                      compiling the file, if any.
     */

  }, {
    key: 'compile',
    value: function compile(filePath) {
      return this.readOnlyMode ? this.compileReadOnly(filePath) : this.fullCompile(filePath);
    }

    /**
     * Handles compilation in read-only mode
     *
     * @private
     */

  }, {
    key: 'compileReadOnly',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePath) {
        var type, hashInfo, compiler, _ref3, _code, _binaryData, _mimeType, cache, _ref4, code, binaryData, mimeType;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // We guarantee that node_modules are always shipped directly
                type = _mimeTypes2.default.lookup(filePath);

                if (!_fileChangeCache2.default.isInNodeModules(filePath)) {
                  _context2.next = 7;
                  break;
                }

                _context2.t0 = type || 'application/javascript';
                _context2.next = 5;
                return _promise.pfs.readFile(filePath, 'utf8');

              case 5:
                _context2.t1 = _context2.sent;
                return _context2.abrupt('return', {
                  mimeType: _context2.t0,
                  code: _context2.t1
                });

              case 7:
                _context2.next = 9;
                return this.fileChangeCache.getHashForPath(filePath);

              case 9:
                hashInfo = _context2.sent;


                // NB: Here, we're basically only using the compiler here to find
                // the appropriate CompileCache
                compiler = CompilerHost.shouldPassthrough(hashInfo) ? this.getPassthroughCompiler() : this.compilersByMimeType[type || '__lolnothere'];

                if (compiler) {
                  _context2.next = 20;
                  break;
                }

                compiler = this.fallbackCompiler;

                _context2.next = 15;
                return compiler.get(filePath);

              case 15:
                _ref3 = _context2.sent;
                _code = _ref3.code;
                _binaryData = _ref3.binaryData;
                _mimeType = _ref3.mimeType;
                return _context2.abrupt('return', { code: _code || _binaryData, mimeType: _mimeType });

              case 20:
                cache = this.cachesForCompilers.get(compiler);
                _context2.next = 23;
                return cache.get(filePath);

              case 23:
                _ref4 = _context2.sent;
                code = _ref4.code;
                binaryData = _ref4.binaryData;
                mimeType = _ref4.mimeType;


                code = code || binaryData;

                if (!(!code || !mimeType)) {
                  _context2.next = 30;
                  break;
                }

                throw new Error('Asked to compile ' + filePath + ' in production, is this file not precompiled?');

              case 30:
                return _context2.abrupt('return', { code: code, mimeType: mimeType });

              case 31:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function compileReadOnly(_x2) {
        return _ref2.apply(this, arguments);
      }

      return compileReadOnly;
    }()

    /**
     * Handles compilation in read-write mode
     *
     * @private
     */

  }, {
    key: 'fullCompile',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filePath) {
        var _this2 = this;

        var hashInfo, type, code, compiler, cache;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                d('Compiling ' + filePath);

                _context3.next = 3;
                return this.fileChangeCache.getHashForPath(filePath);

              case 3:
                hashInfo = _context3.sent;
                type = _mimeTypes2.default.lookup(filePath);

                if (!hashInfo.isInNodeModules) {
                  _context3.next = 13;
                  break;
                }

                _context3.t0 = hashInfo.sourceCode;

                if (_context3.t0) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 10;
                return _promise.pfs.readFile(filePath, 'utf8');

              case 10:
                _context3.t0 = _context3.sent;

              case 11:
                code = _context3.t0;
                return _context3.abrupt('return', { code: code, mimeType: type });

              case 13:
                compiler = CompilerHost.shouldPassthrough(hashInfo) ? this.getPassthroughCompiler() : this.compilersByMimeType[type || '__lolnothere'];


                if (!compiler) {
                  d('Falling back to passthrough compiler for ' + filePath);
                  compiler = this.fallbackCompiler;
                }

                if (compiler) {
                  _context3.next = 17;
                  break;
                }

                throw new Error('Couldn\'t find a compiler for ' + filePath);

              case 17:
                cache = this.cachesForCompilers.get(compiler);
                _context3.next = 20;
                return cache.getOrFetch(filePath, function (filePath, hashInfo) {
                  return _this2.compileUncached(filePath, hashInfo, compiler);
                });

              case 20:
                return _context3.abrupt('return', _context3.sent);

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fullCompile(_x3) {
        return _ref5.apply(this, arguments);
      }

      return fullCompile;
    }()

    /**
     * Handles invoking compilers independent of caching
     *
     * @private
     */

  }, {
    key: 'compileUncached',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(filePath, hashInfo, compiler) {
        var inputMimeType, ctx, code, dependentFiles, result, shouldInlineHtmlify, isPassthrough;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                inputMimeType = _mimeTypes2.default.lookup(filePath);

                if (!hashInfo.isFileBinary) {
                  _context4.next = 11;
                  break;
                }

                _context4.t0 = hashInfo.binaryData;

                if (_context4.t0) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 6;
                return _promise.pfs.readFile(filePath);

              case 6:
                _context4.t0 = _context4.sent;

              case 7:
                _context4.t1 = _context4.t0;
                _context4.t2 = inputMimeType;
                _context4.t3 = [];
                return _context4.abrupt('return', {
                  binaryData: _context4.t1,
                  mimeType: _context4.t2,
                  dependentFiles: _context4.t3
                });

              case 11:
                ctx = {};
                _context4.t4 = hashInfo.sourceCode;

                if (_context4.t4) {
                  _context4.next = 17;
                  break;
                }

                _context4.next = 16;
                return _promise.pfs.readFile(filePath, 'utf8');

              case 16:
                _context4.t4 = _context4.sent;

              case 17:
                code = _context4.t4;
                _context4.next = 20;
                return compiler.shouldCompileFile(code, ctx);

              case 20:
                if (_context4.sent) {
                  _context4.next = 23;
                  break;
                }

                d('Compiler returned false for shouldCompileFile: ' + filePath);
                return _context4.abrupt('return', { code: code, mimeType: _mimeTypes2.default.lookup(filePath), dependentFiles: [] });

              case 23:
                _context4.next = 25;
                return compiler.determineDependentFiles(code, filePath, ctx);

              case 25:
                dependentFiles = _context4.sent;


                d('Using compiler options: ' + (0, _stringify2.default)(compiler.compilerOptions));
                _context4.next = 29;
                return compiler.compile(code, filePath, ctx);

              case 29:
                result = _context4.sent;
                shouldInlineHtmlify = inputMimeType !== 'text/html' && result.mimeType === 'text/html';
                isPassthrough = result.mimeType === 'text/plain' || !result.mimeType || CompilerHost.shouldPassthrough(hashInfo);

                if (!(finalForms[result.mimeType] && !shouldInlineHtmlify || isPassthrough)) {
                  _context4.next = 36;
                  break;
                }

                return _context4.abrupt('return', (0, _assign2.default)(result, { dependentFiles: dependentFiles }));

              case 36:
                d('Recursively compiling result of ' + filePath + ' with non-final MIME type ' + result.mimeType + ', input was ' + inputMimeType);

                hashInfo = (0, _assign2.default)({ sourceCode: result.code, mimeType: result.mimeType }, hashInfo);
                compiler = this.compilersByMimeType[result.mimeType || '__lolnothere'];

                if (compiler) {
                  _context4.next = 42;
                  break;
                }

                d('Recursive compile failed - intermediate result: ' + (0, _stringify2.default)(result));

                throw new Error('Compiling ' + filePath + ' resulted in a MIME type of ' + result.mimeType + ', which we don\'t know how to handle');

              case 42:
                _context4.next = 44;
                return this.compileUncached(filePath + '.' + _mimeTypes2.default.extension(result.mimeType || 'txt'), hashInfo, compiler);

              case 44:
                return _context4.abrupt('return', _context4.sent);

              case 45:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function compileUncached(_x4, _x5, _x6) {
        return _ref6.apply(this, arguments);
      }

      return compileUncached;
    }()

    /**
     * Pre-caches an entire directory of files recursively. Usually used for
     * building custom compiler tooling.
     *
     * @param  {string} rootDirectory  The top-level directory to compile
     *
     * @param  {Function} shouldCompile (optional)  A Function which allows the
     *                                  caller to disable compiling certain files.
     *                                  It takes a fully-qualified path to a file,
     *                                  and should return a Boolean.
     *
     * @return {Promise}  Completion.
     */

  }, {
    key: 'compileAll',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(rootDirectory) {
        var _this3 = this;

        var shouldCompile = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var should;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                should = shouldCompile || function () {
                  return true;
                };

                _context5.next = 3;
                return (0, _forAllFiles.forAllFiles)(rootDirectory, function (f) {
                  if (!should(f)) return;

                  d('Compiling ' + f);
                  return _this3.compile(f, _this3.compilersByMimeType);
                });

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function compileAll(_x8) {
        return _ref7.apply(this, arguments);
      }

      return compileAll;
    }()

    /*
     * Sync Methods
     */

  }, {
    key: 'compileSync',
    value: function compileSync(filePath) {
      return this.readOnlyMode ? this.compileReadOnlySync(filePath) : this.fullCompileSync(filePath);
    }
  }, {
    key: 'saveConfigurationSync',
    value: function saveConfigurationSync() {
      var _this4 = this;

      var serializedCompilerOpts = (0, _keys2.default)(this.compilersByMimeType).reduce(function (acc, x) {
        var compiler = _this4.compilersByMimeType[x];
        var Klass = (0, _getPrototypeOf2.default)(compiler).constructor;

        var val = {
          name: Klass.name,
          inputMimeTypes: Klass.getInputMimeTypes(),
          compilerOptions: compiler.compilerOptions,
          compilerVersion: compiler.getCompilerVersion()
        };

        acc[x] = val;
        return acc;
      }, {});

      var info = {
        fileChangeCache: this.fileChangeCache.getSavedData(),
        compilers: serializedCompilerOpts
      };

      var target = _path2.default.join(this.rootCacheDir, 'compiler-info.json.gz');
      var buf = _zlib2.default.gzipSync(new Buffer((0, _stringify2.default)(info)));
      _fs2.default.writeFileSync(target, buf);
    }
  }, {
    key: 'compileReadOnlySync',
    value: function compileReadOnlySync(filePath) {
      // We guarantee that node_modules are always shipped directly
      var type = _mimeTypes2.default.lookup(filePath);
      if (_fileChangeCache2.default.isInNodeModules(filePath)) {
        return {
          mimeType: type || 'application/javascript',
          code: _fs2.default.readFileSync(filePath, 'utf8')
        };
      }

      var hashInfo = this.fileChangeCache.getHashForPathSync(filePath);

      // We guarantee that node_modules are always shipped directly
      if (hashInfo.isInNodeModules) {
        return {
          mimeType: type,
          code: hashInfo.sourceCode || _fs2.default.readFileSync(filePath, 'utf8')
        };
      }

      // NB: Here, we're basically only using the compiler here to find
      // the appropriate CompileCache
      var compiler = CompilerHost.shouldPassthrough(hashInfo) ? this.getPassthroughCompiler() : this.compilersByMimeType[type || '__lolnothere'];

      if (!compiler) {
        compiler = this.fallbackCompiler;

        var _compiler$getSync = compiler.getSync(filePath);

        var _code2 = _compiler$getSync.code;
        var _binaryData2 = _compiler$getSync.binaryData;
        var _mimeType2 = _compiler$getSync.mimeType;

        return { code: _code2 || _binaryData2, mimeType: _mimeType2 };
      }

      var cache = this.cachesForCompilers.get(compiler);

      var _cache$getSync = cache.getSync(filePath);

      var code = _cache$getSync.code;
      var binaryData = _cache$getSync.binaryData;
      var mimeType = _cache$getSync.mimeType;


      code = code || binaryData;
      if (!code || !mimeType) {
        throw new Error('Asked to compile ' + filePath + ' in production, is this file not precompiled?');
      }

      return { code: code, mimeType: mimeType };
    }
  }, {
    key: 'fullCompileSync',
    value: function fullCompileSync(filePath) {
      var _this5 = this;

      d('Compiling ' + filePath);

      var hashInfo = this.fileChangeCache.getHashForPathSync(filePath);
      var type = _mimeTypes2.default.lookup(filePath);

      if (hashInfo.isInNodeModules) {
        var code = hashInfo.sourceCode || _fs2.default.readFileSync(filePath, 'utf8');
        return { code: code, mimeType: type };
      }

      var compiler = CompilerHost.shouldPassthrough(hashInfo) ? this.getPassthroughCompiler() : this.compilersByMimeType[type || '__lolnothere'];

      if (!compiler) {
        d('Falling back to passthrough compiler for ' + filePath);
        compiler = this.fallbackCompiler;
      }

      if (!compiler) {
        throw new Error('Couldn\'t find a compiler for ' + filePath);
      }

      var cache = this.cachesForCompilers.get(compiler);
      return cache.getOrFetchSync(filePath, function (filePath, hashInfo) {
        return _this5.compileUncachedSync(filePath, hashInfo, compiler);
      });
    }
  }, {
    key: 'compileUncachedSync',
    value: function compileUncachedSync(filePath, hashInfo, compiler) {
      var inputMimeType = _mimeTypes2.default.lookup(filePath);

      if (hashInfo.isFileBinary) {
        return {
          binaryData: hashInfo.binaryData || _fs2.default.readFileSync(filePath),
          mimeType: inputMimeType,
          dependentFiles: []
        };
      }

      var ctx = {};
      var code = hashInfo.sourceCode || _fs2.default.readFileSync(filePath, 'utf8');

      if (!compiler.shouldCompileFileSync(code, ctx)) {
        d('Compiler returned false for shouldCompileFile: ' + filePath);
        return { code: code, mimeType: _mimeTypes2.default.lookup(filePath), dependentFiles: [] };
      }

      var dependentFiles = compiler.determineDependentFilesSync(code, filePath, ctx);

      var result = compiler.compileSync(code, filePath, ctx);

      var shouldInlineHtmlify = inputMimeType !== 'text/html' && result.mimeType === 'text/html';

      var isPassthrough = result.mimeType === 'text/plain' || !result.mimeType || CompilerHost.shouldPassthrough(hashInfo);

      if (finalForms[result.mimeType] && !shouldInlineHtmlify || isPassthrough) {
        // Got something we can use in-browser, let's return it
        return (0, _assign2.default)(result, { dependentFiles: dependentFiles });
      } else {
        d('Recursively compiling result of ' + filePath + ' with non-final MIME type ' + result.mimeType + ', input was ' + inputMimeType);

        hashInfo = (0, _assign2.default)({ sourceCode: result.code, mimeType: result.mimeType }, hashInfo);
        compiler = this.compilersByMimeType[result.mimeType || '__lolnothere'];

        if (!compiler) {
          d('Recursive compile failed - intermediate result: ' + (0, _stringify2.default)(result));

          throw new Error('Compiling ' + filePath + ' resulted in a MIME type of ' + result.mimeType + ', which we don\'t know how to handle');
        }

        return this.compileUncachedSync(filePath + '.' + _mimeTypes2.default.extension(result.mimeType || 'txt'), hashInfo, compiler);
      }
    }
  }, {
    key: 'compileAllSync',
    value: function compileAllSync(rootDirectory) {
      var _this6 = this;

      var shouldCompile = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var should = shouldCompile || function () {
        return true;
      };

      (0, _forAllFiles.forAllFilesSync)(rootDirectory, function (f) {
        if (!should(f)) return;
        return _this6.compileSync(f, _this6.compilersByMimeType);
      });
    }

    /*
     * Other stuff
     */

    /**
     * Returns the passthrough compiler
     *
     * @private
     */

  }, {
    key: 'getPassthroughCompiler',
    value: function getPassthroughCompiler() {
      return this.compilersByMimeType['text/plain'];
    }

    /**
     * Determines whether we should even try to compile the content. Note that in
     * some cases, content will still be in cache even if this returns true, and
     * in other cases (isInNodeModules), we'll know explicitly to not even bother
     * looking in the cache.
     *
     * @private
     */

  }], [{
    key: 'createReadonlyFromConfiguration',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(rootCacheDir, appRoot) {
        var fallbackCompiler = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var target, buf, info, fileChangeCache, compilers;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                target = _path2.default.join(rootCacheDir, 'compiler-info.json.gz');
                _context6.next = 3;
                return _promise.pfs.readFile(target);

              case 3:
                buf = _context6.sent;
                _context6.t0 = JSON;
                _context6.next = 7;
                return _promise.pzlib.gunzip(buf);

              case 7:
                _context6.t1 = _context6.sent;
                info = _context6.t0.parse.call(_context6.t0, _context6.t1);
                fileChangeCache = _fileChangeCache2.default.loadFromData(info.fileChangeCache, appRoot, true);
                compilers = (0, _keys2.default)(info.compilers).reduce(function (acc, x) {
                  var cur = info.compilers[x];
                  acc[x] = new _readOnlyCompiler2.default(cur.name, cur.compilerVersion, cur.compilerOptions, cur.inputMimeTypes);

                  return acc;
                }, {});
                return _context6.abrupt('return', new CompilerHost(rootCacheDir, compilers, fileChangeCache, true, fallbackCompiler));

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function createReadonlyFromConfiguration(_x11, _x12) {
        return _ref8.apply(this, arguments);
      }

      return createReadonlyFromConfiguration;
    }()

    /**
     * Creates a development-mode CompilerHost from the previously saved
     * configuration.
     *
     * @param  {string} rootCacheDir  The root directory to use for the cache. This
     *                                cache must have cache information saved via
     *                                {@link saveConfiguration}
     *
     * @param  {string} appRoot  The top-level directory for your application (i.e.
     *                           the one which has your package.json).
     *
     * @param  {Object} compilersByMimeType  an Object whose keys are input MIME
     *                                       types and whose values are instances
     *                                       of CompilerBase. Create this via the
     *                                       {@link createCompilers} method in
     *                                       config-parser.
     *
     * @param  {CompilerBase} fallbackCompiler (optional)  When a file is compiled
     *                                         which doesn't have a matching compiler,
     *                                         this compiler will be used instead. If
     *                                         null, will fail compilation. A good
     *                                         alternate fallback is the compiler for
     *                                         'text/plain', which is guaranteed to be
     *                                         present.
     *
     * @return {Promise<CompilerHost>}  A read-only CompilerHost
     */

  }, {
    key: 'createFromConfiguration',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(rootCacheDir, appRoot, compilersByMimeType) {
        var fallbackCompiler = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var target, buf, info, fileChangeCache;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                target = _path2.default.join(rootCacheDir, 'compiler-info.json.gz');
                _context7.next = 3;
                return _promise.pfs.readFile(target);

              case 3:
                buf = _context7.sent;
                _context7.t0 = JSON;
                _context7.next = 7;
                return _promise.pzlib.gunzip(buf);

              case 7:
                _context7.t1 = _context7.sent;
                info = _context7.t0.parse.call(_context7.t0, _context7.t1);
                fileChangeCache = _fileChangeCache2.default.loadFromData(info.fileChangeCache, appRoot, false);


                (0, _keys2.default)(info.compilers).forEach(function (x) {
                  var cur = info.compilers[x];
                  compilersByMimeType[x].compilerOptions = cur.compilerOptions;
                });

                return _context7.abrupt('return', new CompilerHost(rootCacheDir, compilersByMimeType, fileChangeCache, false, fallbackCompiler));

              case 12:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function createFromConfiguration(_x14, _x15, _x16) {
        return _ref9.apply(this, arguments);
      }

      return createFromConfiguration;
    }()
  }, {
    key: 'createReadonlyFromConfigurationSync',
    value: function createReadonlyFromConfigurationSync(rootCacheDir, appRoot) {
      var fallbackCompiler = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var target = _path2.default.join(rootCacheDir, 'compiler-info.json.gz');
      var buf = _fs2.default.readFileSync(target);
      var info = JSON.parse(_zlib2.default.gunzipSync(buf));

      var fileChangeCache = _fileChangeCache2.default.loadFromData(info.fileChangeCache, appRoot, true);

      var compilers = (0, _keys2.default)(info.compilers).reduce(function (acc, x) {
        var cur = info.compilers[x];
        acc[x] = new _readOnlyCompiler2.default(cur.name, cur.compilerVersion, cur.compilerOptions, cur.inputMimeTypes);

        return acc;
      }, {});

      return new CompilerHost(rootCacheDir, compilers, fileChangeCache, true, fallbackCompiler);
    }
  }, {
    key: 'createFromConfigurationSync',
    value: function createFromConfigurationSync(rootCacheDir, appRoot, compilersByMimeType) {
      var fallbackCompiler = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      var target = _path2.default.join(rootCacheDir, 'compiler-info.json.gz');
      var buf = _fs2.default.readFileSync(target);
      var info = JSON.parse(_zlib2.default.gunzipSync(buf));

      var fileChangeCache = _fileChangeCache2.default.loadFromData(info.fileChangeCache, appRoot, false);

      (0, _keys2.default)(info.compilers).forEach(function (x) {
        var cur = info.compilers[x];
        compilersByMimeType[x].compilerOptions = cur.compilerOptions;
      });

      return new CompilerHost(rootCacheDir, compilersByMimeType, fileChangeCache, false, fallbackCompiler);
    }
  }, {
    key: 'shouldPassthrough',
    value: function shouldPassthrough(hashInfo) {
      return hashInfo.isMinified || hashInfo.isInNodeModules || hashInfo.hasSourceMap || hashInfo.isFileBinary;
    }
  }]);
  return CompilerHost;
}();

exports.default = CompilerHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21waWxlci1ob3N0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLElBQUksUUFBUSxnQkFBUixFQUEwQixnQ0FBMUIsQ0FBVjs7QUFFQSxRQUFRLGtCQUFSLEVBQTRCLElBQTVCOztBQUVBO0FBQ0EsSUFBTSxhQUFhO0FBQ2pCLHFCQUFtQixJQURGO0FBRWpCLDRCQUEwQixJQUZUO0FBR2pCLGVBQWEsSUFISTtBQUlqQixjQUFZLElBSks7QUFLakIsbUJBQWlCLElBTEE7QUFNakIsc0JBQW9CO0FBTkgsQ0FBbkI7O0FBU0E7Ozs7Ozs7Ozs7Ozs7OztJQWNxQixZO0FBQ25COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSx3QkFBWSxZQUFaLEVBQTBCLFNBQTFCLEVBQXFDLGVBQXJDLEVBQXNELFlBQXRELEVBQTZGO0FBQUEsUUFBekIsZ0JBQXlCLHlEQUFOLElBQU07QUFBQTs7QUFDM0YsUUFBSSxzQkFBc0Isc0JBQWMsRUFBZCxFQUFrQixTQUFsQixDQUExQjtBQUNBLDBCQUFjLElBQWQsRUFBb0IsRUFBQywwQkFBRCxFQUFlLHdDQUFmLEVBQW9DLGdDQUFwQyxFQUFxRCwwQkFBckQsRUFBbUUsa0NBQW5FLEVBQXBCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBSyxlQUFMLENBQXFCLE9BQXBDOztBQUVBLFNBQUssa0JBQUwsR0FBMEIsb0JBQVksbUJBQVosRUFBaUMsTUFBakMsQ0FBd0MsVUFBQyxHQUFELEVBQU0sQ0FBTixFQUFZO0FBQzVFLFVBQUksV0FBVyxvQkFBb0IsQ0FBcEIsQ0FBZjtBQUNBLFVBQUksSUFBSSxHQUFKLENBQVEsUUFBUixDQUFKLEVBQXVCLE9BQU8sR0FBUDs7QUFFdkIsVUFBSSxHQUFK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QUE0QztBQUFBLFVBQXZCLGdCQUF1Qix5REFBTixJQUFNOztBQUNwRyxVQUFJLFNBQVMsZUFBSyxJQUFMLENBQVUsWUFBVixFQUF3Qix1QkFBeEIsQ0FBYjtBQUNBLFVBQUksTUFBTSxhQUFHLFlBQUgsQ0FBZ0IsTUFBaEIsQ0FBVjtBQUNBLFVBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxlQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBWCxDQUFYOztBQUVBLFVBQUksa0JBQWtCLDBCQUFpQixZQUFqQixDQUE4QixLQUFLLGVBQW5DLEVBQW9ELE9BQXBELEVBQTZELEtBQTdELENBQXRCOztBQUVBLDBCQUFZLEtBQUssU0FBakIsRUFBNEIsT0FBNUIsQ0FBb0MsVUFBQyxDQUFELEVBQU87QUFDekMsWUFBSSxNQUFNLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBVjtBQUNBLDRCQUFvQixDQUFwQixFQUF1QixlQUF2QixHQUF5QyxJQUFJLGVBQTdDO0FBQ0QsT0FIRDs7QUFLQSxhQUFPLElBQUksWUFBSixDQUFpQixZQUFqQixFQUErQixtQkFBL0IsRUFBb0QsZUFBcEQsRUFBcUUsS0FBckUsRUFBNEUsZ0JBQTVFLENBQVA7QUFDRDs7O3NDQTJMd0IsUSxFQUFVO0FBQ2pDLGFBQU8sU0FBUyxVQUFULElBQXVCLFNBQVMsZUFBaEMsSUFBbUQsU0FBUyxZQUE1RCxJQUE0RSxTQUFTLFlBQTVGO0FBQ0Q7Ozs7O2tCQWxqQmtCLFkiLCJmaWxlIjoiY29tcGlsZXItaG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtaW1lVHlwZXMgZnJvbSAnQHBhdWxjYmV0dHMvbWltZS10eXBlcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7cGZzLCBwemxpYn0gZnJvbSAnLi9wcm9taXNlJztcblxuaW1wb3J0IHtmb3JBbGxGaWxlcywgZm9yQWxsRmlsZXNTeW5jfSBmcm9tICcuL2Zvci1hbGwtZmlsZXMnO1xuaW1wb3J0IENvbXBpbGVDYWNoZSBmcm9tICcuL2NvbXBpbGUtY2FjaGUnO1xuaW1wb3J0IEZpbGVDaGFuZ2VkQ2FjaGUgZnJvbSAnLi9maWxlLWNoYW5nZS1jYWNoZSc7XG5pbXBvcnQgUmVhZE9ubHlDb21waWxlciBmcm9tICcuL3JlYWQtb25seS1jb21waWxlcic7XG5cbmNvbnN0IGQgPSByZXF1aXJlKCdkZWJ1Zy1lbGVjdHJvbicpKCdlbGVjdHJvbi1jb21waWxlOmNvbXBpbGVyLWhvc3QnKTtcblxucmVxdWlyZSgnLi9yaWctbWltZS10eXBlcycpLmluaXQoKTtcblxuLy8gVGhpcyBpc24ndCBldmVuIG15XG5jb25zdCBmaW5hbEZvcm1zID0ge1xuICAndGV4dC9qYXZhc2NyaXB0JzogdHJ1ZSxcbiAgJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnOiB0cnVlLFxuICAndGV4dC9odG1sJzogdHJ1ZSxcbiAgJ3RleHQvY3NzJzogdHJ1ZSxcbiAgJ2ltYWdlL3N2Zyt4bWwnOiB0cnVlLFxuICAnYXBwbGljYXRpb24vanNvbic6IHRydWVcbn07XG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyB0aGUgdG9wLWxldmVsIGNsYXNzIHRoYXQgZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgbG9naWMgb2ZcbiAqIGNvbXBpbGluZyBhbmQgY2FjaGluZyBhcHBsaWNhdGlvbiBjb2RlLiBJZiB5b3UncmUgbG9va2luZyBmb3IgYSBcIk1haW4gY2xhc3NcIixcbiAqIHRoaXMgaXMgaXQuXG4gKlxuICogVGhpcyBjbGFzcyBjYW4gYmUgY3JlYXRlZCBkaXJlY3RseSBidXQgaXQgaXMgdXN1YWxseSBjcmVhdGVkIHZpYSB0aGUgbWV0aG9kc1xuICogaW4gY29uZmlnLXBhcnNlciwgd2hpY2ggd2lsbCBhbW9uZyBvdGhlciB0aGluZ3MsIHNldCB1cCB0aGUgY29tcGlsZXIgb3B0aW9uc1xuICogZ2l2ZW4gYSBwcm9qZWN0IHJvb3QuXG4gKlxuICogQ29tcGlsZXJIb3N0IGlzIGFsc28gdGhlIHRvcC1sZXZlbCBjbGFzcyB0aGF0IGtub3dzIGhvdyB0byBzZXJpYWxpemUgYWxsIG9mIHRoZVxuICogaW5mb3JtYXRpb24gbmVjZXNzYXJ5IHRvIHJlY3JlYXRlIGl0c2VsZiwgZWl0aGVyIGFzIGEgZGV2ZWxvcG1lbnQgaG9zdCAoaS5lLlxuICogd2lsbCBhbGxvdyBjYWNoZSBtaXNzZXMgYW5kIGFjdHVhbCBjb21waWxhdGlvbiksIG9yIGFzIGEgcmVhZC1vbmx5IHZlcnNpb24gb2ZcbiAqIGl0c2VsZiBmb3IgcHJvZHVjdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGlsZXJIb3N0IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQ29tcGlsZXJIb3N0LiBZb3UgcHJvYmFibHkgd2FudCB0byB1c2UgdGhlIG1ldGhvZHNcbiAgICogaW4gY29uZmlnLXBhcnNlciBmb3IgZGV2ZWxvcG1lbnQsIG9yIHtAbGluayBjcmVhdGVSZWFkb25seUZyb21Db25maWd1cmF0aW9ufVxuICAgKiBmb3IgcHJvZHVjdGlvbiBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHJvb3RDYWNoZURpciAgVGhlIHJvb3QgZGlyZWN0b3J5IHRvIHVzZSBmb3IgdGhlIGNhY2hlXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gY29tcGlsZXJzICBhbiBPYmplY3Qgd2hvc2Uga2V5cyBhcmUgaW5wdXQgTUlNRSB0eXBlcyBhbmRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdob3NlIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIENvbXBpbGVyQmFzZS4gQ3JlYXRlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIHZpYSB0aGUge0BsaW5rIGNyZWF0ZUNvbXBpbGVyc30gbWV0aG9kIGluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWctcGFyc2VyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtGaWxlQ2hhbmdlZENhY2hlfSBmaWxlQ2hhbmdlQ2FjaGUgIEEgZmlsZS1jaGFuZ2UgY2FjaGUgdGhhdCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsbHkgcHJlLWxvYWRlZC5cbiAgICpcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gcmVhZE9ubHlNb2RlICBJZiBUcnVlLCBjYWNoZSBtaXNzZXMgd2lsbCBmYWlsIGFuZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGF0aW9uIHdpbGwgbm90IGJlIGF0dGVtcHRlZC5cbiAgICpcbiAgICogQHBhcmFtICB7Q29tcGlsZXJCYXNlfSBmYWxsYmFja0NvbXBpbGVyIChvcHRpb25hbCkgIFdoZW4gYSBmaWxlIGlzIGNvbXBpbGVkXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBkb2Vzbid0IGhhdmUgYSBtYXRjaGluZyBjb21waWxlcixcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgY29tcGlsZXIgd2lsbCBiZSB1c2VkIGluc3RlYWQuIElmXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLCB3aWxsIGZhaWwgY29tcGlsYXRpb24uIEEgZ29vZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0ZXJuYXRlIGZhbGxiYWNrIGlzIHRoZSBjb21waWxlciBmb3JcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0L3BsYWluJywgd2hpY2ggaXMgZ3VhcmFudGVlZCB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlc2VudC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHJvb3RDYWNoZURpciwgY29tcGlsZXJzLCBmaWxlQ2hhbmdlQ2FjaGUsIHJlYWRPbmx5TW9kZSwgZmFsbGJhY2tDb21waWxlciA9IG51bGwpIHtcbiAgICBsZXQgY29tcGlsZXJzQnlNaW1lVHlwZSA9IE9iamVjdC5hc3NpZ24oe30sIGNvbXBpbGVycyk7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7cm9vdENhY2hlRGlyLCBjb21waWxlcnNCeU1pbWVUeXBlLCBmaWxlQ2hhbmdlQ2FjaGUsIHJlYWRPbmx5TW9kZSwgZmFsbGJhY2tDb21waWxlcn0pO1xuICAgIHRoaXMuYXBwUm9vdCA9IHRoaXMuZmlsZUNoYW5nZUNhY2hlLmFwcFJvb3Q7XG5cbiAgICB0aGlzLmNhY2hlc0ZvckNvbXBpbGVycyA9IE9iamVjdC5rZXlzKGNvbXBpbGVyc0J5TWltZVR5cGUpLnJlZHVjZSgoYWNjLCB4KSA9PiB7XG4gICAgICBsZXQgY29tcGlsZXIgPSBjb21waWxlcnNCeU1pbWVUeXBlW3hdO1xuICAgICAgaWYgKGFjYy5oYXMoY29tcGlsZXIpKSByZXR1cm4gYWNjO1xuXG4gICAgICBhY2Muc2V0KFxuICAgICAgICBjb21waWxlcixcbiAgICAgICAgQ29tcGlsZUNhY2hlLmNyZWF0ZUZyb21Db21waWxlcihyb290Q2FjaGVEaXIsIGNvbXBpbGVyLCBmaWxlQ2hhbmdlQ2FjaGUsIHJlYWRPbmx5TW9kZSkpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBuZXcgTWFwKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBwcm9kdWN0aW9uLW1vZGUgQ29tcGlsZXJIb3N0IGZyb20gdGhlIHByZXZpb3VzbHkgc2F2ZWRcbiAgICogY29uZmlndXJhdGlvblxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHJvb3RDYWNoZURpciAgVGhlIHJvb3QgZGlyZWN0b3J5IHRvIHVzZSBmb3IgdGhlIGNhY2hlLiBUaGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZSBtdXN0IGhhdmUgY2FjaGUgaW5mb3JtYXRpb24gc2F2ZWQgdmlhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7QGxpbmsgc2F2ZUNvbmZpZ3VyYXRpb259XG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYXBwUm9vdCAgVGhlIHRvcC1sZXZlbCBkaXJlY3RvcnkgZm9yIHlvdXIgYXBwbGljYXRpb24gKGkuZS5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgb25lIHdoaWNoIGhhcyB5b3VyIHBhY2thZ2UuanNvbikuXG4gICAqXG4gICAqIEBwYXJhbSAge0NvbXBpbGVyQmFzZX0gZmFsbGJhY2tDb21waWxlciAob3B0aW9uYWwpICBXaGVuIGEgZmlsZSBpcyBjb21waWxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggZG9lc24ndCBoYXZlIGEgbWF0Y2hpbmcgY29tcGlsZXIsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGNvbXBpbGVyIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLiBJZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCwgd2lsbCBmYWlsIGNvbXBpbGF0aW9uLiBBIGdvb2RcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdGVybmF0ZSBmYWxsYmFjayBpcyB0aGUgY29tcGlsZXIgZm9yXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dC9wbGFpbicsIHdoaWNoIGlzIGd1YXJhbnRlZWQgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXNlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8Q29tcGlsZXJIb3N0Pn0gIEEgcmVhZC1vbmx5IENvbXBpbGVySG9zdFxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZVJlYWRvbmx5RnJvbUNvbmZpZ3VyYXRpb24ocm9vdENhY2hlRGlyLCBhcHBSb290LCBmYWxsYmFja0NvbXBpbGVyPW51bGwpIHtcbiAgICBsZXQgdGFyZ2V0ID0gcGF0aC5qb2luKHJvb3RDYWNoZURpciwgJ2NvbXBpbGVyLWluZm8uanNvbi5neicpO1xuICAgIGxldCBidWYgPSBhd2FpdCBwZnMucmVhZEZpbGUodGFyZ2V0KTtcbiAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoYXdhaXQgcHpsaWIuZ3VuemlwKGJ1ZikpO1xuXG4gICAgbGV0IGZpbGVDaGFuZ2VDYWNoZSA9IEZpbGVDaGFuZ2VkQ2FjaGUubG9hZEZyb21EYXRhKGluZm8uZmlsZUNoYW5nZUNhY2hlLCBhcHBSb290LCB0cnVlKTtcblxuICAgIGxldCBjb21waWxlcnMgPSBPYmplY3Qua2V5cyhpbmZvLmNvbXBpbGVycykucmVkdWNlKChhY2MsIHgpID0+IHtcbiAgICAgIGxldCBjdXIgPSBpbmZvLmNvbXBpbGVyc1t4XTtcbiAgICAgIGFjY1t4XSA9IG5ldyBSZWFkT25seUNvbXBpbGVyKGN1ci5uYW1lLCBjdXIuY29tcGlsZXJWZXJzaW9uLCBjdXIuY29tcGlsZXJPcHRpb25zLCBjdXIuaW5wdXRNaW1lVHlwZXMpO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiBuZXcgQ29tcGlsZXJIb3N0KHJvb3RDYWNoZURpciwgY29tcGlsZXJzLCBmaWxlQ2hhbmdlQ2FjaGUsIHRydWUsIGZhbGxiYWNrQ29tcGlsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBkZXZlbG9wbWVudC1tb2RlIENvbXBpbGVySG9zdCBmcm9tIHRoZSBwcmV2aW91c2x5IHNhdmVkXG4gICAqIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gcm9vdENhY2hlRGlyICBUaGUgcm9vdCBkaXJlY3RvcnkgdG8gdXNlIGZvciB0aGUgY2FjaGUuIFRoaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlIG11c3QgaGF2ZSBjYWNoZSBpbmZvcm1hdGlvbiBzYXZlZCB2aWFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtAbGluayBzYXZlQ29uZmlndXJhdGlvbn1cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBhcHBSb290ICBUaGUgdG9wLWxldmVsIGRpcmVjdG9yeSBmb3IgeW91ciBhcHBsaWNhdGlvbiAoaS5lLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBvbmUgd2hpY2ggaGFzIHlvdXIgcGFja2FnZS5qc29uKS5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBjb21waWxlcnNCeU1pbWVUeXBlICBhbiBPYmplY3Qgd2hvc2Uga2V5cyBhcmUgaW5wdXQgTUlNRVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzIGFuZCB3aG9zZSB2YWx1ZXMgYXJlIGluc3RhbmNlc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIENvbXBpbGVyQmFzZS4gQ3JlYXRlIHRoaXMgdmlhIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtAbGluayBjcmVhdGVDb21waWxlcnN9IG1ldGhvZCBpblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy1wYXJzZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge0NvbXBpbGVyQmFzZX0gZmFsbGJhY2tDb21waWxlciAob3B0aW9uYWwpICBXaGVuIGEgZmlsZSBpcyBjb21waWxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggZG9lc24ndCBoYXZlIGEgbWF0Y2hpbmcgY29tcGlsZXIsXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGNvbXBpbGVyIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLiBJZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCwgd2lsbCBmYWlsIGNvbXBpbGF0aW9uLiBBIGdvb2RcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdGVybmF0ZSBmYWxsYmFjayBpcyB0aGUgY29tcGlsZXIgZm9yXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dC9wbGFpbicsIHdoaWNoIGlzIGd1YXJhbnRlZWQgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXNlbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8Q29tcGlsZXJIb3N0Pn0gIEEgcmVhZC1vbmx5IENvbXBpbGVySG9zdFxuICAgKi9cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZUZyb21Db25maWd1cmF0aW9uKHJvb3RDYWNoZURpciwgYXBwUm9vdCwgY29tcGlsZXJzQnlNaW1lVHlwZSwgZmFsbGJhY2tDb21waWxlcj1udWxsKSB7XG4gICAgbGV0IHRhcmdldCA9IHBhdGguam9pbihyb290Q2FjaGVEaXIsICdjb21waWxlci1pbmZvLmpzb24uZ3onKTtcbiAgICBsZXQgYnVmID0gYXdhaXQgcGZzLnJlYWRGaWxlKHRhcmdldCk7XG4gICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGF3YWl0IHB6bGliLmd1bnppcChidWYpKTtcblxuICAgIGxldCBmaWxlQ2hhbmdlQ2FjaGUgPSBGaWxlQ2hhbmdlZENhY2hlLmxvYWRGcm9tRGF0YShpbmZvLmZpbGVDaGFuZ2VDYWNoZSwgYXBwUm9vdCwgZmFsc2UpO1xuXG4gICAgT2JqZWN0LmtleXMoaW5mby5jb21waWxlcnMpLmZvckVhY2goKHgpID0+IHtcbiAgICAgIGxldCBjdXIgPSBpbmZvLmNvbXBpbGVyc1t4XTtcbiAgICAgIGNvbXBpbGVyc0J5TWltZVR5cGVbeF0uY29tcGlsZXJPcHRpb25zID0gY3VyLmNvbXBpbGVyT3B0aW9ucztcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgQ29tcGlsZXJIb3N0KHJvb3RDYWNoZURpciwgY29tcGlsZXJzQnlNaW1lVHlwZSwgZmlsZUNoYW5nZUNhY2hlLCBmYWxzZSwgZmFsbGJhY2tDb21waWxlcik7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTYXZlcyB0aGUgY3VycmVudCBjb21waWxlciBjb25maWd1cmF0aW9uIHRvIGEgZmlsZSB0aGF0XG4gICAqIHtAbGluayBjcmVhdGVSZWFkb25seUZyb21Db25maWd1cmF0aW9ufSBjYW4gdXNlIHRvIHJlY3JlYXRlIHRoZSBjdXJyZW50XG4gICAqIGNvbXBpbGVyIGVudmlyb25tZW50XG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICBDb21wbGV0aW9uXG4gICAqL1xuICBhc3luYyBzYXZlQ29uZmlndXJhdGlvbigpIHtcbiAgICBsZXQgc2VyaWFsaXplZENvbXBpbGVyT3B0cyA9IE9iamVjdC5rZXlzKHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZSkucmVkdWNlKChhY2MsIHgpID0+IHtcbiAgICAgIGxldCBjb21waWxlciA9IHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZVt4XTtcbiAgICAgIGxldCBLbGFzcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb21waWxlcikuY29uc3RydWN0b3I7XG5cbiAgICAgIGxldCB2YWwgPSB7XG4gICAgICAgIG5hbWU6IEtsYXNzLm5hbWUsXG4gICAgICAgIGlucHV0TWltZVR5cGVzOiBLbGFzcy5nZXRJbnB1dE1pbWVUeXBlcygpLFxuICAgICAgICBjb21waWxlck9wdGlvbnM6IGNvbXBpbGVyLmNvbXBpbGVyT3B0aW9ucyxcbiAgICAgICAgY29tcGlsZXJWZXJzaW9uOiBjb21waWxlci5nZXRDb21waWxlclZlcnNpb24oKVxuICAgICAgfTtcblxuICAgICAgYWNjW3hdID0gdmFsO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG5cbiAgICBsZXQgaW5mbyA9IHtcbiAgICAgIGZpbGVDaGFuZ2VDYWNoZTogdGhpcy5maWxlQ2hhbmdlQ2FjaGUuZ2V0U2F2ZWREYXRhKCksXG4gICAgICBjb21waWxlcnM6IHNlcmlhbGl6ZWRDb21waWxlck9wdHNcbiAgICB9O1xuXG4gICAgbGV0IHRhcmdldCA9IHBhdGguam9pbih0aGlzLnJvb3RDYWNoZURpciwgJ2NvbXBpbGVyLWluZm8uanNvbi5neicpO1xuICAgIGxldCBidWYgPSBhd2FpdCBwemxpYi5nemlwKG5ldyBCdWZmZXIoSlNPTi5zdHJpbmdpZnkoaW5mbykpKTtcbiAgICBhd2FpdCBwZnMud3JpdGVGaWxlKHRhcmdldCwgYnVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21waWxlcyBhIGZpbGUgYW5kIHJldHVybnMgdGhlIGNvbXBpbGVkIHJlc3VsdC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBmaWxlUGF0aCAgVGhlIHBhdGggdG8gdGhlIGZpbGUgdG8gY29tcGlsZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPG9iamVjdD59ICBBbiBPYmplY3Qgd2l0aCB0aGUgY29tcGlsZWQgcmVzdWx0XG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoYXNoSW5mbyAgVGhlIGhhc2ggaW5mb3JtYXRpb24gcmV0dXJuZWQgZnJvbSBnZXRIYXNoRm9yUGF0aFxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29kZSAgVGhlIHNvdXJjZSBjb2RlIGlmIHRoZSBmaWxlIHdhcyBhIHRleHQgZmlsZVxuICAgKiBAcHJvcGVydHkge0J1ZmZlcn0gYmluYXJ5RGF0YSAgVGhlIGZpbGUgaWYgaXQgd2FzIGEgYmluYXJ5IGZpbGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IG1pbWVUeXBlICBUaGUgTUlNRSB0eXBlIHNhdmVkIGluIHRoZSBjYWNoZS5cbiAgICogQHByb3BlcnR5IHtzdHJpbmdbXX0gZGVwZW5kZW50RmlsZXMgIFRoZSBkZXBlbmRlbnQgZmlsZXMgcmV0dXJuZWQgZnJvbVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsaW5nIHRoZSBmaWxlLCBpZiBhbnkuXG4gICAqL1xuICBjb21waWxlKGZpbGVQYXRoKSB7XG4gICAgcmV0dXJuICh0aGlzLnJlYWRPbmx5TW9kZSA/IHRoaXMuY29tcGlsZVJlYWRPbmx5KGZpbGVQYXRoKSA6IHRoaXMuZnVsbENvbXBpbGUoZmlsZVBhdGgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgY29tcGlsYXRpb24gaW4gcmVhZC1vbmx5IG1vZGVcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFzeW5jIGNvbXBpbGVSZWFkT25seShmaWxlUGF0aCkge1xuICAgIC8vIFdlIGd1YXJhbnRlZSB0aGF0IG5vZGVfbW9kdWxlcyBhcmUgYWx3YXlzIHNoaXBwZWQgZGlyZWN0bHlcbiAgICBsZXQgdHlwZSA9IG1pbWVUeXBlcy5sb29rdXAoZmlsZVBhdGgpO1xuICAgIGlmIChGaWxlQ2hhbmdlZENhY2hlLmlzSW5Ob2RlTW9kdWxlcyhmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbWVUeXBlOiB0eXBlIHx8ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICAgICAgY29kZTogYXdhaXQgcGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICB9O1xuICAgIH1cblxuICAgIGxldCBoYXNoSW5mbyA9IGF3YWl0IHRoaXMuZmlsZUNoYW5nZUNhY2hlLmdldEhhc2hGb3JQYXRoKGZpbGVQYXRoKTtcblxuICAgIC8vIE5COiBIZXJlLCB3ZSdyZSBiYXNpY2FsbHkgb25seSB1c2luZyB0aGUgY29tcGlsZXIgaGVyZSB0byBmaW5kXG4gICAgLy8gdGhlIGFwcHJvcHJpYXRlIENvbXBpbGVDYWNoZVxuICAgIGxldCBjb21waWxlciA9IENvbXBpbGVySG9zdC5zaG91bGRQYXNzdGhyb3VnaChoYXNoSW5mbykgP1xuICAgICAgdGhpcy5nZXRQYXNzdGhyb3VnaENvbXBpbGVyKCkgOlxuICAgICAgdGhpcy5jb21waWxlcnNCeU1pbWVUeXBlW3R5cGUgfHwgJ19fbG9sbm90aGVyZSddO1xuXG4gICAgaWYgKCFjb21waWxlcikge1xuICAgICAgY29tcGlsZXIgPSB0aGlzLmZhbGxiYWNrQ29tcGlsZXI7XG5cbiAgICAgIGxldCB7IGNvZGUsIGJpbmFyeURhdGEsIG1pbWVUeXBlIH0gPSBhd2FpdCBjb21waWxlci5nZXQoZmlsZVBhdGgpO1xuICAgICAgcmV0dXJuIHsgY29kZTogY29kZSB8fCBiaW5hcnlEYXRhLCBtaW1lVHlwZSB9O1xuICAgIH1cblxuICAgIGxldCBjYWNoZSA9IHRoaXMuY2FjaGVzRm9yQ29tcGlsZXJzLmdldChjb21waWxlcik7XG4gICAgbGV0IHtjb2RlLCBiaW5hcnlEYXRhLCBtaW1lVHlwZX0gPSBhd2FpdCBjYWNoZS5nZXQoZmlsZVBhdGgpO1xuXG4gICAgY29kZSA9IGNvZGUgfHwgYmluYXJ5RGF0YTtcbiAgICBpZiAoIWNvZGUgfHwgIW1pbWVUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFza2VkIHRvIGNvbXBpbGUgJHtmaWxlUGF0aH0gaW4gcHJvZHVjdGlvbiwgaXMgdGhpcyBmaWxlIG5vdCBwcmVjb21waWxlZD9gKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBjb2RlLCBtaW1lVHlwZSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgY29tcGlsYXRpb24gaW4gcmVhZC13cml0ZSBtb2RlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhc3luYyBmdWxsQ29tcGlsZShmaWxlUGF0aCkge1xuICAgIGQoYENvbXBpbGluZyAke2ZpbGVQYXRofWApO1xuXG4gICAgbGV0IGhhc2hJbmZvID0gYXdhaXQgdGhpcy5maWxlQ2hhbmdlQ2FjaGUuZ2V0SGFzaEZvclBhdGgoZmlsZVBhdGgpO1xuICAgIGxldCB0eXBlID0gbWltZVR5cGVzLmxvb2t1cChmaWxlUGF0aCk7XG5cbiAgICBpZiAoaGFzaEluZm8uaXNJbk5vZGVNb2R1bGVzKSB7XG4gICAgICBsZXQgY29kZSA9IGhhc2hJbmZvLnNvdXJjZUNvZGUgfHwgYXdhaXQgcGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgcmV0dXJuIHsgY29kZSwgbWltZVR5cGU6IHR5cGUgfTtcbiAgICB9XG5cbiAgICBsZXQgY29tcGlsZXIgPSBDb21waWxlckhvc3Quc2hvdWxkUGFzc3Rocm91Z2goaGFzaEluZm8pID9cbiAgICAgIHRoaXMuZ2V0UGFzc3Rocm91Z2hDb21waWxlcigpIDpcbiAgICAgIHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZVt0eXBlIHx8ICdfX2xvbG5vdGhlcmUnXTtcblxuICAgIGlmICghY29tcGlsZXIpIHtcbiAgICAgIGQoYEZhbGxpbmcgYmFjayB0byBwYXNzdGhyb3VnaCBjb21waWxlciBmb3IgJHtmaWxlUGF0aH1gKTtcbiAgICAgIGNvbXBpbGVyID0gdGhpcy5mYWxsYmFja0NvbXBpbGVyO1xuICAgIH1cblxuICAgIGlmICghY29tcGlsZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBhIGNvbXBpbGVyIGZvciAke2ZpbGVQYXRofWApO1xuICAgIH1cblxuICAgIGxldCBjYWNoZSA9IHRoaXMuY2FjaGVzRm9yQ29tcGlsZXJzLmdldChjb21waWxlcik7XG4gICAgcmV0dXJuIGF3YWl0IGNhY2hlLmdldE9yRmV0Y2goXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIChmaWxlUGF0aCwgaGFzaEluZm8pID0+IHRoaXMuY29tcGlsZVVuY2FjaGVkKGZpbGVQYXRoLCBoYXNoSW5mbywgY29tcGlsZXIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIGludm9raW5nIGNvbXBpbGVycyBpbmRlcGVuZGVudCBvZiBjYWNoaW5nXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhc3luYyBjb21waWxlVW5jYWNoZWQoZmlsZVBhdGgsIGhhc2hJbmZvLCBjb21waWxlcikge1xuICAgIGxldCBpbnB1dE1pbWVUeXBlID0gbWltZVR5cGVzLmxvb2t1cChmaWxlUGF0aCk7XG5cbiAgICBpZiAoaGFzaEluZm8uaXNGaWxlQmluYXJ5KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBiaW5hcnlEYXRhOiBoYXNoSW5mby5iaW5hcnlEYXRhIHx8IGF3YWl0IHBmcy5yZWFkRmlsZShmaWxlUGF0aCksXG4gICAgICAgIG1pbWVUeXBlOiBpbnB1dE1pbWVUeXBlLFxuICAgICAgICBkZXBlbmRlbnRGaWxlczogW11cbiAgICAgIH07XG4gICAgfVxuXG4gICAgbGV0IGN0eCA9IHt9O1xuICAgIGxldCBjb2RlID0gaGFzaEluZm8uc291cmNlQ29kZSB8fCBhd2FpdCBwZnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGY4Jyk7XG5cbiAgICBpZiAoIShhd2FpdCBjb21waWxlci5zaG91bGRDb21waWxlRmlsZShjb2RlLCBjdHgpKSkge1xuICAgICAgZChgQ29tcGlsZXIgcmV0dXJuZWQgZmFsc2UgZm9yIHNob3VsZENvbXBpbGVGaWxlOiAke2ZpbGVQYXRofWApO1xuICAgICAgcmV0dXJuIHsgY29kZSwgbWltZVR5cGU6IG1pbWVUeXBlcy5sb29rdXAoZmlsZVBhdGgpLCBkZXBlbmRlbnRGaWxlczogW10gfTtcbiAgICB9XG5cbiAgICBsZXQgZGVwZW5kZW50RmlsZXMgPSBhd2FpdCBjb21waWxlci5kZXRlcm1pbmVEZXBlbmRlbnRGaWxlcyhjb2RlLCBmaWxlUGF0aCwgY3R4KTtcblxuICAgIGQoYFVzaW5nIGNvbXBpbGVyIG9wdGlvbnM6ICR7SlNPTi5zdHJpbmdpZnkoY29tcGlsZXIuY29tcGlsZXJPcHRpb25zKX1gKTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgY29tcGlsZXIuY29tcGlsZShjb2RlLCBmaWxlUGF0aCwgY3R4KTtcblxuICAgIGxldCBzaG91bGRJbmxpbmVIdG1saWZ5ID1cbiAgICAgIGlucHV0TWltZVR5cGUgIT09ICd0ZXh0L2h0bWwnICYmXG4gICAgICByZXN1bHQubWltZVR5cGUgPT09ICd0ZXh0L2h0bWwnO1xuXG4gICAgbGV0IGlzUGFzc3Rocm91Z2ggPVxuICAgICAgcmVzdWx0Lm1pbWVUeXBlID09PSAndGV4dC9wbGFpbicgfHxcbiAgICAgICFyZXN1bHQubWltZVR5cGUgfHxcbiAgICAgIENvbXBpbGVySG9zdC5zaG91bGRQYXNzdGhyb3VnaChoYXNoSW5mbyk7XG5cbiAgICBpZiAoKGZpbmFsRm9ybXNbcmVzdWx0Lm1pbWVUeXBlXSAmJiAhc2hvdWxkSW5saW5lSHRtbGlmeSkgfHwgaXNQYXNzdGhyb3VnaCkge1xuICAgICAgLy8gR290IHNvbWV0aGluZyB3ZSBjYW4gdXNlIGluLWJyb3dzZXIsIGxldCdzIHJldHVybiBpdFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7ZGVwZW5kZW50RmlsZXN9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZChgUmVjdXJzaXZlbHkgY29tcGlsaW5nIHJlc3VsdCBvZiAke2ZpbGVQYXRofSB3aXRoIG5vbi1maW5hbCBNSU1FIHR5cGUgJHtyZXN1bHQubWltZVR5cGV9LCBpbnB1dCB3YXMgJHtpbnB1dE1pbWVUeXBlfWApO1xuXG4gICAgICBoYXNoSW5mbyA9IE9iamVjdC5hc3NpZ24oeyBzb3VyY2VDb2RlOiByZXN1bHQuY29kZSwgbWltZVR5cGU6IHJlc3VsdC5taW1lVHlwZSB9LCBoYXNoSW5mbyk7XG4gICAgICBjb21waWxlciA9IHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZVtyZXN1bHQubWltZVR5cGUgfHwgJ19fbG9sbm90aGVyZSddO1xuXG4gICAgICBpZiAoIWNvbXBpbGVyKSB7XG4gICAgICAgIGQoYFJlY3Vyc2l2ZSBjb21waWxlIGZhaWxlZCAtIGludGVybWVkaWF0ZSByZXN1bHQ6ICR7SlNPTi5zdHJpbmdpZnkocmVzdWx0KX1gKTtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGluZyAke2ZpbGVQYXRofSByZXN1bHRlZCBpbiBhIE1JTUUgdHlwZSBvZiAke3Jlc3VsdC5taW1lVHlwZX0sIHdoaWNoIHdlIGRvbid0IGtub3cgaG93IHRvIGhhbmRsZWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5jb21waWxlVW5jYWNoZWQoXG4gICAgICAgIGAke2ZpbGVQYXRofS4ke21pbWVUeXBlcy5leHRlbnNpb24ocmVzdWx0Lm1pbWVUeXBlIHx8ICd0eHQnKX1gLFxuICAgICAgICBoYXNoSW5mbywgY29tcGlsZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcmUtY2FjaGVzIGFuIGVudGlyZSBkaXJlY3Rvcnkgb2YgZmlsZXMgcmVjdXJzaXZlbHkuIFVzdWFsbHkgdXNlZCBmb3JcbiAgICogYnVpbGRpbmcgY3VzdG9tIGNvbXBpbGVyIHRvb2xpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gcm9vdERpcmVjdG9yeSAgVGhlIHRvcC1sZXZlbCBkaXJlY3RvcnkgdG8gY29tcGlsZVxuICAgKlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gc2hvdWxkQ29tcGlsZSAob3B0aW9uYWwpICBBIEZ1bmN0aW9uIHdoaWNoIGFsbG93cyB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGVyIHRvIGRpc2FibGUgY29tcGlsaW5nIGNlcnRhaW4gZmlsZXMuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEl0IHRha2VzIGEgZnVsbHktcXVhbGlmaWVkIHBhdGggdG8gYSBmaWxlLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgc2hvdWxkIHJldHVybiBhIEJvb2xlYW4uXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICBDb21wbGV0aW9uLlxuICAgKi9cbiAgYXN5bmMgY29tcGlsZUFsbChyb290RGlyZWN0b3J5LCBzaG91bGRDb21waWxlPW51bGwpIHtcbiAgICBsZXQgc2hvdWxkID0gc2hvdWxkQ29tcGlsZSB8fCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9O1xuXG4gICAgYXdhaXQgZm9yQWxsRmlsZXMocm9vdERpcmVjdG9yeSwgKGYpID0+IHtcbiAgICAgIGlmICghc2hvdWxkKGYpKSByZXR1cm47XG5cbiAgICAgIGQoYENvbXBpbGluZyAke2Z9YCk7XG4gICAgICByZXR1cm4gdGhpcy5jb21waWxlKGYsIHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKlxuICAgKiBTeW5jIE1ldGhvZHNcbiAgICovXG5cbiAgY29tcGlsZVN5bmMoZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gKHRoaXMucmVhZE9ubHlNb2RlID8gdGhpcy5jb21waWxlUmVhZE9ubHlTeW5jKGZpbGVQYXRoKSA6IHRoaXMuZnVsbENvbXBpbGVTeW5jKGZpbGVQYXRoKSk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlUmVhZG9ubHlGcm9tQ29uZmlndXJhdGlvblN5bmMocm9vdENhY2hlRGlyLCBhcHBSb290LCBmYWxsYmFja0NvbXBpbGVyPW51bGwpIHtcbiAgICBsZXQgdGFyZ2V0ID0gcGF0aC5qb2luKHJvb3RDYWNoZURpciwgJ2NvbXBpbGVyLWluZm8uanNvbi5neicpO1xuICAgIGxldCBidWYgPSBmcy5yZWFkRmlsZVN5bmModGFyZ2V0KTtcbiAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoemxpYi5ndW56aXBTeW5jKGJ1ZikpO1xuXG4gICAgbGV0IGZpbGVDaGFuZ2VDYWNoZSA9IEZpbGVDaGFuZ2VkQ2FjaGUubG9hZEZyb21EYXRhKGluZm8uZmlsZUNoYW5nZUNhY2hlLCBhcHBSb290LCB0cnVlKTtcblxuICAgIGxldCBjb21waWxlcnMgPSBPYmplY3Qua2V5cyhpbmZvLmNvbXBpbGVycykucmVkdWNlKChhY2MsIHgpID0+IHtcbiAgICAgIGxldCBjdXIgPSBpbmZvLmNvbXBpbGVyc1t4XTtcbiAgICAgIGFjY1t4XSA9IG5ldyBSZWFkT25seUNvbXBpbGVyKGN1ci5uYW1lLCBjdXIuY29tcGlsZXJWZXJzaW9uLCBjdXIuY29tcGlsZXJPcHRpb25zLCBjdXIuaW5wdXRNaW1lVHlwZXMpO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICAgIHJldHVybiBuZXcgQ29tcGlsZXJIb3N0KHJvb3RDYWNoZURpciwgY29tcGlsZXJzLCBmaWxlQ2hhbmdlQ2FjaGUsIHRydWUsIGZhbGxiYWNrQ29tcGlsZXIpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21Db25maWd1cmF0aW9uU3luYyhyb290Q2FjaGVEaXIsIGFwcFJvb3QsIGNvbXBpbGVyc0J5TWltZVR5cGUsIGZhbGxiYWNrQ29tcGlsZXI9bnVsbCkge1xuICAgIGxldCB0YXJnZXQgPSBwYXRoLmpvaW4ocm9vdENhY2hlRGlyLCAnY29tcGlsZXItaW5mby5qc29uLmd6Jyk7XG4gICAgbGV0IGJ1ZiA9IGZzLnJlYWRGaWxlU3luYyh0YXJnZXQpO1xuICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZSh6bGliLmd1bnppcFN5bmMoYnVmKSk7XG5cbiAgICBsZXQgZmlsZUNoYW5nZUNhY2hlID0gRmlsZUNoYW5nZWRDYWNoZS5sb2FkRnJvbURhdGEoaW5mby5maWxlQ2hhbmdlQ2FjaGUsIGFwcFJvb3QsIGZhbHNlKTtcblxuICAgIE9iamVjdC5rZXlzKGluZm8uY29tcGlsZXJzKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBsZXQgY3VyID0gaW5mby5jb21waWxlcnNbeF07XG4gICAgICBjb21waWxlcnNCeU1pbWVUeXBlW3hdLmNvbXBpbGVyT3B0aW9ucyA9IGN1ci5jb21waWxlck9wdGlvbnM7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IENvbXBpbGVySG9zdChyb290Q2FjaGVEaXIsIGNvbXBpbGVyc0J5TWltZVR5cGUsIGZpbGVDaGFuZ2VDYWNoZSwgZmFsc2UsIGZhbGxiYWNrQ29tcGlsZXIpO1xuICB9XG5cbiAgc2F2ZUNvbmZpZ3VyYXRpb25TeW5jKCkge1xuICAgIGxldCBzZXJpYWxpemVkQ29tcGlsZXJPcHRzID0gT2JqZWN0LmtleXModGhpcy5jb21waWxlcnNCeU1pbWVUeXBlKS5yZWR1Y2UoKGFjYywgeCkgPT4ge1xuICAgICAgbGV0IGNvbXBpbGVyID0gdGhpcy5jb21waWxlcnNCeU1pbWVUeXBlW3hdO1xuICAgICAgbGV0IEtsYXNzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNvbXBpbGVyKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgbGV0IHZhbCA9IHtcbiAgICAgICAgbmFtZTogS2xhc3MubmFtZSxcbiAgICAgICAgaW5wdXRNaW1lVHlwZXM6IEtsYXNzLmdldElucHV0TWltZVR5cGVzKCksXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczogY29tcGlsZXIuY29tcGlsZXJPcHRpb25zLFxuICAgICAgICBjb21waWxlclZlcnNpb246IGNvbXBpbGVyLmdldENvbXBpbGVyVmVyc2lvbigpXG4gICAgICB9O1xuXG4gICAgICBhY2NbeF0gPSB2YWw7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcblxuICAgIGxldCBpbmZvID0ge1xuICAgICAgZmlsZUNoYW5nZUNhY2hlOiB0aGlzLmZpbGVDaGFuZ2VDYWNoZS5nZXRTYXZlZERhdGEoKSxcbiAgICAgIGNvbXBpbGVyczogc2VyaWFsaXplZENvbXBpbGVyT3B0c1xuICAgIH07XG5cbiAgICBsZXQgdGFyZ2V0ID0gcGF0aC5qb2luKHRoaXMucm9vdENhY2hlRGlyLCAnY29tcGlsZXItaW5mby5qc29uLmd6Jyk7XG4gICAgbGV0IGJ1ZiA9IHpsaWIuZ3ppcFN5bmMobmV3IEJ1ZmZlcihKU09OLnN0cmluZ2lmeShpbmZvKSkpO1xuICAgIGZzLndyaXRlRmlsZVN5bmModGFyZ2V0LCBidWYpO1xuICB9XG5cbiAgY29tcGlsZVJlYWRPbmx5U3luYyhmaWxlUGF0aCkge1xuICAgIC8vIFdlIGd1YXJhbnRlZSB0aGF0IG5vZGVfbW9kdWxlcyBhcmUgYWx3YXlzIHNoaXBwZWQgZGlyZWN0bHlcbiAgICBsZXQgdHlwZSA9IG1pbWVUeXBlcy5sb29rdXAoZmlsZVBhdGgpO1xuICAgIGlmIChGaWxlQ2hhbmdlZENhY2hlLmlzSW5Ob2RlTW9kdWxlcyhmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbWVUeXBlOiB0eXBlIHx8ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JyxcbiAgICAgICAgY29kZTogZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICB9O1xuICAgIH1cblxuICAgIGxldCBoYXNoSW5mbyA9IHRoaXMuZmlsZUNoYW5nZUNhY2hlLmdldEhhc2hGb3JQYXRoU3luYyhmaWxlUGF0aCk7XG5cbiAgICAvLyBXZSBndWFyYW50ZWUgdGhhdCBub2RlX21vZHVsZXMgYXJlIGFsd2F5cyBzaGlwcGVkIGRpcmVjdGx5XG4gICAgaWYgKGhhc2hJbmZvLmlzSW5Ob2RlTW9kdWxlcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWltZVR5cGU6IHR5cGUsXG4gICAgICAgIGNvZGU6IGhhc2hJbmZvLnNvdXJjZUNvZGUgfHwgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIE5COiBIZXJlLCB3ZSdyZSBiYXNpY2FsbHkgb25seSB1c2luZyB0aGUgY29tcGlsZXIgaGVyZSB0byBmaW5kXG4gICAgLy8gdGhlIGFwcHJvcHJpYXRlIENvbXBpbGVDYWNoZVxuICAgIGxldCBjb21waWxlciA9IENvbXBpbGVySG9zdC5zaG91bGRQYXNzdGhyb3VnaChoYXNoSW5mbykgP1xuICAgICAgdGhpcy5nZXRQYXNzdGhyb3VnaENvbXBpbGVyKCkgOlxuICAgICAgdGhpcy5jb21waWxlcnNCeU1pbWVUeXBlW3R5cGUgfHwgJ19fbG9sbm90aGVyZSddO1xuXG4gICAgaWYgKCFjb21waWxlcikge1xuICAgICAgY29tcGlsZXIgPSB0aGlzLmZhbGxiYWNrQ29tcGlsZXI7XG5cbiAgICAgIGxldCB7IGNvZGUsIGJpbmFyeURhdGEsIG1pbWVUeXBlIH0gPSBjb21waWxlci5nZXRTeW5jKGZpbGVQYXRoKTtcbiAgICAgIHJldHVybiB7IGNvZGU6IGNvZGUgfHwgYmluYXJ5RGF0YSwgbWltZVR5cGUgfTtcbiAgICB9XG5cbiAgICBsZXQgY2FjaGUgPSB0aGlzLmNhY2hlc0ZvckNvbXBpbGVycy5nZXQoY29tcGlsZXIpO1xuICAgIGxldCB7Y29kZSwgYmluYXJ5RGF0YSwgbWltZVR5cGV9ID0gY2FjaGUuZ2V0U3luYyhmaWxlUGF0aCk7XG5cbiAgICBjb2RlID0gY29kZSB8fCBiaW5hcnlEYXRhO1xuICAgIGlmICghY29kZSB8fCAhbWltZVR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXNrZWQgdG8gY29tcGlsZSAke2ZpbGVQYXRofSBpbiBwcm9kdWN0aW9uLCBpcyB0aGlzIGZpbGUgbm90IHByZWNvbXBpbGVkP2ApO1xuICAgIH1cblxuICAgIHJldHVybiB7IGNvZGUsIG1pbWVUeXBlIH07XG4gIH1cblxuICBmdWxsQ29tcGlsZVN5bmMoZmlsZVBhdGgpIHtcbiAgICBkKGBDb21waWxpbmcgJHtmaWxlUGF0aH1gKTtcblxuICAgIGxldCBoYXNoSW5mbyA9IHRoaXMuZmlsZUNoYW5nZUNhY2hlLmdldEhhc2hGb3JQYXRoU3luYyhmaWxlUGF0aCk7XG4gICAgbGV0IHR5cGUgPSBtaW1lVHlwZXMubG9va3VwKGZpbGVQYXRoKTtcblxuICAgIGlmIChoYXNoSW5mby5pc0luTm9kZU1vZHVsZXMpIHtcbiAgICAgIGxldCBjb2RlID0gaGFzaEluZm8uc291cmNlQ29kZSB8fCBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGY4Jyk7XG4gICAgICByZXR1cm4geyBjb2RlLCBtaW1lVHlwZTogdHlwZSB9O1xuICAgIH1cblxuICAgIGxldCBjb21waWxlciA9IENvbXBpbGVySG9zdC5zaG91bGRQYXNzdGhyb3VnaChoYXNoSW5mbykgP1xuICAgICAgdGhpcy5nZXRQYXNzdGhyb3VnaENvbXBpbGVyKCkgOlxuICAgICAgdGhpcy5jb21waWxlcnNCeU1pbWVUeXBlW3R5cGUgfHwgJ19fbG9sbm90aGVyZSddO1xuXG4gICAgaWYgKCFjb21waWxlcikge1xuICAgICAgZChgRmFsbGluZyBiYWNrIHRvIHBhc3N0aHJvdWdoIGNvbXBpbGVyIGZvciAke2ZpbGVQYXRofWApO1xuICAgICAgY29tcGlsZXIgPSB0aGlzLmZhbGxiYWNrQ29tcGlsZXI7XG4gICAgfVxuXG4gICAgaWYgKCFjb21waWxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIGEgY29tcGlsZXIgZm9yICR7ZmlsZVBhdGh9YCk7XG4gICAgfVxuXG4gICAgbGV0IGNhY2hlID0gdGhpcy5jYWNoZXNGb3JDb21waWxlcnMuZ2V0KGNvbXBpbGVyKTtcbiAgICByZXR1cm4gY2FjaGUuZ2V0T3JGZXRjaFN5bmMoXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIChmaWxlUGF0aCwgaGFzaEluZm8pID0+IHRoaXMuY29tcGlsZVVuY2FjaGVkU3luYyhmaWxlUGF0aCwgaGFzaEluZm8sIGNvbXBpbGVyKSk7XG4gIH1cblxuICBjb21waWxlVW5jYWNoZWRTeW5jKGZpbGVQYXRoLCBoYXNoSW5mbywgY29tcGlsZXIpIHtcbiAgICBsZXQgaW5wdXRNaW1lVHlwZSA9IG1pbWVUeXBlcy5sb29rdXAoZmlsZVBhdGgpO1xuXG4gICAgaWYgKGhhc2hJbmZvLmlzRmlsZUJpbmFyeSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmluYXJ5RGF0YTogaGFzaEluZm8uYmluYXJ5RGF0YSB8fCBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLFxuICAgICAgICBtaW1lVHlwZTogaW5wdXRNaW1lVHlwZSxcbiAgICAgICAgZGVwZW5kZW50RmlsZXM6IFtdXG4gICAgICB9O1xuICAgIH1cblxuICAgIGxldCBjdHggPSB7fTtcbiAgICBsZXQgY29kZSA9IGhhc2hJbmZvLnNvdXJjZUNvZGUgfHwgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuXG4gICAgaWYgKCEoY29tcGlsZXIuc2hvdWxkQ29tcGlsZUZpbGVTeW5jKGNvZGUsIGN0eCkpKSB7XG4gICAgICBkKGBDb21waWxlciByZXR1cm5lZCBmYWxzZSBmb3Igc2hvdWxkQ29tcGlsZUZpbGU6ICR7ZmlsZVBhdGh9YCk7XG4gICAgICByZXR1cm4geyBjb2RlLCBtaW1lVHlwZTogbWltZVR5cGVzLmxvb2t1cChmaWxlUGF0aCksIGRlcGVuZGVudEZpbGVzOiBbXSB9O1xuICAgIH1cblxuICAgIGxldCBkZXBlbmRlbnRGaWxlcyA9IGNvbXBpbGVyLmRldGVybWluZURlcGVuZGVudEZpbGVzU3luYyhjb2RlLCBmaWxlUGF0aCwgY3R4KTtcblxuICAgIGxldCByZXN1bHQgPSBjb21waWxlci5jb21waWxlU3luYyhjb2RlLCBmaWxlUGF0aCwgY3R4KTtcblxuICAgIGxldCBzaG91bGRJbmxpbmVIdG1saWZ5ID1cbiAgICAgIGlucHV0TWltZVR5cGUgIT09ICd0ZXh0L2h0bWwnICYmXG4gICAgICByZXN1bHQubWltZVR5cGUgPT09ICd0ZXh0L2h0bWwnO1xuXG4gICAgbGV0IGlzUGFzc3Rocm91Z2ggPVxuICAgICAgcmVzdWx0Lm1pbWVUeXBlID09PSAndGV4dC9wbGFpbicgfHxcbiAgICAgICFyZXN1bHQubWltZVR5cGUgfHxcbiAgICAgIENvbXBpbGVySG9zdC5zaG91bGRQYXNzdGhyb3VnaChoYXNoSW5mbyk7XG5cbiAgICBpZiAoKGZpbmFsRm9ybXNbcmVzdWx0Lm1pbWVUeXBlXSAmJiAhc2hvdWxkSW5saW5lSHRtbGlmeSkgfHwgaXNQYXNzdGhyb3VnaCkge1xuICAgICAgLy8gR290IHNvbWV0aGluZyB3ZSBjYW4gdXNlIGluLWJyb3dzZXIsIGxldCdzIHJldHVybiBpdFxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocmVzdWx0LCB7ZGVwZW5kZW50RmlsZXN9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZChgUmVjdXJzaXZlbHkgY29tcGlsaW5nIHJlc3VsdCBvZiAke2ZpbGVQYXRofSB3aXRoIG5vbi1maW5hbCBNSU1FIHR5cGUgJHtyZXN1bHQubWltZVR5cGV9LCBpbnB1dCB3YXMgJHtpbnB1dE1pbWVUeXBlfWApO1xuXG4gICAgICBoYXNoSW5mbyA9IE9iamVjdC5hc3NpZ24oeyBzb3VyY2VDb2RlOiByZXN1bHQuY29kZSwgbWltZVR5cGU6IHJlc3VsdC5taW1lVHlwZSB9LCBoYXNoSW5mbyk7XG4gICAgICBjb21waWxlciA9IHRoaXMuY29tcGlsZXJzQnlNaW1lVHlwZVtyZXN1bHQubWltZVR5cGUgfHwgJ19fbG9sbm90aGVyZSddO1xuXG4gICAgICBpZiAoIWNvbXBpbGVyKSB7XG4gICAgICAgIGQoYFJlY3Vyc2l2ZSBjb21waWxlIGZhaWxlZCAtIGludGVybWVkaWF0ZSByZXN1bHQ6ICR7SlNPTi5zdHJpbmdpZnkocmVzdWx0KX1gKTtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGluZyAke2ZpbGVQYXRofSByZXN1bHRlZCBpbiBhIE1JTUUgdHlwZSBvZiAke3Jlc3VsdC5taW1lVHlwZX0sIHdoaWNoIHdlIGRvbid0IGtub3cgaG93IHRvIGhhbmRsZWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21waWxlVW5jYWNoZWRTeW5jKFxuICAgICAgICBgJHtmaWxlUGF0aH0uJHttaW1lVHlwZXMuZXh0ZW5zaW9uKHJlc3VsdC5taW1lVHlwZSB8fCAndHh0Jyl9YCxcbiAgICAgICAgaGFzaEluZm8sIGNvbXBpbGVyKTtcbiAgICB9XG4gIH1cblxuICBjb21waWxlQWxsU3luYyhyb290RGlyZWN0b3J5LCBzaG91bGRDb21waWxlPW51bGwpIHtcbiAgICBsZXQgc2hvdWxkID0gc2hvdWxkQ29tcGlsZSB8fCBmdW5jdGlvbigpIHtyZXR1cm4gdHJ1ZTt9O1xuXG4gICAgZm9yQWxsRmlsZXNTeW5jKHJvb3REaXJlY3RvcnksIChmKSA9PiB7XG4gICAgICBpZiAoIXNob3VsZChmKSkgcmV0dXJuO1xuICAgICAgcmV0dXJuIHRoaXMuY29tcGlsZVN5bmMoZiwgdGhpcy5jb21waWxlcnNCeU1pbWVUeXBlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qXG4gICAqIE90aGVyIHN0dWZmXG4gICAqL1xuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHBhc3N0aHJvdWdoIGNvbXBpbGVyXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRQYXNzdGhyb3VnaENvbXBpbGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBpbGVyc0J5TWltZVR5cGVbJ3RleHQvcGxhaW4nXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciB3ZSBzaG91bGQgZXZlbiB0cnkgdG8gY29tcGlsZSB0aGUgY29udGVudC4gTm90ZSB0aGF0IGluXG4gICAqIHNvbWUgY2FzZXMsIGNvbnRlbnQgd2lsbCBzdGlsbCBiZSBpbiBjYWNoZSBldmVuIGlmIHRoaXMgcmV0dXJucyB0cnVlLCBhbmRcbiAgICogaW4gb3RoZXIgY2FzZXMgKGlzSW5Ob2RlTW9kdWxlcyksIHdlJ2xsIGtub3cgZXhwbGljaXRseSB0byBub3QgZXZlbiBib3RoZXJcbiAgICogbG9va2luZyBpbiB0aGUgY2FjaGUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGF0aWMgc2hvdWxkUGFzc3Rocm91Z2goaGFzaEluZm8pIHtcbiAgICByZXR1cm4gaGFzaEluZm8uaXNNaW5pZmllZCB8fCBoYXNoSW5mby5pc0luTm9kZU1vZHVsZXMgfHwgaGFzaEluZm8uaGFzU291cmNlTWFwIHx8IGhhc2hJbmZvLmlzRmlsZUJpbmFyeTtcbiAgfVxufVxuIl19