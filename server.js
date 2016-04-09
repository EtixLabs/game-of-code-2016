'use strict';

let express = require('express');
let cors = require('cors');
let request = require('request-promise');

let app = express();

app.use(cors());

app.get('/', function (req, res) {
    request('http://opendata.vdl.lu/odaweb/index.jsp?describe=1').then((data) => {
        res.set
        res.send(data);
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
