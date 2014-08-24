module.exports = function (grunt) {
    'use strict';
    /**
     * http://gruntjs.com/sample-gruntfile
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        pkgServer: grunt.file.readJSON('pkg/pkg.bower.json'),
        pkgServer: grunt.file.readJSON('pkg/pkg.server.json'),
        pkgServer: grunt.file.readJSON('pkg/pkg.compress.json'),

        connect: {
            server: {
                options: '<%= pkgServer.options %>'
            }
        },

        qunit: {
            files: ['test/**/*.html']
        },

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
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'connect', 'watch']);

};
