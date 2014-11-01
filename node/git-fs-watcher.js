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
/*global exports, require, process*/
(function () {
    'use strict';

    var FS = require('fs'),
        OS = require('os'),
        Path = require('path'),
        fsevents;

    /*
    if (process.platform === "darwin") {
        fsevents = require("fsevents");
    } else if (process.platform === "win32") {
        var version = OS.release();
        // XP will use node's built in file watcher module.
        if (version && version.length > 0 && version[0] !== "5") {
            fsevents = require("fsevents_win/fsevents_win");
        }
    }
    */

    var _async = true,
        _filePath = null,
        _description = '',
        _domainManager = null,
        _domainName = 'git-fs-watcher',
        _params = [{
            type: 'string',
            name: 'filePath',
            description: 'Absolute path for the file to watch'
        }],
        _result = [{
            type: 'FSWatcher',
            name: 'watcher',
            description: 'http://nodejs.org/api/fs.html#fs_class_fs_fswatcher'
        }];

    var _events = [{
        name: "curr",
        type: "object"
    }, {
        name: "prev",
        type: "object"
    }];

    var _error = {
        'code': 1,
        'err': null,
        'message': 'Unwatch/Watch failed',
        'title': 'Git HEAD file watcher'
    };

    /**
     *
     *
     *
     */
    function watch(filePath, cb) {
        try {

            _filePath = filePath;

            console.log(_filePath);

            var watcher = FS.watchFile(filePath, {
                persistent: false
            }, function (curr, prev) {
                console.log('the current mtime is: ' + curr.mtime);
                console.log('the previous mtime was: ' + prev.mtime);
                watcher.emitEvent(_domainName, 'change', curr, prev);
            });

            // _watcherMap[path] = watcher;
            watcher.on('error', function (err) {
                //console.error("Error watching file " + path + ": " + (err && err.message));
                // unwatchPath(path);
            });

            cb(null, 'okkkkkk');

        } catch (e) {
            _error.err = e;
            _error.message += ': ' + filePath;
            cb(_error, null);
        }
    }

    /**
     *
     *
     *
     */
    function unwatch(cb) {
        try {} catch (e) {
            _error.err = e;
            cb(_error, null);
        }
    }

    /**
     *
     *
     *
     */
    function init(domainManager) {
        if (!domainManager.hasDomain(_domainName)) {
            domainManager.registerDomain(_domainName, {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand(_domainName, 'watch', watch, _async, _description, _params, _result);
        domainManager.registerCommand(_domainName, 'unwatch', unwatch, _async, _description, _params, _result);
        domainManager.registerEvent(_domainName, 'change', _events);
        _domainManager = domainManager;
    }

    exports.init = init;

}());
