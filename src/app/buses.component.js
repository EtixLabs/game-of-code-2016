'use strict';

import _ from 'lodash';
import template from './buses.html';
import proj4 from 'proj4';

class Controller {
    // @ngInject
    constructor($http, uiGmapGoogleMapApi) {
        this.paths = [];
        this.markers = [];

        this.map = {
            center: {
                latitude: 49.61352086102421,
                longitude: 6.129348334816693
            },
            zoom: 14
        };

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
                   else {
                       console.log(line.geometry.type);
                   }

               }

               this.map = {
                   bounds: {
                        northeast: {
                            latitude: _(this.markers).map(p => p.coordinates[1]).max(),
                            longitude: _(this.markers).map(p => p.coordinates[0]).max()
                        },
                        southwest: {
                            latitude: _(this.markers).map(p => p.coordinates[1]).min(),
                            longitude: _(this.markers).map(p => p.coordinates[0]).min()
                        }
                    }
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
