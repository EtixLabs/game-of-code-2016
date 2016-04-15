'use strict';

let fs = require('fs');
let csvParser = require('csv-parse/lib/sync');
let _ = require('lodash');

// Load bus routes (lines)
console.log('Loading routes...');
let routesFile = fs.readFileSync('./bus-schedules-db/routes.txt');
let routes = csvParser(routesFile, {columns: true});

// Keep only AVL routes
routes = _.filter(routes, (route) => route.route_id.match(/AVL/));

let line13 = _.find(routes, route => route.route_short_name == 13);
console.log('Line 13:', line13);

// Load stops
console.log('Loading stop...');
let stopsFile = fs.readFileSync('./bus-schedules-db/stops.txt');
let stops = csvParser(stopsFile, {columns: true});

let oradourStop = _.find(stops, stop => stop.stop_name.match(/Oradour/));

console.log('Oradour stop:', oradourStop);

// Load trips
console.log('Loading trips...');
let tripsFile = fs.readFileSync('./bus-schedules-db/trips.txt');
let trips = csvParser(tripsFile, {columns: true});

// Retrieve Line 13 trips
let line13Trips = _.filter(trips, trip => trip.route_id == line13.route_id);
console.log('Loaded ' + line13Trips.length + ' trips');

// Load stop times
console.log('Loading stop times...');
let stopTimesFile = fs.readFileSync('./bus-schedules-db/stop_times.txt');
let stopTimes = csvParser(stopTimesFile, {columns: true});

// Retrieves list of times for a given trip
let times = _.filter(stopTimes, stopTime =>
    stopTime.trip_id == line13Trips[0].trip_id
);
console.log('Line 13 first trip times:');
_.each(times, time => {
    console.log(time.arrival_time);
});
