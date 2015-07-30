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

    var _watcher, _domainManager, _domainName, _headfile,
        params = [],
        result = [],
        async = true,
        description = '',
        FS = require('fs'),
        OS = require('os'),
        Path = require('path'),
        chokidar = require('chokidar');


    function unwatch(cb) {
        try {
            _watcher.unwatch(_headfile);
            cb(null, true);
        } catch (e) {
            cb(e, false);
        }
    }

    /**
     *
     *
     *
     */
    function watch(path, cb) {
        var opts = {
            flag: 'r',
            encoding: 'utf8'
        };
        _headfile = Path.join(path, '.git', 'HEAD');
        FS.stat(_headfile, function (err, stat) {
            if (err !== null) {
                _headfile = false;
                cb(err, null);
            } else {
                if (stat.isFile()) {
                    _watcher = chokidar.watch(_headfile, {
                        persistent: true
                    }).on('change', function (event) {
                        FS.readFile(_headfile, opts, function(err, data){
                            if(err !== null){
                                _domainManager.emitEvent(_domainName, 'error', err);
                            } else {
                                _domainManager.emitEvent(_domainName, 'change', data);
                            }
                        })
                    });
                    cb(null, true);
                } else {
                    _headfile = false;
                    cb(new Error('is not file'), null);
                }
            }
        });
    }

    /**
     *
     *
     *
     */
    function init(domainManager) {
        _domainName = 'git-fswatcher';
        if (!domainManager.hasDomain(_domainName)) {
            domainManager.registerDomain(_domainName, {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerEvent(_domainName, 'error', []);
        domainManager.registerEvent(_domainName, 'change', []);
        domainManager.registerCommand(_domainName, 'watch', watch, async, description, params, result);
        domainManager.registerCommand(_domainName, 'unwatch', unwatch, async, description, params, result);
        _domainManager = domainManager;
    }

    exports.init = init;

}());
