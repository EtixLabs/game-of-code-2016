// Copyright (C) 2014-2015 Etix Labs - All Rights Reserved.
//
// All information contained herein is, and remains the property of Etix Labs and its suppliers,
// if any.  The intellectual and technical concepts contained herein are proprietary to Etix Labs
// Dissemination of this information or reproduction of this material is strictly forbidden unless
// prior written permission is obtained from Etix Labs.

'use strict';

import menu from './menu.directive';

const MODULE_NAME = 'etix-kru.layout';

angular
    .module(MODULE_NAME, [])
    .component('exMenu', menu)
;

export default MODULE_NAME;
