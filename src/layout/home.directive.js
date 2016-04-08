'use strict';

import _ from 'lodash';
import template from './home.html';

class Controller {
    // @ngInject
    constructor($scope, uiGmapGoogleMapApi) {
        uiGmapGoogleMapApi.then(function (maps) {
           $scope.map = {
               center: {
                   latitude: 32.830593,
                   longitude: -79.825432
               },
               zoom: 14
           };
           $scope.marker = {
               id: 1,
               coords: {
                   latitude: 32.830593,
                   longitude: -79.825432
               }
           };
       });
    }
}

export default {
    templateUrl: template,
    controller: Controller
}
