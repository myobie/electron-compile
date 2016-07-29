#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var main = exports.main = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(appDir, sourceDirs, cacheDir) {
    var _this = this;

    var compilerHost, rootCacheDir;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            compilerHost = null;

            if (!cacheDir || cacheDir.length < 1) {
              cacheDir = '.cache';
            }

            rootCacheDir = _path2.default.join(appDir, cacheDir);

            _mkdirp2.default.sync(rootCacheDir);

            if (process.env.NODE_ENV !== 'production') {
              console.log('Using NODE_ENV = ' + (process.env.NODE_ENV || 'development'));
            }

            d('main: ' + appDir + ', ' + (0, _stringify2.default)(sourceDirs));
            _context2.prev = 6;
            _context2.next = 9;
            return (0, _configParser.createCompilerHostFromProjectRoot)(appDir, rootCacheDir);

          case 9:
            compilerHost = _context2.sent;
            _context2.next = 17;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](6);

            console.error('Couldn\'t set up compilers: ' + _context2.t0.message);
            d(_context2.t0.stack);

            throw _context2.t0;

          case 17:
            _context2.next = 19;
            return _promise2.default.all(sourceDirs.map(function (dir) {
              return (0, _forAllFiles.forAllFiles)(dir, function () {
                var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(f) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.prev = 0;

                          d('Starting compilation for ' + f);
                          _context.next = 4;
                          return compilerHost.compile(f);

                        case 4:
                          _context.next = 11;
                          break;

                        case 6:
                          _context.prev = 6;
                          _context.t0 = _context['catch'](0);

                          console.error('Failed to compile file: ' + f);
                          console.error(_context.t0.message);

                          d(_context.t0.stack);

                        case 11:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this, [[0, 6]]);
                }));

                return function (_x4) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }));

          case 19:

            d('Saving out configuration');
            _context2.next = 22;
            return compilerHost.saveConfiguration();

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[6, 12]]);
  }));

  return function main(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

require('./babel-maybefill');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _configParser = require('./config-parser');

var _forAllFiles = require('./for-all-files');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('unhandledRejection', function (e) {
  d(e.message || e);
  d(e.stack || '');
});

process.on('uncaughtException', function (e) {
  d(e.message || e);
  d(e.stack || '');
});

var d = require('debug-electron')('electron-compile');

var yargs = require('yargs').usage('Usage: electron-compile --appdir [root-app-dir] paths...').alias('a', 'appdir').describe('a', 'The top-level application directory (i.e. where your package.json is)').default('a', process.cwd()).alias('c', 'cachedir').describe('c', 'The directory to put the cache').default('c', '.cache').help('h').alias('h', 'help').epilog('Copyright 2015');

if (process.mainModule === module) {
  var argv = yargs.argv;

  if (!argv._ || argv._.length < 1) {
    yargs.showHelp();
    process.exit(-1);
  }

  var sourceDirs = argv._;
  var appDir = argv.a;
  var cacheDir = argv.c;

  main(appDir, sourceDirs, cacheDir).then(function () {
    return process.exit(0);
  }).catch(function (e) {
    console.error(e.message || e);
    d(e.stack);

    console.error("Compilation failed!\nFor extra information, set the DEBUG environment variable to '*'");
    process.exit(-1);
  });
}
//# sourceMappingURL=data:application/json;base64,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SSxDQUFkOztBQVlBLElBQUksUUFBUSxVQUFSLEtBQXVCLE1BQTNCLEVBQW1DO0FBQ2pDLE1BQU0sT0FBTyxNQUFNLElBQW5COztBQUVBLE1BQUksQ0FBQyxLQUFLLENBQU4sSUFBVyxLQUFLLENBQUwsQ0FBTyxNQUFQLEdBQWdCLENBQS9CLEVBQWtDO0FBQ2hDLFVBQU0sUUFBTjtBQUNBLFlBQVEsSUFBUixDQUFhLENBQUMsQ0FBZDtBQUNEOztBQUVELE1BQU0sYUFBYSxLQUFLLENBQXhCO0FBQ0EsTUFBTSxTQUFTLEtBQUssQ0FBcEI7QUFDQSxNQUFNLFdBQVcsS0FBSyxDQUF0Qjs7QUFFQSxPQUFLLE1BQUwsRUFBYSxVQUFiLEVBQXlCLFFBQXpCLEVBQ0csSUFESCxDQUNRO0FBQUEsV0FBTSxRQUFRLElBQVIsQ0FBYSxDQUFiLENBQU47QUFBQSxHQURSLEVBRUcsS0FGSCxDQUVTLFVBQUMsQ0FBRCxFQUFPO0FBQ1osWUFBUSxLQUFSLENBQWMsRUFBRSxPQUFGLElBQWEsQ0FBM0I7QUFDQSxNQUFFLEVBQUUsS0FBSjs7QUFFQSxZQUFRLEtBQVIsQ0FBYyx1RkFBZDtBQUNBLFlBQVEsSUFBUixDQUFhLENBQUMsQ0FBZDtBQUNELEdBUkg7QUFTRCIsImZpbGUiOiJjbGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0ICcuL2JhYmVsLW1heWJlZmlsbCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcblxuaW1wb3J0IHtjcmVhdGVDb21waWxlckhvc3RGcm9tUHJvamVjdFJvb3R9IGZyb20gJy4vY29uZmlnLXBhcnNlcic7XG5pbXBvcnQge2ZvckFsbEZpbGVzfSBmcm9tICcuL2Zvci1hbGwtZmlsZXMnO1xuXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAoZSkgPT4ge1xuICBkKGUubWVzc2FnZSB8fCBlKTtcbiAgZChlLnN0YWNrIHx8ICcnKTtcbn0pO1xuXG5wcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIChlKSA9PiB7XG4gIGQoZS5tZXNzYWdlIHx8IGUpO1xuICBkKGUuc3RhY2sgfHwgJycpO1xufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKGFwcERpciwgc291cmNlRGlycywgY2FjaGVEaXIpIHtcbiAgbGV0IGNvbXBpbGVySG9zdCA9IG51bGw7XG4gIGlmICghY2FjaGVEaXIgfHwgY2FjaGVEaXIubGVuZ3RoIDwgMSkge1xuICAgIGNhY2hlRGlyID0gJy5jYWNoZSc7XG4gIH1cblxuICBsZXQgcm9vdENhY2hlRGlyID0gcGF0aC5qb2luKGFwcERpciwgY2FjaGVEaXIpO1xuICBta2RpcnAuc3luYyhyb290Q2FjaGVEaXIpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgY29uc29sZS5sb2coYFVzaW5nIE5PREVfRU5WID0gJHtwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnfWApO1xuICB9XG5cbiAgZChgbWFpbjogJHthcHBEaXJ9LCAke0pTT04uc3RyaW5naWZ5KHNvdXJjZURpcnMpfWApO1xuICB0cnkge1xuICAgIGNvbXBpbGVySG9zdCA9IGF3YWl0IGNyZWF0ZUNvbXBpbGVySG9zdEZyb21Qcm9qZWN0Um9vdChhcHBEaXIsIHJvb3RDYWNoZURpcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGBDb3VsZG4ndCBzZXQgdXAgY29tcGlsZXJzOiAke2UubWVzc2FnZX1gKTtcbiAgICBkKGUuc3RhY2spO1xuXG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIGF3YWl0IFByb21pc2UuYWxsKHNvdXJjZURpcnMubWFwKChkaXIpID0+IGZvckFsbEZpbGVzKGRpciwgYXN5bmMgKGYpID0+IHtcbiAgICB0cnkge1xuICAgICAgZChgU3RhcnRpbmcgY29tcGlsYXRpb24gZm9yICR7Zn1gKTtcbiAgICAgIGF3YWl0IGNvbXBpbGVySG9zdC5jb21waWxlKGYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBjb21waWxlIGZpbGU6ICR7Zn1gKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcblxuICAgICAgZChlLnN0YWNrKTtcbiAgICB9XG4gIH0pKSk7XG5cbiAgZCgnU2F2aW5nIG91dCBjb25maWd1cmF0aW9uJyk7XG4gIGF3YWl0IGNvbXBpbGVySG9zdC5zYXZlQ29uZmlndXJhdGlvbigpO1xufVxuXG5jb25zdCBkID0gcmVxdWlyZSgnZGVidWctZWxlY3Ryb24nKSgnZWxlY3Ryb24tY29tcGlsZScpO1xuXG5jb25zdCB5YXJncyA9IHJlcXVpcmUoJ3lhcmdzJylcbiAgLnVzYWdlKCdVc2FnZTogZWxlY3Ryb24tY29tcGlsZSAtLWFwcGRpciBbcm9vdC1hcHAtZGlyXSBwYXRocy4uLicpXG4gIC5hbGlhcygnYScsICdhcHBkaXInKVxuICAuZGVzY3JpYmUoJ2EnLCAnVGhlIHRvcC1sZXZlbCBhcHBsaWNhdGlvbiBkaXJlY3RvcnkgKGkuZS4gd2hlcmUgeW91ciBwYWNrYWdlLmpzb24gaXMpJylcbiAgLmRlZmF1bHQoJ2EnLCBwcm9jZXNzLmN3ZCgpKVxuICAuYWxpYXMoJ2MnLCAnY2FjaGVkaXInKVxuICAuZGVzY3JpYmUoJ2MnLCAnVGhlIGRpcmVjdG9yeSB0byBwdXQgdGhlIGNhY2hlJylcbiAgLmRlZmF1bHQoJ2MnLCAnLmNhY2hlJylcbiAgLmhlbHAoJ2gnKVxuICAuYWxpYXMoJ2gnLCAnaGVscCcpXG4gIC5lcGlsb2coJ0NvcHlyaWdodCAyMDE1Jyk7XG5cbmlmIChwcm9jZXNzLm1haW5Nb2R1bGUgPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmd2ID0geWFyZ3MuYXJndjtcblxuICBpZiAoIWFyZ3YuXyB8fCBhcmd2Ll8ubGVuZ3RoIDwgMSkge1xuICAgIHlhcmdzLnNob3dIZWxwKCk7XG4gICAgcHJvY2Vzcy5leGl0KC0xKTtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZURpcnMgPSBhcmd2Ll87XG4gIGNvbnN0IGFwcERpciA9IGFyZ3YuYTtcbiAgY29uc3QgY2FjaGVEaXIgPSBhcmd2LmM7XG5cbiAgbWFpbihhcHBEaXIsIHNvdXJjZURpcnMsIGNhY2hlRGlyKVxuICAgIC50aGVuKCgpID0+IHByb2Nlc3MuZXhpdCgwKSlcbiAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlIHx8IGUpO1xuICAgICAgZChlLnN0YWNrKTtcblxuICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBpbGF0aW9uIGZhaWxlZCFcXG5Gb3IgZXh0cmEgaW5mb3JtYXRpb24sIHNldCB0aGUgREVCVUcgZW52aXJvbm1lbnQgdmFyaWFibGUgdG8gJyonXCIpO1xuICAgICAgcHJvY2Vzcy5leGl0KC0xKTtcbiAgICB9KTtcbn1cbiJdfQ==