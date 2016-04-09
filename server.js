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
    res.send(getBusList());
});

app.get('/bus/:id', function (req, res) {
    let id = req.params.id;
    console.log('Getting stop lists for bus ' + id);
    request('http://opendata.vdl.lu/odaweb/index.jsp?cat=' + id).then((data) => {
        console.log('Done.');
        data = formatBusLineDataForGoogleAPI(JSON.parse(data));
        res.send(data);
    });
});

app.get('/bus/:id/from/:startId/to/:stopId/maths', function (req, res) {
    let id = req.params.id;
    let startId = req.params.startId;
    let stopId = req.params.stopId;
    let resume = {
        busNumber: id,
        start: {
            id: startId,
            coords: [],
            time: new Date()
        },
        stop: {
            id: stopId,
            coords: [],
            time: new Date()
        },
        distance: 0
    };
    console.log('Requesting for stops/paths information for bus ' + id + '...');
    request('http://opendata.vdl.lu/odaweb/index.jsp?cat=' + id).then((data) => {
        console.log('Done.');
        console.log('Formatting Bus Line Data for Google API...');
        let formattedData = formatBusLineDataForGoogleAPI(JSON.parse(data));
        console.log('Done.');
        console.log('Getting coords for start number ' + startId + ' and stop number ' + stopId + '...');
        let stops = getStopsCoordsByIds(formattedData, [startId, stopId]);
        resume.start.coords = stops[0].geometry.coordinates;
        resume.stop.coords = stops[1].geometry.coordinates;
        console.log('Done.');
        return Promise.all([
            getStopApiIdByCoord(res, stops[0]),
            getStopApiIdByCoord(res, stops[1])
        ]).then(function (stopApiIds) {
            return Promise.all([
                getStopScheduleByApiId(stopApiIds[0]),
                getStopScheduleByApiId(stopApiIds[1])
            ]);
        }).then(function (stopSchedules) {
            return getBusNumberByKey(id).then(function (busNumber) {
                resume.start.time = new Date(getNextScheduleByBusNumber(stopSchedules[0], busNumber));
                resume.stop.time = new Date(getNextScheduleByBusNumber(stopSchedules[1], busNumber));
                resume.distance = getDistanceBetweenTwoCoords(resume.start.coords, resume.stop.coords);
                res.send(resume);
            });;
        });
    });
});

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function getDistanceBetweenTwoCoords(coords1, coords2) {
    let latFrom = Math.radians(coords1[0]);
    let lonFrom = Math.radians(coords1[1]);
    let latTo = Math.radians(coords2[0]);
    let lonTo = Math.radians(coords2[1]);

    let latDelta = latTo - latFrom;
    let lonDelta = lonTo - lonFrom;

    let angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) + Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));
    return angle * 6371000 * 1.5;
}

function getNextScheduleByBusNumber(stopSchedule, busNumber) {
    for (let busLine of stopSchedule.Departure) {
        if (busLine.Product.line == busNumber) {
            return busLine.date + 'T' + busLine.time;
        }
    }
    return '';
}

function getBusNumberByKey(key) {
    return getBusList().then(function (busesList) {
        for (let bus of busesList) {
            if (bus.id == key) {
                return bus.name.split('-')[1].split(' ')[0];
            }
        }
        return 0;
    });
}

function getBusList() {
    console.log('Getting list of buses');
    return request('http://opendata.vdl.lu/odaweb/index.jsp?describe=1').then((data) => {
        console.log('Done.');
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
        return list;
    });
}

function getStopScheduleByApiId(stopApiId) {
    let url = 'http://travelplanner.mobiliteit.lu/restproxy/departureBoard?accessId=cdt&format=json&';
    console.log('Getting stop schedule for stop ' + stopApiId);
    return request(url + stopApiId).then((data) => {
        console.log('Done.');
        return JSON.parse(data);
    });
}

function getStopApiIdByCoord(res, stop) {
    let startX = Number((stop.geometry.coordinates[0]).toFixed(6)) * 1000000;
    let startY = Number((stop.geometry.coordinates[1]).toFixed(6)) * 1000000;

    let url = 'http://travelplanner.mobiliteit.lu/hafas/query.exe/dot?performLocating=2&tpl=stop2csv&look_maxdist=1500&look_x=' + startX + '&look_y=' + startY + '&stationProxy=yes';

    console.log('Getting Stop RealTime API Id for ' + stop.properties.name);
    return request(url).then((data) => {
        console.log('Done.');
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
    let i = 0;
    let stops = [];
    for (let line of data.features) {
        if (line.geometry.type == 'LineString') {
            line.geometry.coordinates = convertCoordFromEPSG2169ToNormal(line.geometry.coordinates);
        } else {
            if (stops.indexOf(/(.*?)<br>.*?/.exec(line.properties.name)[0]) == -1) {
                stops.push(/(.*?)<br>.*?/.exec(line.properties.name)[0]);
                line.geometry.id = id++;
                line.geometry.coordinates = proj4(luxEPSG2169).inverse(line.geometry.coordinates);
            } else {
                delete data.features[i];
            }
        }
        i++;
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
