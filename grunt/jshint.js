/*jslint indent: 4 */
/*global module */
module.exports = function (grunt, options) {
    'use strict';
    return {
        file: ['Gruntfile.js', 'main.js', 'strings.js', 'nls/**/*.js', 'lib/**/*.js', 'node/**/*.js']
    };
};
