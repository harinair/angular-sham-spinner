/**
 * angular-sham-spinner version 0.0.13
 * License: MIT.
 * Created by Hari Gangadharan based on the code by Jim Lavin
 * http://codingsmackdown.tv/blog/2013/04/20/using-response-interceptors-to-show-and-hide-a-loading-widget-redux
 */
'use strict';

// Declare app level module
var app = angular.module('angularShamSpinner', []);

app.config(['$httpProvider', function ($httpProvider) {
    var interceptor = ['$injector', function ($injector) {
        return $injector.get('AngularShamInterceptor');
    }];
    $httpProvider.interceptors.push(interceptor);
}]);

app.factory('AngularShamInterceptor', [
    'AngularShamNotification',
    '$injector',
    '$q', function(angularShamNotification, $injector, $q) {
        var _http = null;
        var _requestEnded = function() {
            _http = _http || $injector.get('$http');
            if (_http.pendingRequests.length < 1) {
                // send notification requests are complete
                angularShamNotification.requestEnded();
            }
        };
        return {
            request: function(config) {
                angularShamNotification.requestStarted();
                return config;
            },

            response: function(response) {
                _requestEnded();
                return response;
            },

            responseError: function(reason) {
                _requestEnded();
                return $q.reject(reason);
            }
        }
    }]
);

app.factory('AngularShamNotification', ['$rootScope', '$timeout', function($rootScope, $timeout){
    // private notification messages
    var _START_REQUEST_ = 'angularShamNotification:_START_REQUEST_';
    var _END_REQUEST_ = 'angularShamNotification:_END_REQUEST_';
    var _disabled = false;
    var _lastTimeout = null;

    return {
        /**
         * This method shall be called when an HTTP request
         * started. This is called by the initiating component - the
         * HTTP interceptor.
         */
        requestStarted: function() {
            if (!_disabled) {
                $rootScope.$broadcast(_START_REQUEST_);
            }
        },

        /**
         * This method shall be called when an HTTP request
         * ends. This is called by the initiating component - the
         * HTTP interceptor.
         */
        requestEnded: function() {
            $rootScope.$broadcast(_END_REQUEST_);
        },

        /**
         * This method is invoked by any listener that wants to be
         * notified of the request start.
         *
         * @param handler
         */
        onRequestStarted: function(handler) {
            $rootScope.$on(_START_REQUEST_, function(event){
                handler(event);
            });
        },

        /**
         * This method is invoked by any listener that wants to be
         * notified of the request end.
         *
         * @param handler
         */
        onRequestEnded: function(handler) {
            $rootScope.$on(_END_REQUEST_, function(event){
                handler(event);
            });
        },

        /**
         * This method will disable sham spinner for the reset time. After
         * reset time the spinner will be enabled again. If reset time is
         * set to less than 0 then to enable spinner, call this method
         * again with false as the disable argument.
         *
         * @param disable       Set to true to disable the sham spinner
         * @param resetTime     reset time in ms (no reset if set to < 0)
         */
        setDisabled: function(disable, resetTime) {
            _disabled = disable;
            if (_disabled) {
                this.requestEnded();
                if (resetTime > 0) {
                    if (_lastTimeout !== null) {
                        $timeout.cancel(_lastTimeout);
                    }
                    _lastTimeout = $timeout(function() {
                        _disabled = false;
                        _lastTimeout = null;
                    }, resetTime);
                }
            } else {
                if (_lastTimeout !== null) {
                    $timeout.cancel(_lastTimeout);
                    _lastTimeout = null;
                }
            }
        }
    };
}]);

/**
 * The Sham Spinner angular directive. This will render appropriate sham
 * spinner and show/hide on ajax call start/end respectively.
 */
app.directive('shamSpinner', ['AngularShamNotification', '$timeout', function (angularShamNotification, $timeout) {
    var _timeout = undefined;
    return {
        restrict: "E",
        template: '<div class="sham-spinner-blocker" ng-show="loader"><div class="sham-spinner-container"><span class="spinner"></span><span class="text">{{text}}</span></div></div>',
        link: function (scope, element, attrs) {
            scope.text = attrs.text;
            // hide the element initially
            scope.loader = false;

            // subscribe to request started notification
            angularShamNotification.onRequestStarted(function() {
                // got the request start notification, show the element
                scope.loader = true;
            });

            // subscribe to request ended notification
            angularShamNotification.onRequestEnded(function() {
                // got the request end notification, hide the element
                if (_timeout) {
                    $timeout.cancel(_timeout);
                }
                _timeout = $timeout(function () {
                    scope.loader = false;
                    scope.$digest();
                }, 500);
            });
        }
    };
}]);
