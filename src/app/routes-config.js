'use strict';

export default routesConfig;

// @ngInject
function routesConfig($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}
