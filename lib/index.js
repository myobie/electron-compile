'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

require('./babel-maybefill');

var _configParser = require('./config-parser');

var configParser = _interopRequireWildcard(_configParser);

var _compilerHost = require('./compiler-host');

var _compilerHost2 = _interopRequireDefault(_compilerHost);

var _fileChangeCache = require('./file-change-cache');

var _fileChangeCache2 = _interopRequireDefault(_fileChangeCache);

var _compileCache = require('./compile-cache');

var _compileCache2 = _interopRequireDefault(_compileCache);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _assign2.default)({}, configParser, { CompilerHost: _compilerHost2.default, FileChangedCache: _fileChangeCache2.default, CompileCache: _compileCache2.default });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQTs7SUFBWSxZOztBQUVaOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsc0JBQWMsRUFBZCxFQUNmLFlBRGUsRUFFZixFQUFFLG9DQUFGLEVBQWdCLDJDQUFoQixFQUFrQyxvQ0FBbEMsRUFGZSxDQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9iYWJlbC1tYXliZWZpbGwnO1xuXG5pbXBvcnQgKiBhcyBjb25maWdQYXJzZXIgZnJvbSAnLi9jb25maWctcGFyc2VyJztcblxuaW1wb3J0IENvbXBpbGVySG9zdCBmcm9tICcuL2NvbXBpbGVyLWhvc3QnO1xuaW1wb3J0IEZpbGVDaGFuZ2VkQ2FjaGUgZnJvbSAnLi9maWxlLWNoYW5nZS1jYWNoZSc7XG5pbXBvcnQgQ29tcGlsZUNhY2hlIGZyb20gJy4vY29tcGlsZS1jYWNoZSc7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbih7fSxcbiAgY29uZmlnUGFyc2VyLFxuICB7IENvbXBpbGVySG9zdCwgRmlsZUNoYW5nZWRDYWNoZSwgQ29tcGlsZUNhY2hlIH1cbik7XG4iXX0=