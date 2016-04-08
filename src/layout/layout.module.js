'use strict';

import home from './home.directive';

const MODULE_NAME = 'etix.kru.layout';

angular
    .module(MODULE_NAME, [])
    .component('home', home)
;

export default MODULE_NAME;
