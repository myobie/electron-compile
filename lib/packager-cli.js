#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packagerMain = exports.runAsarArchive = exports.packageDirToResourcesDir = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var packageDirToResourcesDir = exports.packageDirToResourcesDir = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(packageDir) {
    var appDir;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _promise.pfs.readdir(packageDir);

          case 2:
            _context.t0 = function (x) {
              return x.match(/\.app$/i);
            };

            appDir = _context.sent.find(_context.t0);

            if (!appDir) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', _path2.default.join(packageDir, appDir, 'Contents', 'Resources', 'app'));

          case 8:
            return _context.abrupt('return', _path2.default.join(packageDir, 'resources', 'app'));

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function packageDirToResourcesDir(_x) {
    return _ref.apply(this, arguments);
  };
}();

var copySmallFile = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(from, to) {
    var buf;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            d('Copying ' + from + ' => ' + to);

            _context2.next = 3;
            return _promise.pfs.readFile(from);

          case 3:
            buf = _context2.sent;
            _context2.next = 6;
            return _promise.pfs.writeFile(to, buf);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function copySmallFile(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var compileAndShim = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(packageDir) {
    var appDir, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, entry, fullPath, stat, packageJson, index;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return packageDirToResourcesDir(packageDir);

          case 2:
            appDir = _context3.sent;


            d('Looking in ' + appDir);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 7;
            _context3.next = 10;
            return _promise.pfs.readdir(appDir);

          case 10:
            _context3.t0 = _context3.sent;
            _iterator = (0, _getIterator3.default)(_context3.t0);

          case 12:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context3.next = 28;
              break;
            }

            entry = _step.value;

            if (!entry.match(/^(node_modules|bower_components)$/)) {
              _context3.next = 16;
              break;
            }

            return _context3.abrupt('continue', 25);

          case 16:
            fullPath = _path2.default.join(appDir, entry);
            _context3.next = 19;
            return _promise.pfs.stat(fullPath);

          case 19:
            stat = _context3.sent;

            if (stat.isDirectory()) {
              _context3.next = 22;
              break;
            }

            return _context3.abrupt('continue', 25);

          case 22:

            d('Executing electron-compile: ' + appDir + ' => ' + entry);
            _context3.next = 25;
            return (0, _cli.main)(appDir, [fullPath]);

          case 25:
            _iteratorNormalCompletion = true;
            _context3.next = 12;
            break;

          case 28:
            _context3.next = 34;
            break;

          case 30:
            _context3.prev = 30;
            _context3.t1 = _context3['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context3.t1;

          case 34:
            _context3.prev = 34;
            _context3.prev = 35;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 37:
            _context3.prev = 37;

            if (!_didIteratorError) {
              _context3.next = 40;
              break;
            }

            throw _iteratorError;

          case 40:
            return _context3.finish(37);

          case 41:
            return _context3.finish(34);

          case 42:

            d('Copying in es6-shim');
            _context3.t2 = JSON;
            _context3.next = 46;
            return _promise.pfs.readFile(_path2.default.join(appDir, 'package.json'), 'utf8');

          case 46:
            _context3.t3 = _context3.sent;
            packageJson = _context3.t2.parse.call(_context3.t2, _context3.t3);
            index = packageJson.main || 'index.js';

            packageJson.originalMain = index;
            packageJson.main = 'es6-shim.js';

            _context3.next = 53;
            return copySmallFile(_path2.default.join(__dirname, 'es6-shim.js'), _path2.default.join(appDir, 'es6-shim.js'));

          case 53:
            _context3.next = 55;
            return _promise.pfs.writeFile(_path2.default.join(appDir, 'package.json'), (0, _stringify2.default)(packageJson, null, 2));

          case 55:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[7, 30, 34, 42], [35,, 37, 41]]);
  }));

  return function compileAndShim(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var runAsarArchive = exports.runAsarArchive = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(packageDir, asarUnpackDir) {
    var appDir, asarArgs, _findExecutableOrGues, cmd, args;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return packageDirToResourcesDir(packageDir);

          case 2:
            appDir = _context4.sent;
            asarArgs = ['pack', 'app', 'app.asar'];

            if (asarUnpackDir) {
              asarArgs.push('--unpack-dir', asarUnpackDir);
            }

            _findExecutableOrGues = findExecutableOrGuess('asar', asarArgs);
            cmd = _findExecutableOrGues.cmd;
            args = _findExecutableOrGues.args;


            d('Running ' + cmd + ' ' + (0, _stringify2.default)(args));
            _context4.next = 11;
            return (0, _spawnRx.spawnPromise)(cmd, args, { cwd: _path2.default.join(appDir, '..') });

          case 11:
            _rimraf2.default.sync(_path2.default.join(appDir));

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function runAsarArchive(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

var packagerMain = exports.packagerMain = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(argv) {
    var _splitOutAsarArgument, packagerArgs, asarArgs, _findExecutableOrGues2, cmd, args, packagerOutput, packageDirs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, packageDir, asarUnpackDir;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            d('argv: ' + (0, _stringify2.default)(argv));
            argv = argv.splice(2);

            _splitOutAsarArgument = splitOutAsarArguments(argv);
            packagerArgs = _splitOutAsarArgument.packagerArgs;
            asarArgs = _splitOutAsarArgument.asarArgs;
            _findExecutableOrGues2 = findExecutableOrGuess(electronPackager, packagerArgs);
            cmd = _findExecutableOrGues2.cmd;
            args = _findExecutableOrGues2.args;


            d('Spawning electron-packager: ' + (0, _stringify2.default)(args));
            _context5.next = 11;
            return (0, _spawnRx.spawnPromise)(cmd, args);

          case 11:
            packagerOutput = _context5.sent;
            packageDirs = parsePackagerOutput(packagerOutput);


            d('Starting compilation for ' + (0, _stringify2.default)(packageDirs));
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 17;
            _iterator2 = (0, _getIterator3.default)(packageDirs);

          case 19:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context5.next = 33;
              break;
            }

            packageDir = _step2.value;
            _context5.next = 23;
            return compileAndShim(packageDir);

          case 23:
            if (asarArgs) {
              _context5.next = 25;
              break;
            }

            return _context5.abrupt('continue', 30);

          case 25:

            d('Starting ASAR packaging');
            asarUnpackDir = null;

            if (asarArgs.length === 2) {
              asarUnpackDir = asarArgs[1];
            }

            _context5.next = 30;
            return runAsarArchive(packageDir, asarUnpackDir);

          case 30:
            _iteratorNormalCompletion2 = true;
            _context5.next = 19;
            break;

          case 33:
            _context5.next = 39;
            break;

          case 35:
            _context5.prev = 35;
            _context5.t0 = _context5['catch'](17);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t0;

          case 39:
            _context5.prev = 39;
            _context5.prev = 40;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 42:
            _context5.prev = 42;

            if (!_didIteratorError2) {
              _context5.next = 45;
              break;
            }

            throw _iteratorError2;

          case 45:
            return _context5.finish(42);

          case 46:
            return _context5.finish(39);

          case 47:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[17, 35, 39, 47], [40,, 42, 46]]);
  }));

  return function packagerMain(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

exports.splitOutAsarArguments = splitOutAsarArguments;
exports.parsePackagerOutput = parsePackagerOutput;
exports.findExecutableOrGuess = findExecutableOrGuess;

require('./babel-maybefill');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _promise = require('./promise');

var _cli = require('./cli');

var _spawnRx = require('spawn-rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var d = require('debug-electron')('electron-compile:packager');
var electronPackager = 'electron-packager';

function splitOutAsarArguments(argv) {
  if (argv.find(function (x) {
    return x.match(/^--asar-unpack$/);
  })) {
    throw new Error("electron-compile doesn't support --asar-unpack at the moment, use asar-unpack-dir");
  }

  // Strip --asar altogether
  var ret = argv.filter(function (x) {
    return !x.match(/^--asar/);
  });

  if (ret.length === argv.length) {
    return { packagerArgs: ret, asarArgs: null };
  }

  var indexOfUnpack = ret.findIndex(function (x) {
    return x.match(/^--asar-unpack-dir$/);
  });
  if (indexOfUnpack < 0) {
    return { packagerArgs: ret, asarArgs: [] };
  }

  var unpackArgs = ret.slice(indexOfUnpack, indexOfUnpack + 1);
  var notUnpackArgs = ret.slice(0, indexOfUnpack).concat(ret.slice(indexOfUnpack + 2));

  return { packagerArgs: notUnpackArgs, asarArgs: unpackArgs };
}

function parsePackagerOutput(output) {
  // NB: Yes, this is fragile as fuck. :-/
  console.log(output);
  var lines = output.split('\n');

  var idx = lines.findIndex(function (x) {
    return x.match(/Wrote new app/i);
  });
  if (idx < 1) throw new Error('Packager output is invalid: ' + output);
  lines = lines.splice(idx);

  // Multi-platform case
  if (lines[0].match(/Wrote new apps/)) {
    return lines.splice(1).filter(function (x) {
      return x.length > 1;
    });
  } else {
    return [lines[0].replace(/^.*new app to /, '')];
  }
}

function findExecutableOrGuess(cmdToFind, argsToUse) {
  var _findActualExecutable = (0, _spawnRx.findActualExecutable)(cmdToFind, argsToUse);

  var cmd = _findActualExecutable.cmd;
  var args = _findActualExecutable.args;

  if (cmd === electronPackager) {
    d('Can\'t find ' + cmdToFind + ', falling back to where it should be as a guess!');
    cmd = (0, _spawnRx.findActualExecutable)(_path2.default.resolve(__dirname, '..', '..', '.bin', cmdToFind)).cmd;
  }

  return { cmd: cmd, args: args };
}

if (process.mainModule === module) {
  packagerMain(process.argv).then(function () {
    return process.exit(0);
  }).catch(function (e) {
    console.error(e.message || e);
    d(e.stack);

    process.exit(-1);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlci1jbGkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dFQWNPLGlCQUF3QyxVQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUNlLGFBQUksT0FBSixDQUFZLFVBQVosQ0FEZjs7QUFBQTtBQUFBLDBCQUM2QyxVQUFDLENBQUQ7QUFBQSxxQkFBTyxFQUFFLEtBQUYsQ0FBUSxTQUFSLENBQVA7QUFBQSxhQUQ3Qzs7QUFDRCxrQkFEQyxpQkFDd0MsSUFEeEM7O0FBQUEsaUJBRUQsTUFGQztBQUFBO0FBQUE7QUFBQTs7QUFBQSw2Q0FHSSxlQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLE1BQXRCLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDLEVBQXVELEtBQXZELENBSEo7O0FBQUE7QUFBQSw2Q0FLSSxlQUFLLElBQUwsQ0FBVSxVQUFWLEVBQXNCLFdBQXRCLEVBQW1DLEtBQW5DLENBTEo7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWUsd0I7Ozs7Ozt5RUFTdEIsa0JBQTZCLElBQTdCLEVBQW1DLEVBQW5DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLDJCQUFhLElBQWIsWUFBd0IsRUFBeEI7O0FBREY7QUFBQSxtQkFHa0IsYUFBSSxRQUFKLENBQWEsSUFBYixDQUhsQjs7QUFBQTtBQUdNLGVBSE47QUFBQTtBQUFBLG1CQUlRLGFBQUksU0FBSixDQUFjLEVBQWQsRUFBa0IsR0FBbEIsQ0FKUjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOztrQkFBZSxhOzs7Ozs7eUVBNkNmLGtCQUE4QixVQUE5QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDcUIseUJBQXlCLFVBQXpCLENBRHJCOztBQUFBO0FBQ00sa0JBRE47OztBQUdFLDhCQUFnQixNQUFoQjtBQUhGO0FBQUE7QUFB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VUFBUixLQUF1QixNQUEzQixFQUFtQztBQUNqQyxlQUFhLFFBQVEsSUFBckIsRUFDRyxJQURILENBQ1E7QUFBQSxXQUFNLFFBQVEsSUFBUixDQUFhLENBQWIsQ0FBTjtBQUFBLEdBRFIsRUFFRyxLQUZILENBRVMsVUFBQyxDQUFELEVBQU87QUFDWixZQUFRLEtBQVIsQ0FBYyxFQUFFLE9BQUYsSUFBYSxDQUEzQjtBQUNBLE1BQUUsRUFBRSxLQUFKOztBQUVBLFlBQVEsSUFBUixDQUFhLENBQUMsQ0FBZDtBQUNELEdBUEg7QUFRRCIsImZpbGUiOiJwYWNrYWdlci1jbGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAnLi9iYWJlbC1tYXliZWZpbGwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJztcblxuaW1wb3J0IHtwZnN9IGZyb20gJy4vcHJvbWlzZSc7XG5pbXBvcnQge21haW59IGZyb20gJy4vY2xpJztcblxuaW1wb3J0IHtzcGF3blByb21pc2UsIGZpbmRBY3R1YWxFeGVjdXRhYmxlfSBmcm9tICdzcGF3bi1yeCc7XG5cbmNvbnN0IGQgPSByZXF1aXJlKCdkZWJ1Zy1lbGVjdHJvbicpKCdlbGVjdHJvbi1jb21waWxlOnBhY2thZ2VyJyk7XG5jb25zdCBlbGVjdHJvblBhY2thZ2VyID0gJ2VsZWN0cm9uLXBhY2thZ2VyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhY2thZ2VEaXJUb1Jlc291cmNlc0RpcihwYWNrYWdlRGlyKSB7XG4gIGxldCBhcHBEaXIgPSAoYXdhaXQgcGZzLnJlYWRkaXIocGFja2FnZURpcikpLmZpbmQoKHgpID0+IHgubWF0Y2goL1xcLmFwcCQvaSkpO1xuICBpZiAoYXBwRGlyKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihwYWNrYWdlRGlyLCBhcHBEaXIsICdDb250ZW50cycsICdSZXNvdXJjZXMnLCAnYXBwJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihwYWNrYWdlRGlyLCAncmVzb3VyY2VzJywgJ2FwcCcpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvcHlTbWFsbEZpbGUoZnJvbSwgdG8pIHtcbiAgZChgQ29weWluZyAke2Zyb219ID0+ICR7dG99YCk7XG5cbiAgbGV0IGJ1ZiA9IGF3YWl0IHBmcy5yZWFkRmlsZShmcm9tKTtcbiAgYXdhaXQgcGZzLndyaXRlRmlsZSh0bywgYnVmKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0T3V0QXNhckFyZ3VtZW50cyhhcmd2KSB7XG4gIGlmIChhcmd2LmZpbmQoKHgpID0+IHgubWF0Y2goL14tLWFzYXItdW5wYWNrJC8pKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImVsZWN0cm9uLWNvbXBpbGUgZG9lc24ndCBzdXBwb3J0IC0tYXNhci11bnBhY2sgYXQgdGhlIG1vbWVudCwgdXNlIGFzYXItdW5wYWNrLWRpclwiKTtcbiAgfVxuXG4gIC8vIFN0cmlwIC0tYXNhciBhbHRvZ2V0aGVyXG4gIGxldCByZXQgPSBhcmd2LmZpbHRlcigoeCkgPT4gIXgubWF0Y2goL14tLWFzYXIvKSk7XG5cbiAgaWYgKHJldC5sZW5ndGggPT09IGFyZ3YubGVuZ3RoKSB7IHJldHVybiB7IHBhY2thZ2VyQXJnczogcmV0LCBhc2FyQXJnczogbnVsbCB9OyB9XG5cbiAgbGV0IGluZGV4T2ZVbnBhY2sgPSByZXQuZmluZEluZGV4KCh4KSA9PiB4Lm1hdGNoKC9eLS1hc2FyLXVucGFjay1kaXIkLykpO1xuICBpZiAoaW5kZXhPZlVucGFjayA8IDApIHtcbiAgICByZXR1cm4geyBwYWNrYWdlckFyZ3M6IHJldCwgYXNhckFyZ3M6IFtdIH07XG4gIH1cblxuICBsZXQgdW5wYWNrQXJncyA9IHJldC5zbGljZShpbmRleE9mVW5wYWNrLCBpbmRleE9mVW5wYWNrKzEpO1xuICBsZXQgbm90VW5wYWNrQXJncyA9IHJldC5zbGljZSgwLCBpbmRleE9mVW5wYWNrKS5jb25jYXQocmV0LnNsaWNlKGluZGV4T2ZVbnBhY2srMikpO1xuXG4gIHJldHVybiB7IHBhY2thZ2VyQXJnczogbm90VW5wYWNrQXJncywgYXNhckFyZ3M6IHVucGFja0FyZ3MgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUGFja2FnZXJPdXRwdXQob3V0cHV0KSB7XG4gIC8vIE5COiBZZXMsIHRoaXMgaXMgZnJhZ2lsZSBhcyBmdWNrLiA6LS9cbiAgY29uc29sZS5sb2cob3V0cHV0KTtcbiAgbGV0IGxpbmVzID0gb3V0cHV0LnNwbGl0KCdcXG4nKTtcblxuICBsZXQgaWR4ID0gbGluZXMuZmluZEluZGV4KCh4KSA9PiB4Lm1hdGNoKC9Xcm90ZSBuZXcgYXBwL2kpKTtcbiAgaWYgKGlkeCA8IDEpIHRocm93IG5ldyBFcnJvcihgUGFja2FnZXIgb3V0cHV0IGlzIGludmFsaWQ6ICR7b3V0cHV0fWApO1xuICBsaW5lcyA9IGxpbmVzLnNwbGljZShpZHgpO1xuXG4gIC8vIE11bHRpLXBsYXRmb3JtIGNhc2VcbiAgaWYgKGxpbmVzWzBdLm1hdGNoKC9Xcm90ZSBuZXcgYXBwcy8pKSB7XG4gICAgcmV0dXJuIGxpbmVzLnNwbGljZSgxKS5maWx0ZXIoKHgpID0+IHgubGVuZ3RoID4gMSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFtsaW5lc1swXS5yZXBsYWNlKC9eLipuZXcgYXBwIHRvIC8sICcnKV07XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY29tcGlsZUFuZFNoaW0ocGFja2FnZURpcikge1xuICBsZXQgYXBwRGlyID0gYXdhaXQgcGFja2FnZURpclRvUmVzb3VyY2VzRGlyKHBhY2thZ2VEaXIpO1xuXG4gIGQoYExvb2tpbmcgaW4gJHthcHBEaXJ9YCk7XG4gIGZvciAobGV0IGVudHJ5IG9mIGF3YWl0IHBmcy5yZWFkZGlyKGFwcERpcikpIHtcbiAgICBpZiAoZW50cnkubWF0Y2goL14obm9kZV9tb2R1bGVzfGJvd2VyX2NvbXBvbmVudHMpJC8pKSBjb250aW51ZTtcblxuICAgIGxldCBmdWxsUGF0aCA9IHBhdGguam9pbihhcHBEaXIsIGVudHJ5KTtcbiAgICBsZXQgc3RhdCA9IGF3YWl0IHBmcy5zdGF0KGZ1bGxQYXRoKTtcblxuICAgIGlmICghc3RhdC5pc0RpcmVjdG9yeSgpKSBjb250aW51ZTtcblxuICAgIGQoYEV4ZWN1dGluZyBlbGVjdHJvbi1jb21waWxlOiAke2FwcERpcn0gPT4gJHtlbnRyeX1gKTtcbiAgICBhd2FpdCBtYWluKGFwcERpciwgW2Z1bGxQYXRoXSk7XG4gIH1cblxuICBkKCdDb3B5aW5nIGluIGVzNi1zaGltJyk7XG4gIGxldCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UoXG4gICAgYXdhaXQgcGZzLnJlYWRGaWxlKHBhdGguam9pbihhcHBEaXIsICdwYWNrYWdlLmpzb24nKSwgJ3V0ZjgnKSk7XG5cbiAgbGV0IGluZGV4ID0gcGFja2FnZUpzb24ubWFpbiB8fCAnaW5kZXguanMnO1xuICBwYWNrYWdlSnNvbi5vcmlnaW5hbE1haW4gPSBpbmRleDtcbiAgcGFja2FnZUpzb24ubWFpbiA9ICdlczYtc2hpbS5qcyc7XG5cbiAgYXdhaXQgY29weVNtYWxsRmlsZShcbiAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZXM2LXNoaW0uanMnKSxcbiAgICBwYXRoLmpvaW4oYXBwRGlyLCAnZXM2LXNoaW0uanMnKSk7XG5cbiAgYXdhaXQgcGZzLndyaXRlRmlsZShcbiAgICBwYXRoLmpvaW4oYXBwRGlyLCAncGFja2FnZS5qc29uJyksXG4gICAgSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24sIG51bGwsIDIpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bkFzYXJBcmNoaXZlKHBhY2thZ2VEaXIsIGFzYXJVbnBhY2tEaXIpIHtcbiAgbGV0IGFwcERpciA9IGF3YWl0IHBhY2thZ2VEaXJUb1Jlc291cmNlc0RpcihwYWNrYWdlRGlyKTtcblxuICBsZXQgYXNhckFyZ3MgPSBbJ3BhY2snLCAnYXBwJywgJ2FwcC5hc2FyJ107XG4gIGlmIChhc2FyVW5wYWNrRGlyKSB7XG4gICAgYXNhckFyZ3MucHVzaCgnLS11bnBhY2stZGlyJywgYXNhclVucGFja0Rpcik7XG4gIH1cblxuICBsZXQgeyBjbWQsIGFyZ3MgfSA9IGZpbmRFeGVjdXRhYmxlT3JHdWVzcygnYXNhcicsIGFzYXJBcmdzKTtcblxuICBkKGBSdW5uaW5nICR7Y21kfSAke0pTT04uc3RyaW5naWZ5KGFyZ3MpfWApO1xuICBhd2FpdCBzcGF3blByb21pc2UoY21kLCBhcmdzLCB7IGN3ZDogcGF0aC5qb2luKGFwcERpciwgJy4uJykgfSk7XG4gIHJpbXJhZi5zeW5jKHBhdGguam9pbihhcHBEaXIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFeGVjdXRhYmxlT3JHdWVzcyhjbWRUb0ZpbmQsIGFyZ3NUb1VzZSkge1xuICBsZXQgeyBjbWQsIGFyZ3MgfSA9IGZpbmRBY3R1YWxFeGVjdXRhYmxlKGNtZFRvRmluZCwgYXJnc1RvVXNlKTtcbiAgaWYgKGNtZCA9PT0gZWxlY3Ryb25QYWNrYWdlcikge1xuICAgIGQoYENhbid0IGZpbmQgJHtjbWRUb0ZpbmR9LCBmYWxsaW5nIGJhY2sgdG8gd2hlcmUgaXQgc2hvdWxkIGJlIGFzIGEgZ3Vlc3MhYCk7XG4gICAgY21kID0gZmluZEFjdHVhbEV4ZWN1dGFibGUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy5iaW4nLCBjbWRUb0ZpbmQpKS5jbWQ7XG4gIH1cblxuICByZXR1cm4geyBjbWQsIGFyZ3MgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhY2thZ2VyTWFpbihhcmd2KSB7XG4gIGQoYGFyZ3Y6ICR7SlNPTi5zdHJpbmdpZnkoYXJndil9YCk7XG4gIGFyZ3YgPSBhcmd2LnNwbGljZSgyKTtcblxuICBsZXQgeyBwYWNrYWdlckFyZ3MsIGFzYXJBcmdzIH0gPSBzcGxpdE91dEFzYXJBcmd1bWVudHMoYXJndik7XG4gIGxldCB7IGNtZCwgYXJncyB9ID0gZmluZEV4ZWN1dGFibGVPckd1ZXNzKGVsZWN0cm9uUGFja2FnZXIsIHBhY2thZ2VyQXJncyk7XG5cbiAgZChgU3Bhd25pbmcgZWxlY3Ryb24tcGFja2FnZXI6ICR7SlNPTi5zdHJpbmdpZnkoYXJncyl9YCk7XG4gIGxldCBwYWNrYWdlck91dHB1dCA9IGF3YWl0IHNwYXduUHJvbWlzZShjbWQsIGFyZ3MpO1xuICBsZXQgcGFja2FnZURpcnMgPSBwYXJzZVBhY2thZ2VyT3V0cHV0KHBhY2thZ2VyT3V0cHV0KTtcblxuICBkKGBTdGFydGluZyBjb21waWxhdGlvbiBmb3IgJHtKU09OLnN0cmluZ2lmeShwYWNrYWdlRGlycyl9YCk7XG4gIGZvciAobGV0IHBhY2thZ2VEaXIgb2YgcGFja2FnZURpcnMpIHtcbiAgICBhd2FpdCBjb21waWxlQW5kU2hpbShwYWNrYWdlRGlyKTtcblxuICAgIGlmICghYXNhckFyZ3MpIGNvbnRpbnVlO1xuXG4gICAgZCgnU3RhcnRpbmcgQVNBUiBwYWNrYWdpbmcnKTtcbiAgICBsZXQgYXNhclVucGFja0RpciA9IG51bGw7XG4gICAgaWYgKGFzYXJBcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgYXNhclVucGFja0RpciA9IGFzYXJBcmdzWzFdO1xuICAgIH1cblxuICAgIGF3YWl0IHJ1bkFzYXJBcmNoaXZlKHBhY2thZ2VEaXIsIGFzYXJVbnBhY2tEaXIpO1xuICB9XG59XG5cbmlmIChwcm9jZXNzLm1haW5Nb2R1bGUgPT09IG1vZHVsZSkge1xuICBwYWNrYWdlck1haW4ocHJvY2Vzcy5hcmd2KVxuICAgIC50aGVuKCgpID0+IHByb2Nlc3MuZXhpdCgwKSlcbiAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlIHx8IGUpO1xuICAgICAgZChlLnN0YWNrKTtcblxuICAgICAgcHJvY2Vzcy5leGl0KC0xKTtcbiAgICB9KTtcbn1cbiJdfQ==