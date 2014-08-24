module.exports = function (grunt) {
    'use strict';
    /**
     * http://gruntjs.com/sample-gruntfile
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pkgCompress: grunt.file.readJSON('pkg/pkg.compress.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
        },

        compress: {
            main: {
                options: {
                    archive: (function () {
                        var val = 'packages/';
                        val += 'malas34.githubnfo_' + (Date.now()) + '.zip';
                        return val;
                    }())
                },
                files: [
                    {
                        src: '<%= pkgCompress.src %>',
                        dest: '<%= pkgCompress.dest %>'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['jshint', 'compress']);

};
