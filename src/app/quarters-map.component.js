'use strict';

import _ from 'lodash';
import template from './quarters-map.html';

// Quarters maps, extracted from http://www.luxembourg.public.lu/fr/cartes-du-luxembourg/02-cartes-de-la-ville-de-luxembourg/index.html
import quartersFile from 'file!../../quarters.json';

class Controller {
    // @ngInject
    constructor(uiGmapGoogleMapApi, $http) {
        let quarters = [];
        $http.get(quartersFile).then(res => {
            this.quarters = res.data;
        });

        this.polygon = [];

        this.map = {
            center: {
                latitude: 49.610858,
                longitude: 6.131244
            },
            zoom: 13,
            options: {
                disableDefaultUI: true,
                scrollwheel: false,
                styles: [
                    {
                        featureType: 'administrative',
                        elementType: 'labels',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    },{
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    },{
                        featureType: 'roads',
                        elementType: 'labels',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    }
                ]
            }
        };
    }

    randomQuarter() {
        let prevQuarter = this.polygon;
        while (this.polygon === prevQuarter) {
            this.polygon = this.quarters[(Math.random() * this.quarters.length) | 0].shape;
        }
        this.map.bounds = {
            northeast: {
                latitude: _(this.polygon).map(p => p.latitude).max(),
                longitude: _(this.polygon).map(p => p.longitude).max()
            },
            southwest: {
                latitude: _(this.polygon).map(p => p.latitude).min(),
                longitude: _(this.polygon).map(p => p.longitude).min()
            }
        };
    }
}

export default {
    templateUrl: template,
    controller: Controller,
    controllerAs: 'ctrl'
}
