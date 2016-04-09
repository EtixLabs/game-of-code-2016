'use strict';

let express = require('express');
let cors = require('cors');
let request = require('request-promise');
let proj4 = require('proj4');

let app = express();

let luxEPSG2169 = '+proj=tmerc +lat_0=49.83333333333334 +lon_0=6.166666666666667 +k=1 +x_0=80000 +y_0=100000 +ellps=intl +towgs84=-193,13.7,-39.3,-0.41,-2.933,2.688,0.43 +units=m +no_defs ';
app.use(cors());

app.get('/', function (req, res) {
    res.send(JSON.stringify('Welcome to Educity API'));
});

app.get('/bus', function (req, res) {
    request('http://opendata.vdl.lu/odaweb/index.jsp?describe=1').then((data) => {
        data = JSON.parse(data)['data'];
        let list = [];
        let name = "";
        let id = "";
        for (let line of data) {
            name = line['i18n']['fr']['name'];
            id = line['id'];
            if (name.startsWith('Ligne-')) {
                list.push({name, id});
            }
        }
        res.send(list);
    });
});

app.get('/bus/:id', function (req, res) {
    let id = req.params.id;
    request('http://opendata.vdl.lu/odaweb/index.jsp?cat=' + id).then((data) => {
        res.send(formatBusLineData(JSON.parse(data)));
    });
});

app.get('/bus/:id/maths/exercises', function (req, res) {
    let id = req.params.id;
    request('http://opendata.vdl.lu/odaweb/index.jsp?cat=' + id).then((data) => {
        data = formatBusLineData(JSON.parse(data));
    });
});

function formatBusLineData(data) {
    let ret = {paths: [], stops: []};
    let id = 0;
    for (let line of data.features) {
        if (line.geometry.type == 'LineString') {
            line.geometry.coordinates = convertCoordFromEPSG2169ToNormal(line.geometry.coordinates);
        } else {
            line.geometry.coordinates = proj4(luxEPSG2169).inverse(line.geometry.coordinates);
        }
    }
    return data.features;
}

function convertCoordFromEPSG2169ToNormal(coordinates) {
    let path = [];
    for (let coord of coordinates) {
        path.push(proj4(luxEPSG2169).inverse(coord));
    }
    return path;
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
