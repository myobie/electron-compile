'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = createDigestForObject;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateDigestForJsonValue(shasum, value) {
  // Implmentation is similar to that of pretty-printing a JSON object, except:
  // * Strings are not escaped.
  // * No effort is made to avoid trailing commas.
  // These shortcuts should not affect the correctness of this function.
  var type = typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);

  if (type === 'string') {
    shasum.update('"', 'utf8');
    shasum.update(value, 'utf8');
    shasum.update('"', 'utf8');
    return;
  }

  if (type === 'boolean' || type === 'number') {
    shasum.update(value.toString(), 'utf8');
    return;
  }

  if (!value) {
    shasum.update('null', 'utf8');
    return;
  }

  if (Array.isArray(value)) {
    shasum.update('[', 'utf8');
    for (var i = 0; i < value.length; i++) {
      updateDigestForJsonValue(shasum, value[i]);
      shasum.update(',', 'utf8');
    }
    shasum.update(']', 'utf8');
    return;
  }

  // value must be an object: be sure to sort the keys.
  var keys = (0, _keys2.default)(value);
  keys.sort();

  shasum.update('{', 'utf8');

  for (var _i = 0; _i < keys.length; _i++) {
    updateDigestForJsonValue(shasum, keys[_i]);
    shasum.update(': ', 'utf8');
    updateDigestForJsonValue(shasum, value[keys[_i]]);
    shasum.update(',', 'utf8');
  }

  shasum.update('}', 'utf8');
}

/**
 * Creates a hash from a JS object
 * 
 * @private  
 */
