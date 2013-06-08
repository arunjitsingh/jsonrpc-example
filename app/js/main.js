/**
 * @fileoverview ...
 *
 * @author arunjitsingh
 */
'use strict';

// goog.inherits
function inherits(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};

angular.module('rpc', []).provider('jsonrpc', JsonRpcProvider);

angular.module('main', ['rpc']).
    config(['jsonrpcProvider', function(jsonrpcProvider) {
      jsonrpcProvider.setBasePath('http://localhost:8000/rpc');
    }]).
    service('locationService', LocationService).
    controller('MainCtrl', MainCtrl);


/** @ngInject */
function MainCtrl($scope, locationService) {
  $scope.data = {};
  locationService.get({'max': 10}).
      success(function(data) {
        $scope.data = data;
      }).
      error(function(error) {
        $scope.data = error;
      });
}


function RpcService(serviceName, jsonrpc) {
  this.serviceName = serviceName;
  this.jsonrpc = jsonrpc;
}

RpcService.prototype.serviceMethod = function(name) {
  var jsonrpc = this.jsonrpc;
  var method = this.serviceName + "." + name;
  return function(data) {
    return jsonrpc.request(method, data);
  }
}


/** @ngInject */
function LocationService(jsonrpc) {
  RpcService.call(this, 'locationsvc', jsonrpc);
  this.get = this.serviceMethod('Get')
}
inherits(LocationService, RpcService);
