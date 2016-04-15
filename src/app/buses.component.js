'use strict';

import _ from 'lodash';
import proj4 from 'proj4';

import template from './buses.html';
import startMarker from './assets/start-icon.png';
import stopMarker from './assets/end-icon.png';

class Controller {
    // @ngInject
    constructor($http, uiGmapGoogleMapApi) {
        this.$http = $http;

        this.paths = [];
        this.stops = [];

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
           this.stops = [];

          $http.get('http://localhost:3000/bus/' + this.currentBusLine.id).then((data) => {
               if (data && data.data)
                   for (let line of data.data) {
                       if (line && line.geometry && line.geometry.type)
                           if (line.geometry.type == 'LineString') {
                               line.geometry.stroke = {
                                   color: '#ED3D3D'
                               };
                               this.paths.push(line.geometry);
                           } else if (line.geometry.type == 'Point') {
                               line.geometry.name = line.properties.name.replace('<br>', ' -- ');
                               this.stops.push(line.geometry);
                           }
                   }
                   this.start = this.stops[0];
                   this.changeStart();
                   this.stop = this.stops[this.stops.length - 1];
                   this.changeStop();
               if (this.stops.length)
                   this.map.bounds = {
                        northeast: {
                            latitude: _(this.stops).map(p => p.coordinates[1]).max(),
                            longitude: _(this.stops).map(p => p.coordinates[0]).max()
                        },
                        southwest: {
                            latitude: _(this.stops).map(p => p.coordinates[1]).min(),
                            longitude: _(this.stops).map(p => p.coordinates[0]).min()
                        }
                    };
           });
       }

        this.changeStart = () => {
            this.start.options = {
                icon: startMarker
            }
        }

        this.changeStop = () => {
            this.stop.options = {
                icon: stopMarker
            }
        }
    }

    selectStops() {
        this.loading = true;
        this.$http.get('http://localhost:3000/bus/' + this.currentBusLine.id + '/from/' + this.start.id + '/to/' + this.stop.id + '/maths').then(res => {
            this.loading = false;
            this.commuteData = res.data;
            this.commuteData.distance = Math.round(this.commuteData.distance / 100) / 10;
            this.commuteData.speed = Math.round(this.commuteData.speed * 10) / 10;
        })
    }
}

export default {
    templateUrl: template,
    controller: Controller,
    controllerAs: 'ctrl'
}
