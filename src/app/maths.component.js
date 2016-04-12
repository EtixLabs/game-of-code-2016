'use strict';

import template from './maths.html';

class Controller {
    // @ngInject
    constructor() {
        this.lines = [];
        for (let i = 0; i < 35; ++i) {
          this.lines.push((Math.random() * 500) | 0);
        }

        this.selectedLine = null;
    }

    selectLine(line) {
        this.selectedLine = line;
    }
}

export default {
    templateUrl: template,
    controller: Controller
};
