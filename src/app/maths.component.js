'use strict';

import template from './maths.html';
import _ from 'lodash';

class Controller {
    // @ngInject
    constructor() {
        this.lines = [];
        for (let i = 0; i < 35; ++i) {
          this.lines.push((Math.random() * 500) | 0);
        }
        this.lines = _.uniq(this.lines);

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
