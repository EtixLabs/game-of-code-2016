'use strict';

import template from './maths.html';
import _ from 'lodash';

class Controller {
    // @ngInject
    constructor($http) {
        this.lines = [];
        $http.get('http://localhost:3000/bus').then((data) => {
            this.lines = _(data.data)
                .map(line => ({
                    number: (line.name.match(/Ligne\-[0-9a-zA-Z]+/) || [null])[0].replace('Ligne-', ''),
                    id: line.id
                }))
                .each(line => line.number = _.isNaN(+line.number) ? line.number : +line.number);
            this.lines = _.orderBy(this.lines, 'number');
        });
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
