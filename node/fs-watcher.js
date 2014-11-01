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
        Path = require('path');

    var file = null,
        async = true,
        params = [{
            type: 'string',
            name: 'filePath',
            description: 'Absolute path for the file to watch'
        }],
        result = [{
            type: 'FSWatcher',
            name: 'watcher',
            description: 'http://nodejs.org/api/fs.html#fs_class_fs_fswatcher'
        }],
        description = '';

    var events = [
        {
            name: "path",
            type: "string"
        },
        {
            name: "event",
            type: "string"
        },
        {
            name: "filename",
            type: "string"
        }
            ];

    var error = {
        'code': 1,
        'err': null,
        'message': 'Unable to watch file',
        'title': 'Git HEAD file watcher'
    };

    /**
     *
     *
     *
     */
    function _execute(filePath, cb) {
        try {
            var watcher = FS.watch(filePath, function () {});
            cb(null, watcher);
        } catch (e) {
            error.err = e;
            error.message += ': ' + filePath;
            cb(error, null);
        }
    }

    /**
     *
     *
     *
     */
    function init(domainManager) {
        if (!domainManager.hasDomain('fs-watcher')) {
            domainManager.registerDomain('fs-watcher', {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerEvent('fs-watcher', 'change', events);
        domainManager.registerCommand('fs-watcher', 'watch', _execute, async, description, params, result);
    }

    exports.init = init;

}());
