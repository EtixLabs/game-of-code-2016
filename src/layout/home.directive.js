'use strict';

import _ from 'lodash';
import template from './home.html';
import proj4 from 'proj4';

class Controller {
    // @ngInject
    constructor($http, uiGmapGoogleMapApi) {
        this.paths = [];
        this.markers = [];

       this.changeBusLine = () => {
           this.paths = [];
           this.markers = [];

           let busLines = $http.get('http://localhost:3000/bus/' + this.currentBusLine.id).then((data) => {
               for (let line of data.data) {
                   if (line.geometry.type == 'LineString') {
                       this.paths.push(line.geometry);
                   } else if (line.geometry.type == 'Point') {
                       this.markers.push(line.geometry);
                   }
               }
               this.map = {
                   center: _.cloneDeep(this.markers[0]),
                   zoom: 14
               };
           });
       }

       $http.get('http://localhost:3000/bus').then((data) => {
           this.bus = data.data;
           this.currentBusLine = this.bus[0];
           this.changeBusLine();
       });

    }
}

export default {
    templateUrl: template,
    controller: Controller,
    controllerAs: 'ctrl'
}
