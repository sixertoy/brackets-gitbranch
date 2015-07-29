/*jslint indent: 4 */
/*global module */
module.exports = function (grunt, opts) {
    'use strict';
    return {
        options: {
            compress: true
        },
        all: {
            files: {
                "styles/styles.css": "styles/styles.less"
            }
        }
    };
};