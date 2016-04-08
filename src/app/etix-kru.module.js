'use strict';

// External dependencies
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'angular-simple-logger';
import 'angular-google-maps';

import '../layout/home.css'
import homeLayout from '../layout/layout.module';

// App components
import appComponent from './app.component';
import routesConfig from './routes-config.js';

const MODULE_NAME = 'etix.kru';

angular
    .module(MODULE_NAME, [
        'uiGmapgoogle-maps',
        homeLayout,
        uiRouter
    ])
    .component('etixKru', appComponent)
    .config(routesConfig)
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCmswTUxF2EsZ_oqoNljJDz2HrHo5tAzFc',
        });
    })
;

export default MODULE_NAME;
