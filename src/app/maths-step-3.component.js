'use strict';

import template from './maths-step-3.html';

class Controller {
    // @ngInject
    constructor($state) {
        this.lineId = ~~$state.params.lineId;
    }
}

export default {
    templateUrl: template,
    controller: Controller
};
