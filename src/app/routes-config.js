'use strict';

export default routesConfig;

import categoriesView from './categories.html';

// @ngInject
function routesConfig($locationProvider, $urlRouterProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/categories');

    $stateProvider.state('categories', {
        url: '/categories',
        templateUrl: categoriesView
    });

    $stateProvider.state('maths', {
        url: '/maths',
        template: '<buses></buses>'
    });
}
