/* angular-sham-spinner version 0.0.1
 * License: MIT.
 * Created by Hari Gangadharan based on the code by Jim Lavin
 * http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux
 */

'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('angularShamSpinner', []);

app.config(['$httpProvider', function ($httpProvider) {
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
            var notificationChannel;

            function success(response) {
                $http = $http || $injector.get('$http');
                if ($http.pendingRequests.length < 1) {
                    // get angularShamNotification via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('angularShamNotification');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get angularShamNotification via $injector because of circular dependency problem
                    notificationChannel = notificationChannel || $injector.get('angularShamNotification');
                    // send a notification requests are complete
                    notificationChannel.requestEnded();
                }
                return $q.reject(response);
            }

            return function (promise) {
                // get angularShamNotification via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('angularShamNotification');
                // send a notification requests are complete
                notificationChannel.requestStarted();
                return promise.then(success, error);
            }
        }];

    $httpProvider.responseInterceptors.push(interceptor);
}]);

app.factory('angularShamNotification', ['$rootScope', function($rootScope){
    // private notification messages
    var _START_REQUEST_ = '_START_REQUEST_';
    var _END_REQUEST_ = '_END_REQUEST_';

    // publish start request notification
    var requestStarted = function() {
        $rootScope.$broadcast(_START_REQUEST_);
    };
    // publish end request notification
    var requestEnded = function() {
        $rootScope.$broadcast(_END_REQUEST_);
    };
    // subscribe to start request notification
    var onRequestStarted = function($scope, handler){
        $scope.$on(_START_REQUEST_, function(event){
            handler();
        });
    };
    // subscribe to end request notification
    var onRequestEnded = function($scope, handler){
        $scope.$on(_END_REQUEST_, function(event){
            handler();
        });
    };

    return {
        requestStarted:  requestStarted,
        requestEnded: requestEnded,
        onRequestStarted: onRequestStarted,
        onRequestEnded: onRequestEnded
    };
}]);

app.directive('shamSpinner', ['angularShamNotification', function (angularShamNotification) {
    return {
        restrict: "A",
        link: function (scope, element) {
            // hide the element initially
            element.hide();

            var startRequestHandler = function() {
                // got the request start notification, show the element
                element.show();
            };

            var endRequestHandler = function() {
                // got the request start notification, show the element
                element.hide();
            };

            angularShamNotification.onRequestStarted(scope, startRequestHandler);

            angularShamNotification.onRequestEnded(scope, endRequestHandler);
        }
    };
}]);
