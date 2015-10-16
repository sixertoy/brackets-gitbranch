/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Matthieu Lassalvy <malas34.github@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global exports, require*/
(function () {
    'use strict';

    var FS = require('fs'),
        Path = require('path'),
        exec = require('child_process').exec;

    /*
    var shellOptions = {
        env: null,
        cwd: null,
        timeout: 0,
        encoding: 'utf8',
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM'
    };

    var commands = [
        'git rev-parse --show-toplevel',
        'git rev-parse --git-dir'
    ];

    var error = {
        'code': 1,
        'err': null,
        'message': 'Unable to execute command',
        'title': commands[0]
    };
    */

    var async = true,
        params = [],
        result = [],
        description = 'NodeJS API Utils';

    /**
     *
     *
     *
     */
    /*
    function _execute(path, cb) {
        var base = '';
        shellOptions.cwd = path;
        try {
            exec(commands[0], shellOptions, function (err, stdout, stderr) {
                if (err !== null) {
                    return cb(stderr, null);
                } else {
                    base = stdout;
                    exec(commands[1], shellOptions, function (perr, pstdout, pstderr) {
                        if (perr !== null) {
                            return cb(pstderr, null);
                        } else {
                            var path = Path.join(Path.normalize(base), Path.normalize(pstdout), Path.sep);
                            path = Path.normalize(path);
                            return cb(null, path);
                        }
                    });
                }
            });
        } catch (e) {
            cb(error, null);
        }
    }
    */

    /**
     *
     * Verifie si projet
     * est sur du versionning git
     *
     */
    function _isRepository(p, cb) {
        var gitfolder = Path.join(p, '.git');
        FS.stat(gitfolder, function (err, stats) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, stats.isDirectory());
            }
        }, function (err) {
            return cb(err, null);
        });
    }

    /**
     *
     * Declaration des domaines
     *
     */
    function init(domainManager) {
        if (!domainManager.hasDomain('node-utils')) {
            domainManager.registerDomain('node-utils', {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand('node-utils', 'isRepository', _isRepository, async, description, params, result);
    }

    exports.init = init;

}());
