'use strict';

var restangularProvider;

angular.module('quiverInvoiceApp', [
  'ngSanitize',
  'restangular',
  'ui.router',
  'angular-google-analytics',
  'jmdobry.angular-cache',
  'firebase',
  'notifications'
])
  .run(function (cacheService) {
    cacheService.config(restangularProvider);
  })
  .config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    restangularProvider = RestangularProvider;

    RestangularProvider.setBaseUrl(window.env.api);
    $urlRouterProvider.otherwise('/');

    var nav = {
      templateUrl: 'views/nav.html',
      controller: 'NavCtrl',
      resolve: {
        user: function (userService) {
          return userService.get();
        },
        loggedInUser: function (userService) {
          return userService.getLoggedInUser();
        }
      }
    };

    $stateProvider
      .state('root', {
        url: '/',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('settings', {
        url: '/settings',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('invoice', {
        url: '/invoice/:id',
        views: {
          nav: nav,
          body: {
            templateUrl: 'views/invoice.html',
            controller: 'InvoiceCtrl',
            resolve: {
              invoices: function (invoiceService) {
                return invoiceService.get();
              },
              invoice: function ($stateParams, invoiceService, moment) {
                if ($stateParams.id === 'new') {
                  return invoiceService.newInvoice();
                } else {
                  return invoiceService.get($stateParams.id);
                }

              }
            }
          }
        }
      })

      .state('devMountain', {
        url: '/devMountain/:name',
        views: {
          nav: nav,
          body: {
            template: '<h1> Hello {{name}} </h1>',
            controller: function ($scope,user,name) {
              $scope.name=name;
              $scope.user=user;
              console.log("Dev Mountain User", user);
            },
            resolve: {
              user: function (userService) {
                return userService.get();
              },
            name: function ($stateParams) {
              return $stateParams.name
            }
              
            }
          }
        }
      })

  });
