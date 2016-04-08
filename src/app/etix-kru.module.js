'use strict';

// External dependencies
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

// App components
import appComponent from './app.component';
import routesConfig from './routes-config.js';

const MODULE_NAME = 'etix.kru';

angular
    .module(MODULE_NAME, [
        uiRouter
    ])
    .component('etixKru', appComponent)
    .config(routesConfig)
;

export default MODULE_NAME;
