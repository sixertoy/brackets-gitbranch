/*
 * grunt-deploy-dump
 *
 * Copyright (c) 2014 Matthieu Lassalvy
 * Licensed under the MIT license.
 *
 * https://raw.githubusercontent.com/sequelize/sequelize-auto/master/lib/index.js
 * https://github.com/sequelize/sequelize/wiki/API-Reference-DataTypes
 * https://github.com/sequelize/sequelize/wiki/API-Reference
 * http://sequelizejs.com/docs/1.7.8/installation
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, brackets, require, module, $ */
define(function (require, exports, module) {

    'use strict';

    var _ = brackets.getModule('thirdparty/lodash'),
        FileUtils = brackets.getModule('file/FileUtils'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    /*
    var _bracketsPath   = FileUtils.getNativeBracketsDirectoryPath(),

    _nodeDomain     = new NodeDomain("fileWatcher", _domainPath);
     */

    var //Root = new NodeDomain('git-root', ExtensionUtils.getModulePath(module, '../node/git-root')),
        Origin = new NodeDomain('git-origin', ExtensionUtils.getModulePath(module, '../node/git-origin')),
        Branches = new NodeDomain('git-branches', ExtensionUtils.getModulePath(module, '../node/git-branches')),
        NodeUtils = new NodeDomain('node-utils', ExtensionUtils.getModulePath(module, '../node/node-utils'));

    // filesystem/impls/appshell/node/FileWatcherDomain
    var Watcher = new NodeDomain('git-fs-watcher', ExtensionUtils.getModulePath(module, '../node/git-fs-watcher'));

    var __privateMethods = {

        _isRepository: function (project_path, cb) {
            var err,
                $this = this;
            NodeUtils.exec('isRepository', project_path).done(function (result) {
                cb(null, result);
            }).fail(function () {
                err = new Error('Current project is not under version control');
                cb(err, null);
            });
        },

        /**
         *
         *
         *
         */
        _retrieveOrigin: function (path, cb) {
            Origin.exec('get', path).done(function (url) {
                cb(null, url);
            }).fail(function (err) {
                cb(err, null);
            });
        },

        /**
         *
         * recupere les branches locales
         * d'un projet
         *
         */
        _retrieveBranches: function (path, cb) {
            var current = -1;
            Branches.exec('get', path).done(function (branches) {
                // iterates through branches array
                branches = branches.map(function (value, index) {
                    if (value.indexOf('* ') !== -1) {
                        current = index;
                        value = value.replace('* ', '');
                    }
                    return {
                        name: value
                    };
                });
                cb(null, [branches, current]);
            }).fail(function (err) {
                cb(err, null);
            });
        },

        _initWatchChanges: function (path) {
            console.log('initWatchChanges');
            /*
            var $this = this,
                fileName = 'HEAD',
                fullPath = path + fileName;
            fullPath = 'D\\:\\www\\__github__\\brackets-gitbranch\\.git';
            Watcher.on('change', function () {
                console.log(arguments);
            });
            Watcher.exec('watch', fullPath).then(function () {
                console.log('success watch');
            }, function () {
                console.log('fail watch');
            });
            
            if (brackets.platform === 'win') {
                fullPath = path.split('\\').join('/');
            }
            
            var entry = FileSystem.getFileForPath(path + fileName);
            // get git HEAD file
            // watch changes on this file
            if (entry._isFile) {
                entry.exists(function (err) {
                    if (err !== null) {
                        $this._watch(file);
                    } else {
                        console.log(err);
                    }
                });
            }
            */
        },

        _onProjectOpen: function () {
            // retrieve current project root path
            var branches, current, list,
                $this = this,
                project_path = this._manager.getInitialProjectPath();
            this._isRepository(project_path, function (err, result) {
                if (err !== null) {
                    // disable du plugin
                    $($this).trigger('brackets-sixertoy-gitbranch.disable', [err]);

                } else {
                    // recuperation des branches locales
                    $this._retrieveBranches(project_path, function (err, results) {
                        if (err !== null) {
                            // disable du plugin
                            $($this).trigger('brackets-sixertoy-gitbranch.disable', [err]);
                        } else {
                            // enable plugin
                            // and init watcher for changes
                            $this._retrieveOrigin(project_path, function (err, origin) {
                                if (err !== null) {
                                    // disable du plugin
                                    $($this).trigger('brackets-sixertoy-gitbranch.disable', [err]);
                                } else {
                                    results.push(origin);
                                    $($this).trigger('brackets-sixertoy-gitbranch.enable', results);
                                }
                            });
                        }
                    });
                }
            });
        },

        _onProjectClose: function () {
            $(this).trigger('brackets-sixertoy-gitbranch.disable', [null]);
        },

        _onProjectRefresh: function () {
            console.log('project refresh');
        }

    };

    var Helper = function (projectManager, dropdown) {
        this._dropdown = dropdown;
        this._manager = projectManager;
    };
    // @TODO remove lodash
    _.extend(Helper.prototype, __privateMethods);

    Helper.prototype.onAppReady = function () {
        var $this = this;
        this._dropdown.on('select', function () {
            console.log('git branch select not yet implemented');
        });
        //
        this._manager.on('projectClose', function () {
            $this._onProjectClose();
        });
        this._manager.on('projectRefresh', function () {
            $this._onProjectRefresh();
        });
        this._manager.on('projectOpen', function () {
            $this._onProjectOpen();
        });
        $this._onProjectOpen();
    };

    module.exports = Helper;

});