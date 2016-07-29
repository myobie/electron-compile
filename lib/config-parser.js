'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCompilerHostFromProjectRoot = exports.createCompilerHostFromConfigFile = exports.createCompilerHostFromBabelRc = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

/**
 * Creates a compiler host from a .babelrc file. This method is usually called
 * from {@link createCompilerHostFromProjectRoot} instead of used directly.
 *
 * @param  {string} file  The path to a .babelrc file
 *
 * @param  {string} rootCacheDir (optional)  The directory to use as a cache.
 *
 * @return {Promise<CompilerHost>}  A set-up compiler host
 */
var createCompilerHostFromBabelRc = exports.createCompilerHostFromBabelRc = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file) {
    var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var info, ourEnv;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = JSON;
            _context.next = 3;
            return _promise.pfs.readFile(file, 'utf8');

          case 3:
            _context.t1 = _context.sent;
            info = _context.t0.parse.call(_context.t0, _context.t1);


            // package.json
            if ('babel' in info) {
              info = info.babel;
            }

            if ('env' in info) {
              ourEnv = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';

              info = info.env[ourEnv];
            }

            // Are we still package.json (i.e. is there no babel info whatsoever?)

            if (!('name' in info && 'version' in info)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', createCompilerHostFromConfiguration({
              appRoot: _path2.default.dirname(file),
              options: getDefaultConfiguration(),
              rootCacheDir: rootCacheDir
            }));

          case 9:
            return _context.abrupt('return', createCompilerHostFromConfiguration({
              appRoot: _path2.default.dirname(file),
              options: {
                'application/javascript': info
              },
              rootCacheDir: rootCacheDir
            }));

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createCompilerHostFromBabelRc(_x4) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Creates a compiler host from a .compilerc file. This method is usually called
 * from {@link createCompilerHostFromProjectRoot} instead of used directly.
 *
 * @param  {string} file  The path to a .compilerc file
 *
 * @param  {string} rootCacheDir (optional)  The directory to use as a cache.
 *
 * @return {Promise<CompilerHost>}  A set-up compiler host
 */


