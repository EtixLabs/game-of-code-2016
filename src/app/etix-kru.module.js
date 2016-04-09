'use strict';

// External dependencies
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-simple-logger';
import 'angular-google-maps';
import uiBootsrap from 'angular-ui-bootstrap';

// App components
import appComponent from './app.component';
import routesConfig from './routes-config';
import quartersMap from './quarters-map.component';
import buses from './buses.component';

import './app.scss';

const MODULE_NAME = 'etix.kru';

angular
    .module(MODULE_NAME, [
        'uiGmapgoogle-maps',
        uiRouter,
        uiBootsrap
    ])
    .component('etixKru', appComponent)
    .config(routesConfig)
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCmswTUxF2EsZ_oqoNljJDz2HrHo5tAzFc',
        });
    })
    .component('quartersMap', quartersMap)
    .component('buses', buses)
;

export default MODULE_NAME;
