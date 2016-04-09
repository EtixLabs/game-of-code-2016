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
        this.optionsToKnow = [];

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

    itIsAwesome() {
        if (this.currentQuarter.name === this.goodOption.name) {
            this.response = "Win !";
        } else {
            this.response = "Try again..";
        }
    }

    randomQuarter() {
        let prevQuarter = this.polygon;
        this.optionsToKnow = [];
        this.response = '';
        while (this.polygon === prevQuarter) {
            let index = (Math.random() * this.quarters.length) | 0;
            this.optionsToKnow = [ this.quarters[index] ];
            this.goodOption = this.quarters[index];
            this.polygon = this.quarters[index].shape;
        }

        let prev = null;
        let curr = null;
        for (let i = 0; i < 5; i++) {
            while (curr === prev) {
                curr = this.quarters[(Math.random() * this.quarters.length) | 0];
            }
            this.optionsToKnow.push(curr);
            prev = curr;
            this.optionsToKnow = _.shuffle(this.optionsToKnow);
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
