/**
 * angular-sham-spinner version 0.0.5
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

app.factory('AngularShamNotification', ['$rootScope', function($rootScope){
    // private notification messages
    var _START_REQUEST_ = 'angularShamNotification:_START_REQUEST_';
    var _END_REQUEST_ = 'angularShamNotification:_END_REQUEST_';

    return {
        /**
         * This method shall be called when an HTTP request
         * started. This is called by the initiating component - the
         * HTTP interceptor.
         */
        requestStarted: function() {
            $rootScope.$broadcast(_START_REQUEST_);
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
        }
    };
}]);

/**
 * The Sham Spinner angular directive. This will render appropriate sham
 * spinner and show/hide on ajax call start/end respectively.
 */
app.directive('shamSpinner', ['AngularShamNotification', function (angularShamNotification) {
    return {
        restrict: "E",
        template: '<div class="sham-spinner-container"><span class="spinner"></span><span class="text">{{text}}</span></div>',
        link: function (scope, element, attrs) {
            scope.text = attrs.text;
            // hide the element initially
            element.hide();

            // subscribe to request started notification
            angularShamNotification.onRequestStarted(function() {
                // got the request start notification, show the element
                element.show();
            });

            // subscribe to request ended notification
            angularShamNotification.onRequestEnded(function() {
                // got the request end notification, hide the element
                element.hide();
            });
        }
    };
}]);
