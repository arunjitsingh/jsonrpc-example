/**
 * @fileoverview ...
 *
 * @author arunjitsingh
 */
'use strict';

function JsonRpcProvider() {
  var defaults = this.defaults = {};
  defaults.rpcBasePath = '/rpc';

  function generateId() {
    /**! http://stackoverflow.com/a/2117523/377392 */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  this.$get = ['$http', function($http) {
    function jsonrpc() {}

    jsonrpc.send = function(method, params) {
      var id = generateId();
      var transformResponse = $http.defaults.transformResponse;
      transformResponse.push(function(data) {
        return data['id'] == id ? data['result'] || data['error'] : null;
      });
      return $http.post(defaults.rpcBasePath, {
        'method': method,
        'params': [params],
        'id': id
      }, {
        'transformResponse': transformResponse
      });
    };

    jsonrpc.defaults = defaults;

    return jsonrpc;
  }];
}
