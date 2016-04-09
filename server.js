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
        data = formatBusLineDataForGoogleAPI(JSON.parse(data));
        res.send(data);
    });
});

app.get('/bus/:id/from/:startId/to/:stopId/maths', function (req, res) {
    let id = req.params.id;
    let startId = req.params.startId;
    let stopId = req.params.stopId;
    console.log('Requesting for stops/paths information for bus ' + id + '...');
    request('http://opendata.vdl.lu/odaweb/index.jsp?cat=' + id).then((data) => {
        console.log('Formatting Bus Line Data for Google API...');
        let formattedData = formatBusLineDataForGoogleAPI(JSON.parse(data));
        console.log('Getting coords for start number ' + startId + ' and stop number ' + stopId + '...');
        let stops = getStopsCoordsByIds(formattedData, [startId, stopId]);
        Promise.all([
            getStopApiIdByCoord(res, stops[0]),
            getStopApiIdByCoord(res, stops[1])
        ]).then(function (stopApiIds) {
            return Promise.all([
                getStopScheduleByApiId(stopApiIds[0]),
                getStopScheduleByApiId(stopApiIds[1])
            ]);
        }).then(function (stopSchedules) {
            res.send(stopSchedules);
        });
    });
});

function getStopScheduleByApiId(stopApiId) {
    let url = 'http://travelplanner.mobiliteit.lu/restproxy/departureBoard?accessId=cdt&format=json&';
    console.log('Getting stop schedule for stop ' + stopApiId);
    return request(url + stopApiId).then((data) => {
        return JSON.parse(data);
    });
}

function getStopApiIdByCoord(res, stop) {
    let startX = Number((stop.geometry.coordinates[0]).toFixed(6)) * 1000000;
    let startY = Number((stop.geometry.coordinates[1]).toFixed(6)) * 1000000;

    let url = 'http://travelplanner.mobiliteit.lu/hafas/query.exe/dot?performLocating=2&tpl=stop2csv&look_maxdist=1500&look_x=' + startX + '&look_y=' + startY + '&stationProxy=yes';

    console.log('Getting Stop RealTime API Id for ' + stop.properties.name);
    return request(url).then((data) => {
        let stopsRet = data.split('\n');
        let stopNames = stopsRet.map(function(stop) {
            return stop.split('@')[1];
        })
        let realName = stop.properties.name.split('/ ')[1].split('<br>')[0];
        let bestMatch = {input: "", pos: -1};
        for (let pos in stopNames) {
            if (stopNames[pos]) {
                let match = stopNames[pos].match(realName);
                if (match && match.input.length > bestMatch.input.length) {
                    bestMatch.input = match.input;
                    bestMatch.pos = pos;
                }
            }
        }
        console.log('Stop RealTime API Id found: ' + stopsRet[bestMatch.pos]);
        return stopsRet[bestMatch.pos];
    });
}

function getStopsCoordsByIds(data, stopIds) {
    let stops = [];
    for (let stopId of stopIds) {
            for (let line of data) {
                if (line.geometry.type == 'Point') {
                    if (line.geometry.id == stopId) {
                        stops.push(line);
                    }
                }
            }
    }
    return stops;
}

function formatBusLineDataForGoogleAPI(data) {
    let id = 0;
    for (let line of data.features) {
        if (line.geometry.type == 'LineString') {
            line.geometry.coordinates = convertCoordFromEPSG2169ToNormal(line.geometry.coordinates);
        } else {
            line.geometry.id = id++;
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
