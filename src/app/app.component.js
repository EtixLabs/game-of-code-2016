'use strict';

import template from './app.html';
import backgroundImg from './assets/city-scape.png';

class Controller {
    // @ngInject
    constructor() {
        this.backgroundImg = backgroundImg;
    }
}

export default {
    templateUrl: template,
    controller: Controller
};
