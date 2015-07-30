/*jslint indent: 4 */
/*global module */
module.exports = function (grunt, opts) {
    'use strict';
    return {
        options: {
            archive: 'build/Releases/sixertoy.brackets-gitbranch_<%= package.version %>.zip'
        },
        all: {
            files: [{
                src: '<%= package.files %>',
                dest: 'sixertoy.brackets-gitbranch/'
            }]
        }
    };
};
