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

// Load stops
console.log('Loading stop...');
let stopsFile = fs.readFileSync('./bus-schedules-db/stops.txt');
let stops = csvParser(stopsFile, {columns: true});

// Load trips
console.log('Loading trips...');
let tripsFile = fs.readFileSync('./bus-schedules-db/trips.txt');
let trips = csvParser(tripsFile, {columns: true});

// Load stop times
console.log('Loading stop times...');
let stopTimesFile = fs.readFileSync('./bus-schedules-db/stop_times.txt');
let stopTimes = csvParser(stopTimesFile, {columns: true});

// Build some indexes
console.log('Building indexes...');
let stopsById = {};
for (let stop of stops) {
    stopsById[stop.stop_id] = stop;
}

/**
 * Returns the times of the first found trip for a given line
 * @param lineNumber Number of the line
 * @return {array} Stop times for the given line (for a random trip)
 * Ex: [
 *     {
 *         arrival_time: '11:36:00',
 *         stop: {
 *             stop_name: 'Luxembourg, Gare Centrale',
 *             stop_lat: '49.600674',
 *             stop_lon: '6.133645'
 *         }
 *     }
 *     ...
 * ]
 */
function getLineTimes(lineNumber) {
    let line = _.find(routes, route => route.route_short_name == lineNumber);
    let trip = _.find(trips, trip => trip.route_id == line.route_id);
    let times = _.filter(stopTimes, stopTime =>
        stopTime.trip_id == trip.trip_id
    );
    for (let time of times) {
        time.stop = stopsById[time.stop_id];
    }
    return times;
}

/**
 * Returns the difference (duration) between two times
 * @param {string} time1 Start time (hh:mm:ss), ex: 11:36:00
 * @param  {[type]} time2 End time (hh:mm:ss), ex: 24:01:00
 * @return {number} Time difference (trip duration) in seconds
 */
function getTimesDifference(time1, time2) {
    let parts1 = time1.split(':');
    let parts2 = time2.split(':');
    return (parts2[0]*3600 + parts2[1]*60 + ~~parts2[2]) - (parts1[0]*3600 + parts1[1]*60 + ~~parts1[2]);
}

module.exports = {
    getLineTimes,
    getTimesDifference
};
