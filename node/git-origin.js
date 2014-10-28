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

    var Exec = require('child_process').exec;

    var shellOptions = {
        env: null,
        cwd: null,
        timeout: 0,
        encoding: 'utf8',
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM'
    };

    var error = {
        'code': 1,
        'err': null,
        'message': 'Unable to execute command',
        'title': 'git config --get remote.origin.url'
    };

    var async = true,
        params = [{
            type: 'string',
            name: 'projectPath',
            description: 'Absolute path for the current project'
        }],
        result = [{
            name: 'url',
            type: 'string',
            description: 'Current remote URL'
        }],
        description = 'Return the current project\'s remote URL';

    /**
     *
     *
     *
     */
    function _execute(path, cb) {
        shellOptions.cwd = path;
        try {
            Exec('git config --get remote.origin.url', shellOptions, function (err, stdout, stderr) {
                if (err !== null) {
                    return cb(error, null);
                } else {
                    return cb(null, stdout);
                }
            });
        } catch (e) {
            cb(error, null);
        }
    }

    /**
     *
     *
     *
     */
    function init(domainManager) {
        if (!domainManager.hasDomain('git-origin')) {
            domainManager.registerDomain('git-origin', {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand('git-origin', 'get', _execute, async, description, params, result);
    }

    exports.init = init;

}());
