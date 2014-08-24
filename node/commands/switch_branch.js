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

    var fs = require('fs'),
        exec = require('child_process').exec;

    var branchID,
        isDirectory,
        syncCallback;

    var shellOptions = {
        env: null,
        cwd: null,
        timeout: 0,
        encoding: 'utf8',
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM'
    };

    var async = true,
        params = [{
            type: 'string',
            name: 'id',
            description: 'Branch name'
        }, {
            type: 'string',
            name: 'id',
            description: 'Branch name'
        }],
        result = [{
            name: 'result',
            type: 'object',
            description: ''
        }],
        description = 'Returns the total or free memory on the user\'s system in bytes';

    function _callback(err, stdout, stderr) {
        if (err !== null) {
            return syncCallback({'title': 'git checkout ' + branchID + ' error', 'message': stderr, 'code': 0}, null);
        } else {
            return syncCallback(null, true);
        }
    }

    function _execute(projectPath, id, callback) {
        branchID = id;
        syncCallback = callback;
        shellOptions.cwd = projectPath;
        var file = shellOptions.cwd + '.git';
        try {
            isDirectory = fs.statSync(file).isDirectory();
            if (isDirectory) {
                exec(('git checkout ' + branchID), shellOptions, _callback);
                return;
            }
        } catch (e) {}
        var err = {'title': 'git checkout ' + branchID + ' error', 'message': 'No such file or directory ' + file, 'code': 1};
        syncCallback(err, null);
    }

    /*
        var ;
        var ;
        */
    function register(domainManager, command) {
        domainManager.registerCommand('git', command, _execute, async, description, params, result);
    }

    exports.register = register;

}());