var createCompilerHostFromConfigFile = exports.createCompilerHostFromConfigFile = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(file) {
    var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var info, ourEnv;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = JSON;
            _context2.next = 3;
            return _promise.pfs.readFile(file, 'utf8');

          case 3:
            _context2.t1 = _context2.sent;
            info = _context2.t0.parse.call(_context2.t0, _context2.t1);


            if ('env' in info) {
              ourEnv = process.env.ELECTRON_COMPILE_ENV || process.env.NODE_ENV || 'development';

              info = info.env[ourEnv];
            }

            return _context2.abrupt('return', createCompilerHostFromConfiguration({
              appRoot: _path2.default.dirname(file),
              options: info,
              rootCacheDir: rootCacheDir
            }));

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createCompilerHostFromConfigFile(_x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Creates a configured {@link CompilerHost} instance from the project root
 * directory. This method first searches for a .compilerc (or .compilerc.json), then falls back to the
 * default locations for Babel configuration info. If neither are found, defaults
 * to standard settings
 *
 * @param  {string} rootDir  The root application directory (i.e. the directory
 *                           that has the app's package.json)
 *
 * @param  {string} rootCacheDir (optional)  The directory to use as a cache.
 *
 * @return {Promise<CompilerHost>}  A set-up compiler host
 */


var createCompilerHostFromProjectRoot = exports.createCompilerHostFromProjectRoot = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(rootDir) {
    var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var compilerc, babelrc;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            compilerc = _path2.default.join(rootDir, '.compilerc');

            if (!statSyncNoException(compilerc)) {
              _context3.next = 6;
              break;
            }

            d('Found a .compilerc at ' + compilerc + ', using it');
            _context3.next = 5;
            return createCompilerHostFromConfigFile(compilerc, rootCacheDir);

          case 5:
            return _context3.abrupt('return', _context3.sent);

          case 6:
            compilerc += '.json';

            if (!statSyncNoException(compilerc)) {
              _context3.next = 12;
              break;
            }

            d('Found a .compilerc at ' + compilerc + ', using it');
            _context3.next = 11;
            return createCompilerHostFromConfigFile(compilerc, rootCacheDir);

          case 11:
            return _context3.abrupt('return', _context3.sent);

          case 12:
            babelrc = _path2.default.join(rootDir, '.babelrc');

            if (!statSyncNoException(babelrc)) {
              _context3.next = 18;
              break;
            }

            d('Found a .babelrc at ' + babelrc + ', using it');
            _context3.next = 17;
            return createCompilerHostFromBabelRc(babelrc, rootCacheDir);

          case 17:
            return _context3.abrupt('return', _context3.sent);

          case 18:

            d('Using package.json or default parameters at ' + rootDir);
            _context3.next = 21;
            return createCompilerHostFromBabelRc(_path2.default.join(rootDir, 'package.json'), rootCacheDir);

          case 21:
            return _context3.abrupt('return', _context3.sent);

          case 22:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createCompilerHostFromProjectRoot(_x8) {
    return _ref3.apply(this, arguments);
  };
}();

exports.initializeGlobalHooks = initializeGlobalHooks;
exports.init = init;
exports.createCompilerHostFromConfiguration = createCompilerHostFromConfiguration;
exports.createCompilerHostFromBabelRcSync = createCompilerHostFromBabelRcSync;
exports.createCompilerHostFromConfigFileSync = createCompilerHostFromConfigFileSync;
exports.createCompilerHostFromProjectRootSync = createCompilerHostFromProjectRootSync;
exports.calculateDefaultCompileCacheDirectory = calculateDefaultCompileCacheDirectory;
exports.getDefaultConfiguration = getDefaultConfiguration;
exports.createCompilers = createCompilers;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _promise = require('./promise');

var _fileChangeCache = require('./file-change-cache');

var _fileChangeCache2 = _interopRequireDefault(_fileChangeCache);

var _compilerHost = require('./compiler-host');

var _compilerHost2 = _interopRequireDefault(_compilerHost);

var _requireHook = require('./require-hook');

var _requireHook2 = _interopRequireDefault(_requireHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = require('debug-electron')('electron-compile:config-parser');

// NB: We intentionally delay-load this so that in production, you can create
// cache-only versions of these compilers
var allCompilerClasses = null;

function statSyncNoException(fsPath) {
  if ('statSyncNoException' in _fs2.default) {
    return _fs2.default.statSyncNoException(fsPath);
  }

  try {
    return _fs2.default.statSync(fsPath);
  } catch (e) {
    return null;
  }
}

/**
 * Initialize the global hooks (protocol hook for file:, node.js hook)
 * independent of initializing the compiler. This method is usually called by
 * init instead of directly
 *
 * @param {CompilerHost} compilerHost  The compiler host to use.
 *
 */
function initializeGlobalHooks(compilerHost) {
  var globalVar = global || window;
  globalVar.globalCompilerHost = compilerHost;

  (0, _requireHook2.default)(compilerHost);

  if ('type' in process && process.type === 'browser') {
    (function () {
      var _require = require('electron');

      var app = _require.app;

      var _require2 = require('./protocol-hook');

      var initializeProtocolHook = _require2.initializeProtocolHook;


      var protoify = function protoify() {
        initializeProtocolHook(compilerHost);
      };
      if (app.isReady()) {
        protoify();
      } else {
        app.on('ready', protoify);
      }
    })();
  }
}

/**
 * Initialize electron-compile and set it up, either for development or
 * production use. This is almost always the only method you need to use in order
 * to use electron-compile.
 *
 * @param  {string} appRoot  The top-level directory for your application (i.e.
 *                           the one which has your package.json).
 *
 * @param  {string} mainModule  The module to require in, relative to the module
 *                              calling init, that will start your app. Write this
 *                              as if you were writing a require call from here.
 *
 * @param  {bool} productionMode   If explicitly True/False, will set read-only
 *                                 mode to be disabled/enabled. If not, we'll
 *                                 guess based on the presence of a production
 *                                 cache.
 *
 * @param  {string} cacheDir  If not passed in, read-only will look in
 *                            `appRoot/.cache` and dev mode will compile to a
 *                            temporary directory. If it is passed in, both modes
 *                            will cache to/from `appRoot/{cacheDir}`
 */
function init(appRoot, mainModule) {
  var productionMode = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var cacheDir = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var compilerHost = null;
  var rootCacheDir = _path2.default.join(appRoot, cacheDir || '.cache');

  if (productionMode === null) {
    productionMode = !!statSyncNoException(rootCacheDir);
  }

  if (productionMode) {
    compilerHost = _compilerHost2.default.createReadonlyFromConfigurationSync(rootCacheDir, appRoot);
  } else {
    // if cacheDir was passed in, pass it along. Otherwise, default to a tempdir.
    if (cacheDir) {
      compilerHost = createCompilerHostFromProjectRootSync(appRoot, rootCacheDir);
    } else {
      compilerHost = createCompilerHostFromProjectRootSync(appRoot);
    }
  }

  initializeGlobalHooks(compilerHost);
  require.main.require(mainModule);
}

/**
 * Creates a {@link CompilerHost} with the given information. This method is
 * usually called by {@link createCompilerHostFromProjectRoot}.
 *
 * @private
 */
function createCompilerHostFromConfiguration(info) {
  var compilers = createCompilers();
  var rootCacheDir = info.rootCacheDir || calculateDefaultCompileCacheDirectory();

  d('Creating CompilerHost: ' + (0, _stringify2.default)(info) + ', rootCacheDir = ' + rootCacheDir);
  var fileChangeCache = new _fileChangeCache2.default(info.appRoot);

  var compilerInfo = _path2.default.join(rootCacheDir, 'compiler-info.json.gz');
  if (_fs2.default.existsSync(compilerInfo)) {
    var buf = _fs2.default.readFileSync(compilerInfo);
    var json = JSON.parse(_zlib2.default.gunzipSync(buf));
    fileChangeCache = _fileChangeCache2.default.loadFromData(json.fileChangeCache, info.appRoot, false);
  }

  (0, _keys2.default)(info.options || {}).forEach(function (x) {
    var opts = info.options[x];
    if (!(x in compilers)) {
      throw new Error('Found compiler settings for missing compiler: ' + x);
    }

    // NB: Let's hope this isn't a valid compiler option...
    if (opts.passthrough) {
      compilers[x] = compilers['text/plain'];
      delete opts.passthrough;
    }

    d('Setting options for ' + x + ': ' + (0, _stringify2.default)(opts));
    compilers[x].compilerOptions = opts;
  });

  var ret = new _compilerHost2.default(rootCacheDir, compilers, fileChangeCache, false, compilers['text/plain']);

  // NB: It's super important that we guarantee that the configuration is saved
  // out, because we'll need to re-read it in the renderer process
  d('Created compiler host with options: ' + (0, _stringify2.default)(info));
  ret.saveConfigurationSync();
  return ret;
}function createCompilerHostFromBabelRcSync(file) {
  var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var info = JSON.parse(_fs2.default.readFileSync(file, 'utf8'));

  // package.json
  if ('babel' in info) {
    info = info.babel;
  }

  if ('env' in info) {
    var ourEnv = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
    info = info.env[ourEnv];
  }

  // Are we still package.json (i.e. is there no babel info whatsoever?)
  if ('name' in info && 'version' in info) {
    return createCompilerHostFromConfiguration({
      appRoot: _path2.default.dirname(file),
      options: getDefaultConfiguration(),
      rootCacheDir: rootCacheDir
    });
  }

  return createCompilerHostFromConfiguration({
    appRoot: _path2.default.dirname(file),
    options: {
      'application/javascript': info
    },
    rootCacheDir: rootCacheDir
  });
}

function createCompilerHostFromConfigFileSync(file) {
  var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var info = JSON.parse(_fs2.default.readFileSync(file, 'utf8'));

  if ('env' in info) {
    var ourEnv = process.env.ELECTRON_COMPILE_ENV || process.env.NODE_ENV || 'development';
    info = info.env[ourEnv];
  }

  return createCompilerHostFromConfiguration({
    appRoot: _path2.default.dirname(file),
    options: info,
    rootCacheDir: rootCacheDir
  });
}

function createCompilerHostFromProjectRootSync(rootDir) {
  var rootCacheDir = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var compilerc = _path2.default.join(rootDir, '.compilerc');
  if (statSyncNoException(compilerc)) {
    d('Found a .compilerc at ' + compilerc + ', using it');
    return createCompilerHostFromConfigFileSync(compilerc, rootCacheDir);
  }

  var babelrc = _path2.default.join(rootDir, '.babelrc');
  if (statSyncNoException(babelrc)) {
    d('Found a .babelrc at ' + babelrc + ', using it');
    return createCompilerHostFromBabelRcSync(babelrc, rootCacheDir);
  }

  d('Using package.json or default parameters at ' + rootDir);
  return createCompilerHostFromBabelRcSync(_path2.default.join(rootDir, 'package.json'), rootCacheDir);
}

/**
 * Returns what electron-compile would use as a default rootCacheDir. Usually only
 * used for debugging purposes
 *
 * @return {string}  A path that may or may not exist where electron-compile would
 *                   set up a development mode cache.
 */
function calculateDefaultCompileCacheDirectory() {
  var tmpDir = process.env.TEMP || process.env.TMPDIR || '/tmp';
  var hash = require('crypto').createHash('md5').update(process.execPath).digest('hex');

  var cacheDir = _path2.default.join(tmpDir, 'compileCache_' + hash);
  _mkdirp2.default.sync(cacheDir);

  d('Using default cache directory: ' + cacheDir);
  return cacheDir;
}

/**
 * Returns the default .configrc if no configuration information can be found.
 *
 * @return {Object}  A list of default config settings for electron-compiler.
 */
function getDefaultConfiguration() {
  return {
    'application/javascript': {
      "presets": ["stage-0", "es2015", "react"],
      "sourceMaps": "inline"
    }
  };
}

/**
 * Allows you to create new instances of all compilers that are supported by
 * electron-compile and use them directly. Currently supports Babel, CoffeeScript,
 * TypeScript, Less, and Jade.
 *
 * @return {Object}  An Object whose Keys are MIME types, and whose values
 * are instances of @{link CompilerBase}.
 */
function createCompilers() {
  if (!allCompilerClasses) {
    // First we want to see if electron-compilers itself has been installed with
    // devDependencies. If that's not the case, check to see if
    // electron-compilers is installed as a peer dependency (probably as a
    // devDependency of the root project).
    var locations = ['electron-compilers', '../../electron-compilers'];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(locations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var location = _step.value;

        try {
          allCompilerClasses = require(location);
        } catch (e) {
          // Yolo
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!allCompilerClasses) {
      throw new Error("Electron compilers not found but were requested to be loaded");
    }
  }

  // NB: Note that this code is carefully set up so that InlineHtmlCompiler
  // (i.e. classes with `createFromCompilers`) initially get an empty object,
  // but will have a reference to the final result of what we return, which
  // resolves the circular dependency we'd otherwise have here.
  var ret = {};
  var instantiatedClasses = allCompilerClasses.map(function (Klass) {
    if ('createFromCompilers' in Klass) {
      return Klass.createFromCompilers(ret);
    } else {
      return new Klass();
    }
  });

  instantiatedClasses.reduce(function (acc, x) {
    var Klass = (0, _getPrototypeOf2.default)(x).constructor;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(Klass.getInputMimeTypes()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var type = _step2.value;
        acc[type] = x;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return acc;
  }, ret);

  return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWctcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxSkE7Ozs7Ozs7Ozs7O3dFQVVPLGlCQUE2QyxJQUE3QztBQUFBLFFBQW1ELFlBQW5ELHlEQUFnRSxJQUFoRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwwQkFDTSxJQUROO0FBQUE7QUFBQSxtQkFDdUIsYUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixNQUFuQixDQUR2Qjs7QUFBQTtBQUFBO0FBQ0QsZ0JBREMsZUFDVyxLQURYOzs7QUFHTDtBQUNBLGdCQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixxQkFBTyxLQUFLLEtBQVo7QUFDRDs7QUFFRCxnQkFBSSxTQUFTLElBQWIsRUFBbUI7QUFDYixvQkFEYSxHQUNKLFFBQVEsR0FBUixDQUFZLFNBQVosSUFBeUIsUUFBUSxHQUFSLENBQVksUUFBckMsSUFBaUQsYUFEN0M7O0FBRWpCLHFCQUFPLEtBQUssR0FBTCxDQUFTLE1BQVQsQ0FBUDtBQUNEOztBQUVEOztBQWJLLGtCQWNELFVBQVUsSUFBVixJQUFrQixhQUFhLElBZDlCO0FBQUE7QUFBQTtBQUFBOztBQUFBLDZDQWVJLG9DQUFvQztBQUN6Qyx1QkFBUyxlQUFLLE9BQUwsQ0FBYSxJQUFiLENBRGdDO0FBRXpDLHVCQUFTLHlCQUZnQztBQUd6QztBQUh5QyxhQUFwQyxDQWZKOztBQUFBO0FBQUEsNkNBc0JFLG9DQUFvQztBQUN6Qyx1QkFBUyxlQUFLLE9BQUwsQ0FBYSxJQUFiLENBRGdDO0FBRXpDLHVCQUFTO0FBQ1AsMENBQTBCO0FBRG5CLGVBRmdDO0FBS3pDO0FBTHlDLGFBQXBDLENBdEJGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlLDZCOzs7OztBQWdDdEI7Ozs7Ozs7Ozs7Ozs7eUVBVU8sa0JBQWdELElBQWhEO0FBQUEsUUFBc0QsWUFBdEQseURBQW1F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R0FOeUIsQ0FBMUI7O0FBUUEsc0JBQW9CLE1BQXBCLENBQTJCLFVBQUMsR0FBRCxFQUFLLENBQUwsRUFBVztBQUNwQyxRQUFJLFFBQVEsOEJBQXNCLENBQXRCLEVBQXlCLFdBQXJDOztBQURvQztBQUFBO0FBQUE7O0FBQUE7QUFHcEMsdURBQWlCLE1BQU0saUJBQU4sRUFBakIsaUhBQTRDO0FBQUEsWUFBbkMsSUFBbUM7QUFBRSxZQUFJLElBQUosSUFBWSxDQUFaO0FBQWdCO0FBSDFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBSXBDLFdBQU8sR0FBUDtBQUNELEdBTEQsRUFLRyxHQUxIOztBQU9BLFNBQU8sR0FBUDtBQUNEIiwiZmlsZSI6ImNvbmZpZy1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgemxpYiBmcm9tICd6bGliJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCB7cGZzfSBmcm9tICcuL3Byb21pc2UnO1xuXG5pbXBvcnQgRmlsZUNoYW5nZWRDYWNoZSBmcm9tICcuL2ZpbGUtY2hhbmdlLWNhY2hlJztcbmltcG9ydCBDb21waWxlckhvc3QgZnJvbSAnLi9jb21waWxlci1ob3N0JztcbmltcG9ydCByZWdpc3RlclJlcXVpcmVFeHRlbnNpb24gZnJvbSAnLi9yZXF1aXJlLWhvb2snO1xuXG5jb25zdCBkID0gcmVxdWlyZSgnZGVidWctZWxlY3Ryb24nKSgnZWxlY3Ryb24tY29tcGlsZTpjb25maWctcGFyc2VyJyk7XG5cbi8vIE5COiBXZSBpbnRlbnRpb25hbGx5IGRlbGF5LWxvYWQgdGhpcyBzbyB0aGF0IGluIHByb2R1Y3Rpb24sIHlvdSBjYW4gY3JlYXRlXG4vLyBjYWNoZS1vbmx5IHZlcnNpb25zIG9mIHRoZXNlIGNvbXBpbGVyc1xubGV0IGFsbENvbXBpbGVyQ2xhc3NlcyA9IG51bGw7XG5cbmZ1bmN0aW9uIHN0YXRTeW5jTm9FeGNlcHRpb24oZnNQYXRoKSB7XG4gIGlmICgnc3RhdFN5bmNOb0V4Y2VwdGlvbicgaW4gZnMpIHtcbiAgICByZXR1cm4gZnMuc3RhdFN5bmNOb0V4Y2VwdGlvbihmc1BhdGgpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gZnMuc3RhdFN5bmMoZnNQYXRoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBnbG9iYWwgaG9va3MgKHByb3RvY29sIGhvb2sgZm9yIGZpbGU6LCBub2RlLmpzIGhvb2spXG4gKiBpbmRlcGVuZGVudCBvZiBpbml0aWFsaXppbmcgdGhlIGNvbXBpbGVyLiBUaGlzIG1ldGhvZCBpcyB1c3VhbGx5IGNhbGxlZCBieVxuICogaW5pdCBpbnN0ZWFkIG9mIGRpcmVjdGx5XG4gKlxuICogQHBhcmFtIHtDb21waWxlckhvc3R9IGNvbXBpbGVySG9zdCAgVGhlIGNvbXBpbGVyIGhvc3QgdG8gdXNlLlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVHbG9iYWxIb29rcyhjb21waWxlckhvc3QpIHtcbiAgbGV0IGdsb2JhbFZhciA9IChnbG9iYWwgfHwgd2luZG93KTtcbiAgZ2xvYmFsVmFyLmdsb2JhbENvbXBpbGVySG9zdCA9IGNvbXBpbGVySG9zdDtcblxuICByZWdpc3RlclJlcXVpcmVFeHRlbnNpb24oY29tcGlsZXJIb3N0KTtcblxuICBpZiAoJ3R5cGUnIGluIHByb2Nlc3MgJiYgcHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicpIHtcbiAgICBjb25zdCB7IGFwcCB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbiAgICBjb25zdCB7IGluaXRpYWxpemVQcm90b2NvbEhvb2sgfSA9IHJlcXVpcmUoJy4vcHJvdG9jb2wtaG9vaycpO1xuXG4gICAgbGV0IHByb3RvaWZ5ID0gZnVuY3Rpb24oKSB7IGluaXRpYWxpemVQcm90b2NvbEhvb2soY29tcGlsZXJIb3N0KTsgfTtcbiAgICBpZiAoYXBwLmlzUmVhZHkoKSkge1xuICAgICAgcHJvdG9pZnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBwLm9uKCdyZWFkeScsIHByb3RvaWZ5KTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIEluaXRpYWxpemUgZWxlY3Ryb24tY29tcGlsZSBhbmQgc2V0IGl0IHVwLCBlaXRoZXIgZm9yIGRldmVsb3BtZW50IG9yXG4gKiBwcm9kdWN0aW9uIHVzZS4gVGhpcyBpcyBhbG1vc3QgYWx3YXlzIHRoZSBvbmx5IG1ldGhvZCB5b3UgbmVlZCB0byB1c2UgaW4gb3JkZXJcbiAqIHRvIHVzZSBlbGVjdHJvbi1jb21waWxlLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gYXBwUm9vdCAgVGhlIHRvcC1sZXZlbCBkaXJlY3RvcnkgZm9yIHlvdXIgYXBwbGljYXRpb24gKGkuZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG9uZSB3aGljaCBoYXMgeW91ciBwYWNrYWdlLmpzb24pLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gbWFpbk1vZHVsZSAgVGhlIG1vZHVsZSB0byByZXF1aXJlIGluLCByZWxhdGl2ZSB0byB0aGUgbW9kdWxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxpbmcgaW5pdCwgdGhhdCB3aWxsIHN0YXJ0IHlvdXIgYXBwLiBXcml0ZSB0aGlzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzIGlmIHlvdSB3ZXJlIHdyaXRpbmcgYSByZXF1aXJlIGNhbGwgZnJvbSBoZXJlLlxuICpcbiAqIEBwYXJhbSAge2Jvb2x9IHByb2R1Y3Rpb25Nb2RlICAgSWYgZXhwbGljaXRseSBUcnVlL0ZhbHNlLCB3aWxsIHNldCByZWFkLW9ubHlcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZSB0byBiZSBkaXNhYmxlZC9lbmFibGVkLiBJZiBub3QsIHdlJ2xsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1ZXNzIGJhc2VkIG9uIHRoZSBwcmVzZW5jZSBvZiBhIHByb2R1Y3Rpb25cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBjYWNoZURpciAgSWYgbm90IHBhc3NlZCBpbiwgcmVhZC1vbmx5IHdpbGwgbG9vayBpblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYGFwcFJvb3QvLmNhY2hlYCBhbmQgZGV2IG1vZGUgd2lsbCBjb21waWxlIHRvIGFcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBvcmFyeSBkaXJlY3RvcnkuIElmIGl0IGlzIHBhc3NlZCBpbiwgYm90aCBtb2Rlc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCBjYWNoZSB0by9mcm9tIGBhcHBSb290L3tjYWNoZURpcn1gXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KGFwcFJvb3QsIG1haW5Nb2R1bGUsIHByb2R1Y3Rpb25Nb2RlID0gbnVsbCwgY2FjaGVEaXIgPSBudWxsKSB7XG4gIGxldCBjb21waWxlckhvc3QgPSBudWxsO1xuICBsZXQgcm9vdENhY2hlRGlyID0gcGF0aC5qb2luKGFwcFJvb3QsIGNhY2hlRGlyIHx8ICcuY2FjaGUnKTtcblxuICBpZiAocHJvZHVjdGlvbk1vZGUgPT09IG51bGwpIHtcbiAgICBwcm9kdWN0aW9uTW9kZSA9ICEhc3RhdFN5bmNOb0V4Y2VwdGlvbihyb290Q2FjaGVEaXIpO1xuICB9XG5cbiAgaWYgKHByb2R1Y3Rpb25Nb2RlKSB7XG4gICAgY29tcGlsZXJIb3N0ID0gQ29tcGlsZXJIb3N0LmNyZWF0ZVJlYWRvbmx5RnJvbUNvbmZpZ3VyYXRpb25TeW5jKHJvb3RDYWNoZURpciwgYXBwUm9vdCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gaWYgY2FjaGVEaXIgd2FzIHBhc3NlZCBpbiwgcGFzcyBpdCBhbG9uZy4gT3RoZXJ3aXNlLCBkZWZhdWx0IHRvIGEgdGVtcGRpci5cbiAgICBpZiAoY2FjaGVEaXIpIHtcbiAgICAgIGNvbXBpbGVySG9zdCA9IGNyZWF0ZUNvbXBpbGVySG9zdEZyb21Qcm9qZWN0Um9vdFN5bmMoYXBwUm9vdCwgcm9vdENhY2hlRGlyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZXJIb3N0ID0gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbVByb2plY3RSb290U3luYyhhcHBSb290KTtcbiAgICB9XG5cbiAgfVxuXG4gIGluaXRpYWxpemVHbG9iYWxIb29rcyhjb21waWxlckhvc3QpO1xuICByZXF1aXJlLm1haW4ucmVxdWlyZShtYWluTW9kdWxlKTtcbn1cblxuXG4vKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgQ29tcGlsZXJIb3N0fSB3aXRoIHRoZSBnaXZlbiBpbmZvcm1hdGlvbi4gVGhpcyBtZXRob2QgaXNcbiAqIHVzdWFsbHkgY2FsbGVkIGJ5IHtAbGluayBjcmVhdGVDb21waWxlckhvc3RGcm9tUHJvamVjdFJvb3R9LlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlndXJhdGlvbihpbmZvKSB7XG4gIGxldCBjb21waWxlcnMgPSBjcmVhdGVDb21waWxlcnMoKTtcbiAgbGV0IHJvb3RDYWNoZURpciA9IGluZm8ucm9vdENhY2hlRGlyIHx8IGNhbGN1bGF0ZURlZmF1bHRDb21waWxlQ2FjaGVEaXJlY3RvcnkoKTtcblxuICBkKGBDcmVhdGluZyBDb21waWxlckhvc3Q6ICR7SlNPTi5zdHJpbmdpZnkoaW5mbyl9LCByb290Q2FjaGVEaXIgPSAke3Jvb3RDYWNoZURpcn1gKTtcbiAgbGV0IGZpbGVDaGFuZ2VDYWNoZSA9IG5ldyBGaWxlQ2hhbmdlZENhY2hlKGluZm8uYXBwUm9vdCk7XG5cbiAgbGV0IGNvbXBpbGVySW5mbyA9IHBhdGguam9pbihyb290Q2FjaGVEaXIsICdjb21waWxlci1pbmZvLmpzb24uZ3onKTtcbiAgaWYgKGZzLmV4aXN0c1N5bmMoY29tcGlsZXJJbmZvKSkge1xuICAgIGxldCBidWYgPSBmcy5yZWFkRmlsZVN5bmMoY29tcGlsZXJJbmZvKTtcbiAgICBsZXQganNvbiA9IEpTT04ucGFyc2UoemxpYi5ndW56aXBTeW5jKGJ1ZikpO1xuICAgIGZpbGVDaGFuZ2VDYWNoZSA9IEZpbGVDaGFuZ2VkQ2FjaGUubG9hZEZyb21EYXRhKGpzb24uZmlsZUNoYW5nZUNhY2hlLCBpbmZvLmFwcFJvb3QsIGZhbHNlKTtcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGluZm8ub3B0aW9ucyB8fCB7fSkuZm9yRWFjaCgoeCkgPT4ge1xuICAgIGxldCBvcHRzID0gaW5mby5vcHRpb25zW3hdO1xuICAgIGlmICghKHggaW4gY29tcGlsZXJzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGb3VuZCBjb21waWxlciBzZXR0aW5ncyBmb3IgbWlzc2luZyBjb21waWxlcjogJHt4fWApO1xuICAgIH1cblxuICAgIC8vIE5COiBMZXQncyBob3BlIHRoaXMgaXNuJ3QgYSB2YWxpZCBjb21waWxlciBvcHRpb24uLi5cbiAgICBpZiAob3B0cy5wYXNzdGhyb3VnaCkge1xuICAgICAgY29tcGlsZXJzW3hdID0gY29tcGlsZXJzWyd0ZXh0L3BsYWluJ107XG4gICAgICBkZWxldGUgb3B0cy5wYXNzdGhyb3VnaDtcbiAgICB9XG5cbiAgICBkKGBTZXR0aW5nIG9wdGlvbnMgZm9yICR7eH06ICR7SlNPTi5zdHJpbmdpZnkob3B0cyl9YCk7XG4gICAgY29tcGlsZXJzW3hdLmNvbXBpbGVyT3B0aW9ucyA9IG9wdHM7XG4gIH0pO1xuXG4gIGxldCByZXQgPSBuZXcgQ29tcGlsZXJIb3N0KHJvb3RDYWNoZURpciwgY29tcGlsZXJzLCBmaWxlQ2hhbmdlQ2FjaGUsIGZhbHNlLCBjb21waWxlcnNbJ3RleHQvcGxhaW4nXSk7XG5cbiAgLy8gTkI6IEl0J3Mgc3VwZXIgaW1wb3J0YW50IHRoYXQgd2UgZ3VhcmFudGVlIHRoYXQgdGhlIGNvbmZpZ3VyYXRpb24gaXMgc2F2ZWRcbiAgLy8gb3V0LCBiZWNhdXNlIHdlJ2xsIG5lZWQgdG8gcmUtcmVhZCBpdCBpbiB0aGUgcmVuZGVyZXIgcHJvY2Vzc1xuICBkKGBDcmVhdGVkIGNvbXBpbGVyIGhvc3Qgd2l0aCBvcHRpb25zOiAke0pTT04uc3RyaW5naWZ5KGluZm8pfWApO1xuICByZXQuc2F2ZUNvbmZpZ3VyYXRpb25TeW5jKCk7XG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbXBpbGVyIGhvc3QgZnJvbSBhIC5iYWJlbHJjIGZpbGUuIFRoaXMgbWV0aG9kIGlzIHVzdWFsbHkgY2FsbGVkXG4gKiBmcm9tIHtAbGluayBjcmVhdGVDb21waWxlckhvc3RGcm9tUHJvamVjdFJvb3R9IGluc3RlYWQgb2YgdXNlZCBkaXJlY3RseS5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGUgIFRoZSBwYXRoIHRvIGEgLmJhYmVscmMgZmlsZVxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gcm9vdENhY2hlRGlyIChvcHRpb25hbCkgIFRoZSBkaXJlY3RvcnkgdG8gdXNlIGFzIGEgY2FjaGUuXG4gKlxuICogQHJldHVybiB7UHJvbWlzZTxDb21waWxlckhvc3Q+fSAgQSBzZXQtdXAgY29tcGlsZXIgaG9zdFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUJhYmVsUmMoZmlsZSwgcm9vdENhY2hlRGlyPW51bGwpIHtcbiAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGF3YWl0IHBmcy5yZWFkRmlsZShmaWxlLCAndXRmOCcpKTtcblxuICAvLyBwYWNrYWdlLmpzb25cbiAgaWYgKCdiYWJlbCcgaW4gaW5mbykge1xuICAgIGluZm8gPSBpbmZvLmJhYmVsO1xuICB9XG5cbiAgaWYgKCdlbnYnIGluIGluZm8pIHtcbiAgICBsZXQgb3VyRW52ID0gcHJvY2Vzcy5lbnYuQkFCRUxfRU5WIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG4gICAgaW5mbyA9IGluZm8uZW52W291ckVudl07XG4gIH1cblxuICAvLyBBcmUgd2Ugc3RpbGwgcGFja2FnZS5qc29uIChpLmUuIGlzIHRoZXJlIG5vIGJhYmVsIGluZm8gd2hhdHNvZXZlcj8pXG4gIGlmICgnbmFtZScgaW4gaW5mbyAmJiAndmVyc2lvbicgaW4gaW5mbykge1xuICAgIHJldHVybiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlndXJhdGlvbih7XG4gICAgICBhcHBSb290OiBwYXRoLmRpcm5hbWUoZmlsZSksXG4gICAgICBvcHRpb25zOiBnZXREZWZhdWx0Q29uZmlndXJhdGlvbigpLFxuICAgICAgcm9vdENhY2hlRGlyXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUNvbmZpZ3VyYXRpb24oe1xuICAgIGFwcFJvb3Q6IHBhdGguZGlybmFtZShmaWxlKSxcbiAgICBvcHRpb25zOiB7XG4gICAgICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCc6IGluZm9cbiAgICB9LFxuICAgIHJvb3RDYWNoZURpclxuICB9KTtcbn1cblxuXG4vKipcbiAqIENyZWF0ZXMgYSBjb21waWxlciBob3N0IGZyb20gYSAuY29tcGlsZXJjIGZpbGUuIFRoaXMgbWV0aG9kIGlzIHVzdWFsbHkgY2FsbGVkXG4gKiBmcm9tIHtAbGluayBjcmVhdGVDb21waWxlckhvc3RGcm9tUHJvamVjdFJvb3R9IGluc3RlYWQgb2YgdXNlZCBkaXJlY3RseS5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGUgIFRoZSBwYXRoIHRvIGEgLmNvbXBpbGVyYyBmaWxlXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSByb290Q2FjaGVEaXIgKG9wdGlvbmFsKSAgVGhlIGRpcmVjdG9yeSB0byB1c2UgYXMgYSBjYWNoZS5cbiAqXG4gKiBAcmV0dXJuIHtQcm9taXNlPENvbXBpbGVySG9zdD59ICBBIHNldC11cCBjb21waWxlciBob3N0XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlnRmlsZShmaWxlLCByb290Q2FjaGVEaXI9bnVsbCkge1xuICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoYXdhaXQgcGZzLnJlYWRGaWxlKGZpbGUsICd1dGY4JykpO1xuXG4gIGlmICgnZW52JyBpbiBpbmZvKSB7XG4gICAgbGV0IG91ckVudiA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0NPTVBJTEVfRU5WIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG4gICAgaW5mbyA9IGluZm8uZW52W291ckVudl07XG4gIH1cblxuICByZXR1cm4gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUNvbmZpZ3VyYXRpb24oe1xuICAgIGFwcFJvb3Q6IHBhdGguZGlybmFtZShmaWxlKSxcbiAgICBvcHRpb25zOiBpbmZvLFxuICAgIHJvb3RDYWNoZURpclxuICB9KTtcbn1cblxuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25maWd1cmVkIHtAbGluayBDb21waWxlckhvc3R9IGluc3RhbmNlIGZyb20gdGhlIHByb2plY3Qgcm9vdFxuICogZGlyZWN0b3J5LiBUaGlzIG1ldGhvZCBmaXJzdCBzZWFyY2hlcyBmb3IgYSAuY29tcGlsZXJjIChvciAuY29tcGlsZXJjLmpzb24pLCB0aGVuIGZhbGxzIGJhY2sgdG8gdGhlXG4gKiBkZWZhdWx0IGxvY2F0aW9ucyBmb3IgQmFiZWwgY29uZmlndXJhdGlvbiBpbmZvLiBJZiBuZWl0aGVyIGFyZSBmb3VuZCwgZGVmYXVsdHNcbiAqIHRvIHN0YW5kYXJkIHNldHRpbmdzXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSByb290RGlyICBUaGUgcm9vdCBhcHBsaWNhdGlvbiBkaXJlY3RvcnkgKGkuZS4gdGhlIGRpcmVjdG9yeVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IGhhcyB0aGUgYXBwJ3MgcGFja2FnZS5qc29uKVxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gcm9vdENhY2hlRGlyIChvcHRpb25hbCkgIFRoZSBkaXJlY3RvcnkgdG8gdXNlIGFzIGEgY2FjaGUuXG4gKlxuICogQHJldHVybiB7UHJvbWlzZTxDb21waWxlckhvc3Q+fSAgQSBzZXQtdXAgY29tcGlsZXIgaG9zdFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbVByb2plY3RSb290KHJvb3REaXIsIHJvb3RDYWNoZURpcj1udWxsKSB7XG4gIGxldCBjb21waWxlcmMgPSBwYXRoLmpvaW4ocm9vdERpciwgJy5jb21waWxlcmMnKTtcbiAgaWYgKHN0YXRTeW5jTm9FeGNlcHRpb24oY29tcGlsZXJjKSkge1xuICAgIGQoYEZvdW5kIGEgLmNvbXBpbGVyYyBhdCAke2NvbXBpbGVyY30sIHVzaW5nIGl0YCk7XG4gICAgcmV0dXJuIGF3YWl0IGNyZWF0ZUNvbXBpbGVySG9zdEZyb21Db25maWdGaWxlKGNvbXBpbGVyYywgcm9vdENhY2hlRGlyKTtcbiAgfVxuICBjb21waWxlcmMgKz0gJy5qc29uJztcbiAgaWYgKHN0YXRTeW5jTm9FeGNlcHRpb24oY29tcGlsZXJjKSkge1xuICAgIGQoYEZvdW5kIGEgLmNvbXBpbGVyYyBhdCAke2NvbXBpbGVyY30sIHVzaW5nIGl0YCk7XG4gICAgcmV0dXJuIGF3YWl0IGNyZWF0ZUNvbXBpbGVySG9zdEZyb21Db25maWdGaWxlKGNvbXBpbGVyYywgcm9vdENhY2hlRGlyKTtcbiAgfVxuXG4gIGxldCBiYWJlbHJjID0gcGF0aC5qb2luKHJvb3REaXIsICcuYmFiZWxyYycpO1xuICBpZiAoc3RhdFN5bmNOb0V4Y2VwdGlvbihiYWJlbHJjKSkge1xuICAgIGQoYEZvdW5kIGEgLmJhYmVscmMgYXQgJHtiYWJlbHJjfSwgdXNpbmcgaXRgKTtcbiAgICByZXR1cm4gYXdhaXQgY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUJhYmVsUmMoYmFiZWxyYywgcm9vdENhY2hlRGlyKTtcbiAgfVxuXG4gIGQoYFVzaW5nIHBhY2thZ2UuanNvbiBvciBkZWZhdWx0IHBhcmFtZXRlcnMgYXQgJHtyb290RGlyfWApO1xuICByZXR1cm4gYXdhaXQgY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUJhYmVsUmMocGF0aC5qb2luKHJvb3REaXIsICdwYWNrYWdlLmpzb24nKSwgcm9vdENhY2hlRGlyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVySG9zdEZyb21CYWJlbFJjU3luYyhmaWxlLCByb290Q2FjaGVEaXI9bnVsbCkge1xuICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGZpbGUsICd1dGY4JykpO1xuXG4gIC8vIHBhY2thZ2UuanNvblxuICBpZiAoJ2JhYmVsJyBpbiBpbmZvKSB7XG4gICAgaW5mbyA9IGluZm8uYmFiZWw7XG4gIH1cblxuICBpZiAoJ2VudicgaW4gaW5mbykge1xuICAgIGxldCBvdXJFbnYgPSBwcm9jZXNzLmVudi5CQUJFTF9FTlYgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcbiAgICBpbmZvID0gaW5mby5lbnZbb3VyRW52XTtcbiAgfVxuXG4gIC8vIEFyZSB3ZSBzdGlsbCBwYWNrYWdlLmpzb24gKGkuZS4gaXMgdGhlcmUgbm8gYmFiZWwgaW5mbyB3aGF0c29ldmVyPylcbiAgaWYgKCduYW1lJyBpbiBpbmZvICYmICd2ZXJzaW9uJyBpbiBpbmZvKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNvbXBpbGVySG9zdEZyb21Db25maWd1cmF0aW9uKHtcbiAgICAgIGFwcFJvb3Q6IHBhdGguZGlybmFtZShmaWxlKSxcbiAgICAgIG9wdGlvbnM6IGdldERlZmF1bHRDb25maWd1cmF0aW9uKCksXG4gICAgICByb290Q2FjaGVEaXJcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlndXJhdGlvbih7XG4gICAgYXBwUm9vdDogcGF0aC5kaXJuYW1lKGZpbGUpLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JzogaW5mb1xuICAgIH0sXG4gICAgcm9vdENhY2hlRGlyXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUNvbmZpZ0ZpbGVTeW5jKGZpbGUsIHJvb3RDYWNoZURpcj1udWxsKSB7XG4gIGxldCBpbmZvID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0ZjgnKSk7XG5cbiAgaWYgKCdlbnYnIGluIGluZm8pIHtcbiAgICBsZXQgb3VyRW52ID0gcHJvY2Vzcy5lbnYuRUxFQ1RST05fQ09NUElMRV9FTlYgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcbiAgICBpbmZvID0gaW5mby5lbnZbb3VyRW52XTtcbiAgfVxuXG4gIHJldHVybiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlndXJhdGlvbih7XG4gICAgYXBwUm9vdDogcGF0aC5kaXJuYW1lKGZpbGUpLFxuICAgIG9wdGlvbnM6IGluZm8sXG4gICAgcm9vdENhY2hlRGlyXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbVByb2plY3RSb290U3luYyhyb290RGlyLCByb290Q2FjaGVEaXI9bnVsbCkge1xuICBsZXQgY29tcGlsZXJjID0gcGF0aC5qb2luKHJvb3REaXIsICcuY29tcGlsZXJjJyk7XG4gIGlmIChzdGF0U3luY05vRXhjZXB0aW9uKGNvbXBpbGVyYykpIHtcbiAgICBkKGBGb3VuZCBhIC5jb21waWxlcmMgYXQgJHtjb21waWxlcmN9LCB1c2luZyBpdGApO1xuICAgIHJldHVybiBjcmVhdGVDb21waWxlckhvc3RGcm9tQ29uZmlnRmlsZVN5bmMoY29tcGlsZXJjLCByb290Q2FjaGVEaXIpO1xuICB9XG5cbiAgbGV0IGJhYmVscmMgPSBwYXRoLmpvaW4ocm9vdERpciwgJy5iYWJlbHJjJyk7XG4gIGlmIChzdGF0U3luY05vRXhjZXB0aW9uKGJhYmVscmMpKSB7XG4gICAgZChgRm91bmQgYSAuYmFiZWxyYyBhdCAke2JhYmVscmN9LCB1c2luZyBpdGApO1xuICAgIHJldHVybiBjcmVhdGVDb21waWxlckhvc3RGcm9tQmFiZWxSY1N5bmMoYmFiZWxyYywgcm9vdENhY2hlRGlyKTtcbiAgfVxuXG4gIGQoYFVzaW5nIHBhY2thZ2UuanNvbiBvciBkZWZhdWx0IHBhcmFtZXRlcnMgYXQgJHtyb290RGlyfWApO1xuICByZXR1cm4gY3JlYXRlQ29tcGlsZXJIb3N0RnJvbUJhYmVsUmNTeW5jKHBhdGguam9pbihyb290RGlyLCAncGFja2FnZS5qc29uJyksIHJvb3RDYWNoZURpcik7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGF0IGVsZWN0cm9uLWNvbXBpbGUgd291bGQgdXNlIGFzIGEgZGVmYXVsdCByb290Q2FjaGVEaXIuIFVzdWFsbHkgb25seVxuICogdXNlZCBmb3IgZGVidWdnaW5nIHB1cnBvc2VzXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSAgQSBwYXRoIHRoYXQgbWF5IG9yIG1heSBub3QgZXhpc3Qgd2hlcmUgZWxlY3Ryb24tY29tcGlsZSB3b3VsZFxuICogICAgICAgICAgICAgICAgICAgc2V0IHVwIGEgZGV2ZWxvcG1lbnQgbW9kZSBjYWNoZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZURlZmF1bHRDb21waWxlQ2FjaGVEaXJlY3RvcnkoKSB7XG4gIGxldCB0bXBEaXIgPSBwcm9jZXNzLmVudi5URU1QIHx8IHByb2Nlc3MuZW52LlRNUERJUiB8fCAnL3RtcCc7XG4gIGxldCBoYXNoID0gcmVxdWlyZSgnY3J5cHRvJykuY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKHByb2Nlc3MuZXhlY1BhdGgpLmRpZ2VzdCgnaGV4Jyk7XG5cbiAgbGV0IGNhY2hlRGlyID0gcGF0aC5qb2luKHRtcERpciwgYGNvbXBpbGVDYWNoZV8ke2hhc2h9YCk7XG4gIG1rZGlycC5zeW5jKGNhY2hlRGlyKTtcblxuICBkKGBVc2luZyBkZWZhdWx0IGNhY2hlIGRpcmVjdG9yeTogJHtjYWNoZURpcn1gKTtcbiAgcmV0dXJuIGNhY2hlRGlyO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGVmYXVsdCAuY29uZmlncmMgaWYgbm8gY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSAgQSBsaXN0IG9mIGRlZmF1bHQgY29uZmlnIHNldHRpbmdzIGZvciBlbGVjdHJvbi1jb21waWxlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRDb25maWd1cmF0aW9uKCkge1xuICByZXR1cm4ge1xuICAgICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0Jzoge1xuICAgICAgXCJwcmVzZXRzXCI6IFtcInN0YWdlLTBcIiwgXCJlczIwMTVcIiwgXCJyZWFjdFwiXSxcbiAgICAgIFwic291cmNlTWFwc1wiOiBcImlubGluZVwiXG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEFsbG93cyB5b3UgdG8gY3JlYXRlIG5ldyBpbnN0YW5jZXMgb2YgYWxsIGNvbXBpbGVycyB0aGF0IGFyZSBzdXBwb3J0ZWQgYnlcbiAqIGVsZWN0cm9uLWNvbXBpbGUgYW5kIHVzZSB0aGVtIGRpcmVjdGx5LiBDdXJyZW50bHkgc3VwcG9ydHMgQmFiZWwsIENvZmZlZVNjcmlwdCxcbiAqIFR5cGVTY3JpcHQsIExlc3MsIGFuZCBKYWRlLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gIEFuIE9iamVjdCB3aG9zZSBLZXlzIGFyZSBNSU1FIHR5cGVzLCBhbmQgd2hvc2UgdmFsdWVzXG4gKiBhcmUgaW5zdGFuY2VzIG9mIEB7bGluayBDb21waWxlckJhc2V9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZXJzKCkge1xuICBpZiAoIWFsbENvbXBpbGVyQ2xhc3Nlcykge1xuICAgIC8vIEZpcnN0IHdlIHdhbnQgdG8gc2VlIGlmIGVsZWN0cm9uLWNvbXBpbGVycyBpdHNlbGYgaGFzIGJlZW4gaW5zdGFsbGVkIHdpdGhcbiAgICAvLyBkZXZEZXBlbmRlbmNpZXMuIElmIHRoYXQncyBub3QgdGhlIGNhc2UsIGNoZWNrIHRvIHNlZSBpZlxuICAgIC8vIGVsZWN0cm9uLWNvbXBpbGVycyBpcyBpbnN0YWxsZWQgYXMgYSBwZWVyIGRlcGVuZGVuY3kgKHByb2JhYmx5IGFzIGFcbiAgICAvLyBkZXZEZXBlbmRlbmN5IG9mIHRoZSByb290IHByb2plY3QpLlxuICAgIGNvbnN0IGxvY2F0aW9ucyA9IFsnZWxlY3Ryb24tY29tcGlsZXJzJywgJy4uLy4uL2VsZWN0cm9uLWNvbXBpbGVycyddO1xuXG4gICAgZm9yIChsZXQgbG9jYXRpb24gb2YgbG9jYXRpb25zKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhbGxDb21waWxlckNsYXNzZXMgPSByZXF1aXJlKGxvY2F0aW9uKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gWW9sb1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghYWxsQ29tcGlsZXJDbGFzc2VzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbGVjdHJvbiBjb21waWxlcnMgbm90IGZvdW5kIGJ1dCB3ZXJlIHJlcXVlc3RlZCB0byBiZSBsb2FkZWRcIik7XG4gICAgfVxuICB9XG5cbiAgLy8gTkI6IE5vdGUgdGhhdCB0aGlzIGNvZGUgaXMgY2FyZWZ1bGx5IHNldCB1cCBzbyB0aGF0IElubGluZUh0bWxDb21waWxlclxuICAvLyAoaS5lLiBjbGFzc2VzIHdpdGggYGNyZWF0ZUZyb21Db21waWxlcnNgKSBpbml0aWFsbHkgZ2V0IGFuIGVtcHR5IG9iamVjdCxcbiAgLy8gYnV0IHdpbGwgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgZmluYWwgcmVzdWx0IG9mIHdoYXQgd2UgcmV0dXJuLCB3aGljaFxuICAvLyByZXNvbHZlcyB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeSB3ZSdkIG90aGVyd2lzZSBoYXZlIGhlcmUuXG4gIGxldCByZXQgPSB7fTtcbiAgbGV0IGluc3RhbnRpYXRlZENsYXNzZXMgPSBhbGxDb21waWxlckNsYXNzZXMubWFwKChLbGFzcykgPT4ge1xuICAgIGlmICgnY3JlYXRlRnJvbUNvbXBpbGVycycgaW4gS2xhc3MpIHtcbiAgICAgIHJldHVybiBLbGFzcy5jcmVhdGVGcm9tQ29tcGlsZXJzKHJldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgS2xhc3MoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbnRpYXRlZENsYXNzZXMucmVkdWNlKChhY2MseCkgPT4ge1xuICAgIGxldCBLbGFzcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih4KS5jb25zdHJ1Y3RvcjtcblxuICAgIGZvciAobGV0IHR5cGUgb2YgS2xhc3MuZ2V0SW5wdXRNaW1lVHlwZXMoKSkgeyBhY2NbdHlwZV0gPSB4OyB9XG4gICAgcmV0dXJuIGFjYztcbiAgfSwgcmV0KTtcblxuICByZXR1cm4gcmV0O1xufVxuIl19