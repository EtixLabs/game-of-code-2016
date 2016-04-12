'use strict';

export default routesConfig;

import categoriesView from './categories.html';
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
        template: '<maths></maths>'
    });

    $stateProvider.state('mathsStep2', {
        url: '/maths/line/:lineId',
        template: '<maths-step-2></maths-step-2>'
    });

    $stateProvider.state('mathsStep3', {
        url: '/maths/line/:lineId/from/:start/to/:stop',
        template: '<maths-step-3></maths-step-3>'
    });

    $stateProvider.state('geography', {
        url: '/geography',
        templateUrl: geographyView
    });

}
