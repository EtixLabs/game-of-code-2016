'use strict';

import _ from 'lodash';
import proj4 from 'proj4';

import template from './buses.html';

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
            zoom: 13,
            options: {
                disableDefaultUI: true,
                scrollwheel: false
            }
        };

       this.changeBusLine = () => {
           this.paths = [];
           this.markers = [];

          $http.get('http://localhost:3000/bus/' + this.currentBusLine.id).then((data) => {
               if (data && data.data)
                   for (let line of data.data) {
                       if (line && line.geometry && line.geometry.type)
                           if (line.geometry.type == 'LineString') {
                               this.paths.push(line.geometry);
                           } else if (line.geometry.type == 'Point') {
                               this.markers.push(line.geometry);
                           }
                   }

               if (this.markers.length)
                   this.map.bounds = {
                        northeast: {
                            latitude: _(this.markers).map(p => p.coordinates[1]).max(),
                            longitude: _(this.markers).map(p => p.coordinates[0]).max()
                        },
                        southwest: {
                            latitude: _(this.markers).map(p => p.coordinates[1]).min(),
                            longitude: _(this.markers).map(p => p.coordinates[0]).min()
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
