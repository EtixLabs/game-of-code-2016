'use strict';

export default routesConfig;

import categoriesView from './categories.html';
import mathsView from './maths.html';
import geographyView from './geography.html';

// @ngInject
function routesConfig($locationProvider, $urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/categories');

    $stateProvider.state('categories', {
        url: '/categories',
        templateUrl: categoriesView
    });

    $stateProvider.state('maths', {
        url: '/maths',
        templateUrl: mathsView
    });

    $stateProvider.state('geography', {
        url: '/geography',
        templateUrl: geographyView
    });

}