function createDigestForObject(obj) {
  var sha1 = _crypto2.default.createHash('sha1');
  updateDigestForJsonValue(sha1, obj);

  return sha1.digest('hex');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kaWdlc3QtZm9yLW9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkEwRHdCLHFCOztBQTFEeEI7Ozs7OztBQUVBLFNBQVMsd0JBQVQsQ0FBa0MsTUFBbEMsRUFBMEMsS0FBMUMsRUFBaUQ7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGNBQWMsS0FBZCx1REFBYyxLQUFkLENBQU47O0FBRUEsTUFBSSxTQUFTLFFBQWIsRUFBdUI7QUFDckIsV0FBTyxNQUFQLENBQWMsR0FBZCxFQUFtQixNQUFuQjtBQUNBLFdBQU8sTUFBUCxDQUFjLEtBQWQsRUFBcUIsTUFBckI7QUFDQSxXQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLE1BQW5CO0FBQ0E7QUFDRDs7QUFFRCxNQUFJLFNBQVMsU0FBVCxJQUFzQixTQUFTLFFBQW5DLEVBQTZDO0FBQzNDLFdBQU8sTUFBUCxDQUFjLE1BQU0sUUFBTixFQUFkLEVBQWdDLE1BQWhDO0FBQ0E7QUFDRDs7QUFFRCxNQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1YsV0FBTyxNQUFQLENBQWMsTUFBZCxFQUFzQixNQUF0QjtBQUNBO0FBQ0Q7O0FBRUQsTUFBSSxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDeEIsV0FBTyxNQUFQLENBQWMsR0FBZCxFQUFtQixNQUFuQjtBQUNBLFNBQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFJLE1BQU0sTUFBeEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDbkMsK0JBQXlCLE1BQXpCLEVBQWlDLE1BQU0sQ0FBTixDQUFqQztBQUNBLGFBQU8sTUFBUCxDQUFjLEdBQWQsRUFBbUIsTUFBbkI7QUFDRDtBQUNELFdBQU8sTUFBUCxDQUFjLEdBQWQsRUFBbUIsTUFBbkI7QUFDQTtBQUNEOztBQUVEO0FBQ0EsTUFBSSxPQUFPLG9CQUFZLEtBQVosQ0FBWDtBQUNBLE9BQUssSUFBTDs7QUFFQSxTQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLE1BQW5COztBQUVBLE9BQUssSUFBSSxLQUFFLENBQVgsRUFBYyxLQUFJLEtBQUssTUFBdkIsRUFBK0IsSUFBL0IsRUFBb0M7QUFDbEMsNkJBQXlCLE1BQXpCLEVBQWlDLEtBQUssRUFBTCxDQUFqQztBQUNBLFdBQU8sTUFBUCxDQUFjLElBQWQsRUFBb0IsTUFBcEI7QUFDQSw2QkFBeUIsTUFBekIsRUFBaUMsTUFBTSxLQUFLLEVBQUwsQ0FBTixDQUFqQztBQUNBLFdBQU8sTUFBUCxDQUFjLEdBQWQsRUFBbUIsTUFBbkI7QUFDRDs7QUFFRCxTQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLE1BQW5CO0FBQ0Q7O0FBR0Q7Ozs7O0FBS2UsU0FBUyxxQkFBVCxDQUErQixHQUEvQixFQUFvQztBQUNqRCxNQUFJLE9BQU8saUJBQU8sVUFBUCxDQUFrQixNQUFsQixDQUFYO0FBQ0EsMkJBQXlCLElBQXpCLEVBQStCLEdBQS9COztBQUVBLFNBQU8sS0FBSyxNQUFMLENBQVksS0FBWixDQUFQO0FBQ0QiLCJmaWxlIjoiZGlnZXN0LWZvci1vYmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmZ1bmN0aW9uIHVwZGF0ZURpZ2VzdEZvckpzb25WYWx1ZShzaGFzdW0sIHZhbHVlKSB7XG4gIC8vIEltcGxtZW50YXRpb24gaXMgc2ltaWxhciB0byB0aGF0IG9mIHByZXR0eS1wcmludGluZyBhIEpTT04gb2JqZWN0LCBleGNlcHQ6XG4gIC8vICogU3RyaW5ncyBhcmUgbm90IGVzY2FwZWQuXG4gIC8vICogTm8gZWZmb3J0IGlzIG1hZGUgdG8gYXZvaWQgdHJhaWxpbmcgY29tbWFzLlxuICAvLyBUaGVzZSBzaG9ydGN1dHMgc2hvdWxkIG5vdCBhZmZlY3QgdGhlIGNvcnJlY3RuZXNzIG9mIHRoaXMgZnVuY3Rpb24uXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YodmFsdWUpO1xuXG4gIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHNoYXN1bS51cGRhdGUoJ1wiJywgJ3V0ZjgnKTtcbiAgICBzaGFzdW0udXBkYXRlKHZhbHVlLCAndXRmOCcpO1xuICAgIHNoYXN1bS51cGRhdGUoJ1wiJywgJ3V0ZjgnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgc2hhc3VtLnVwZGF0ZSh2YWx1ZS50b1N0cmluZygpLCAndXRmOCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghdmFsdWUpIHtcbiAgICBzaGFzdW0udXBkYXRlKCdudWxsJywgJ3V0ZjgnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBzaGFzdW0udXBkYXRlKCdbJywgJ3V0ZjgnKTtcbiAgICBmb3IgKGxldCBpPTA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdXBkYXRlRGlnZXN0Rm9ySnNvblZhbHVlKHNoYXN1bSwgdmFsdWVbaV0pO1xuICAgICAgc2hhc3VtLnVwZGF0ZSgnLCcsICd1dGY4Jyk7XG4gICAgfVxuICAgIHNoYXN1bS51cGRhdGUoJ10nLCAndXRmOCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIHZhbHVlIG11c3QgYmUgYW4gb2JqZWN0OiBiZSBzdXJlIHRvIHNvcnQgdGhlIGtleXMuXG4gIGxldCBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICBrZXlzLnNvcnQoKTtcblxuICBzaGFzdW0udXBkYXRlKCd7JywgJ3V0ZjgnKTtcblxuICBmb3IgKGxldCBpPTA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdXBkYXRlRGlnZXN0Rm9ySnNvblZhbHVlKHNoYXN1bSwga2V5c1tpXSk7XG4gICAgc2hhc3VtLnVwZGF0ZSgnOiAnLCAndXRmOCcpO1xuICAgIHVwZGF0ZURpZ2VzdEZvckpzb25WYWx1ZShzaGFzdW0sIHZhbHVlW2tleXNbaV1dKTtcbiAgICBzaGFzdW0udXBkYXRlKCcsJywgJ3V0ZjgnKTtcbiAgfVxuXG4gIHNoYXN1bS51cGRhdGUoJ30nLCAndXRmOCcpO1xufVxuXG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggZnJvbSBhIEpTIG9iamVjdFxuICogXG4gKiBAcHJpdmF0ZSAgXG4gKi8gXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVEaWdlc3RGb3JPYmplY3Qob2JqKSB7XG4gIGxldCBzaGExID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKTtcbiAgdXBkYXRlRGlnZXN0Rm9ySnNvblZhbHVlKHNoYTEsIG9iaik7XG4gIFxuICByZXR1cm4gc2hhMS5kaWdlc3QoJ2hleCcpO1xufVxuIl19