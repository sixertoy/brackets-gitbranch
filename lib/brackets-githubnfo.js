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
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        // FileSystem = brackets.getModule('filesystem/FileSystem'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    var Root = new NodeDomain('git-root', ExtensionUtils.getModulePath(module, '../node/git-root')),
        Origin = new NodeDomain('git-origin', ExtensionUtils.getModulePath(module, '../node/git-origin')),
        Current = new NodeDomain('git-current', ExtensionUtils.getModulePath(module, '../node/git-current')),
        Branches = new NodeDomain('git-branches', ExtensionUtils.getModulePath(module, '../node/git-branches'));

    var __privateMethods = {

        /**
         *
         *
         *
         */
        _getBranches: function (url, current, root) {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Branches.exec('get', path).done(function (branches) {
                var list = [];
                if (branches.length > 1) {
                    branches.map(function (item, index) {
                        if (item.indexOf(current) < 0) {
                            list.push({
                                name: item
                            });
                        }
                    });
                    $($this).trigger('brackets-githubnfo.populate', [url, current, root, list]);
                } else {
                    $($this).trigger('brackets-githubnfo.populate', [true, current, root]);
                }
                //
            }).fail(function (err) {
                $($this).trigger('brackets-githubnfo.populate', [false]);
            });
        },

        /**
         *
         *
         *
         */
        _getRootDirectory: function (url, current) {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Root.exec('get', path).done(function (root) {
                $this._getBranches(url, current, root);
            }).fail(function (err) {
                $($this).trigger('brackets-githubnfo.populate', [false]);
            });
        },

        /**
         *
         *
         *
         */
        _getCurrentBranch: function (url) {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Current.exec('get', path).done(function (current) {
                $this._getRootDirectory(url, current);
            }).fail(function (err) {
                $($this).trigger('brackets-githubnfo.populate', [false]);
            });
        },

        /**
         *
         *
         *
         */
        _getRemoteURL: function () {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Origin.exec('get', path).done(function (url) {
                $this._getCurrentBranch(url);
            }).fail(function (data) {
                $($this).trigger('brackets-githubnfo.populate', [false]);
            });
        },

        _onProjectOpen: function () {},

        _onProjectClose: function () {},

        _onProjectRefresh: function () {}

    };

    var Helper = function (projectManager, dropdown) {
        this._dropdown = dropdown;
        this._manager = projectManager;
    };
    // @TODO remove lodash
    _.extend(Helper.prototype, __privateMethods);

    Helper.prototype.watchRootChanges = function (path) {

        $(ProjectManager).on('projectRefresh', function () {
            console.log('refresh refresh refresh refresh');
        });

        /*
        try {
            // http://brackets.io/docs/current/modules/filesystem/FileSystem.html
            if (brackets.platform === 'win') {
                path = path.split('\\').join('/');
            }
            // get git HEAD file
            // watch changes on this file
            var
                entry = FileSystem.getFileForPath(path + 'HEAD');
            if (entry._isFile) {
                entry.exists(function (err) {
                    if (err !== null) {
                        $(entry._fileSystem).on('change', function () {
                            console.log(arguments);
                            // console.log(entry._fileSystem);
                            // console.log(entry._watchedRoot);
                        });

                    } else {
                        console.log(err);
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
        */
    };

    Helper.prototype.onAppReady = function () {
        var $this = this;
        $(this._dropdown).on('select', function () {
            //
        });
        //
        $(this._manager).on('projectClose', function () {
            $this._onProjectClose();
        });
        $(this._manager).on('projectRefresh', function () {
            $this._onProjectRefresh();
        });
        $(this._manager).on('projectOpen', function () {
            $this._getRemoteURL();
        });
        //
        this._getRemoteURL();
    };

    module.exports = Helper;

});
