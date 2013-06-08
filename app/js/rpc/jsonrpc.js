/**
 * @fileoverview JSON-RPC service.
 *
 * @author arunjitsingh
 */
'use strict';

/**
 * Provides and configures the jsonrpc service.
 *
 * TODO(arunjitsingh): Make this more like $resource.
 */
function JsonRpcProvider() {
  var defaults = this.defaults = {};
  defaults.rpcPath_ = '/rpc';

  function generateId() {
    /**! http://stackoverflow.com/a/2117523/377392 */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  this.$get = ['$http', function($http) {
    /**
     * Makes a JSON-RPC request to |method| with |data|.
     *
     * @param {{path:string=, method: string, data:*)}} options Call options.
     * @param {angular.HttpConfig} config HTTP config.
     * @return {angular.HttpPromise}
     */
    function jsonrpc(options, config) {
      var id = generateId();
      var payload = {
        'jsonrpc': '2.0',
        'method': options.method,
        'id': id
      };
      angular.isDefined(options.data) && (payload['params'] = options.data);

      var transformResponse = $http.defaults.transformResponse;
      transformResponse.push(function(data) {
        return data['id'] == id ? data['result'] || data['error'] : null;
      });

      config = config || {};
      if (angular.isArray(config['transformResponse'])) {
        [].push.apply(transformResponse, config['transformResponse']);
      }
      config['transformResponse'] = transformResponse;

      return $http.post(options.path || defaults.rpcPath_, payload, config);
    }

    /**
     * Shorthand for making a request with the default path.
     *
     * @param {string} method The method to call.
     * @param {?*} data The data for the call.
     * @param {angular.HttpConfig} config HTTP config.
     * @return {angular.HttpPromise}
     */
    jsonrpc.request = function(method, data, config) {
      return jsonrpc({method: method, data: data}, config);
    };

    /**
     * Shorthand for making a request with a path.
     *
     * @param {string} path The call path.
     * @param {string} method The method to call.
     * @param {?*} data The data for the call.
     * @param {angular.HttpConfig} config HTTP config.
     * @return {angular.HttpPromise}
     */
    jsonrpc.requestPath = function(path, method, data, config) {
      return jsonrpc({path: path, method: method, data: data}, config);
    };

    return jsonrpc;
  }];
}

/** Set the base path for JSON-RPC calls to |path|. */
JsonRpcProvider.prototype.setBasePath = function(path) {
  this.defaults.rpcPath_ = path;
}
