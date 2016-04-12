'use strict';

// External dependencies
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-simple-logger';
import 'angular-google-maps';
import uiBootsrap from 'angular-ui-bootstrap';
import 'font-awesome/css/font-awesome.css';

// App components
import appComponent from './app.component';
import routesConfig from './routes-config';
import quartersMap from './quarters-map.component';
import maths from './maths.component';
import mathsStep2 from './maths-step-2.component';
import mathsStep3 from './maths-step-3.component';
import buses from './buses.component';

import './app.scss';
import './maths.scss';
import './quarters.scss';


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
    .component('maths', maths)
    .component('mathsStep2', mathsStep2)
    .component('mathsStep3', mathsStep3)
    .component('buses', buses)
;

export default MODULE_NAME;
