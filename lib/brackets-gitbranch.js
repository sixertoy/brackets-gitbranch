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
/*jslint plusplus: true, nomen: true, indent: 4 */
/*global define, brackets, require, module, console, $ */
define(function (require, exports, module) {

    'use strict';

    var Plugin,
        _ = brackets.getModule('thirdparty/lodash'),
        FileUtils = brackets.getModule('file/FileUtils'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        FileSystem = brackets.getModule('filesystem/FileSystem'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        // node services
        Origin = new NodeDomain('git-origin', ExtensionUtils.getModulePath(module, '../node/git-origin')),
        NodeUtils = new NodeDomain('node-utils', ExtensionUtils.getModulePath(module, '../node/node-utils')),
        Branches = new NodeDomain('git-branches', ExtensionUtils.getModulePath(module, '../node/git-branches')),
        Watcher = new NodeDomain('git-fswatcher', ExtensionUtils.getModulePath(module, '../node/git-fswatcher')),

        __privateMethods = {

            _init: function () {
                this._options = {
                    head: false,
                    index: false,
                    origin: false,
                    branches: false,
                    iswatching: false
                };
            },

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
                Branches.exec('getBranches', path).done(function (branches) {
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
                    cb(null, branches, current);
                }).fail(function (err) {
                    cb(err, null, null);
                });
            },

            _disablePlugin: function (err) {
                // disable du plugin
                this._init();
                $(this).trigger('brackets-sixertoy-gitbranch.disable', [err]);
            },

            /**
             *
             *
             *
             */
            _watchChanges: function (path, cb) {
                var head,
                    $this = this;
                Watcher.exec('watch', path).done(function (watching) {
                    if (watching) {
                        console.log('sixertoy-gitbranch: watch success');
                        //
                        // intervient lorsque node
                        // n'est pas capable de lire le fichier
                        Watcher.on('error', function (event, err) {
                            console.log('sixertoy-gitbranch: read file watched error');
                            console.log(err);
                        });
                        //
                        // intervient lorsque node
                        // a reussi a lire le fichier
                        Watcher.on('change', function (type, content) {
                            head = content.split('/');
                            head = head[head.length - 1];
                            if (head !== $this._options.head) {
                                $this._options.head = head;
                                $($this).trigger('brackets-sixertoy-gitbranch.update', head);
                            }
                        });
                    }
                    cb(null, watching);
                }).fail(function (err) {
                    console.log('sixertoy-gitbranch: watch failed');
                    cb(err, null);
                });
            },

            /**
             *
             *
             *
             */
            _unwatchChanges: function () {
                if (this._options.iswatching) {
                    Watcher.exec('unwatch').done(function (watching) {
                        console.log('gitbranch unwatch success');
                    }).fail(function (err) {
                        console.log('gitbranch unwatch failed');
                    });
                }
                this._options.iswatching = false;
            },

            /**
             *
             *
             *
             */
            _onProjectOpen: function () {
                var branches, current, list,
                    $this = this,
                    project_path = this._manager.getInitialProjectPath();
                // reinit des options
                this._init();
                // retrieve current project root path
                this._isRepository(project_path, function (err, isdir) {
                    if (err || !isdir) {
                        // disable du plugin
                        $this._disablePlugin(err);
                    } else {
                        // recuperation des branches locales
                        $this._retrieveBranches(project_path, function (err, branches, index) {
                            if (err) {
                                $this._disablePlugin(err);

                            } else {

                                $this._options.index = index;
                                $this._options.branches = branches;
                                $this._options.head = branches[index].name;
                                // recuperation de l'url du repository
                                $this._retrieveOrigin(project_path, function (err, origin) {
                                    if (err) {
                                        // disable du plugin
                                        $this._disablePlugin(err);

                                    } else {
                                        $this._options.origin = origin;
                                        //results.push(origin); // ajout de l'url du repository
                                        // watch sur le fichier .git/HEAD
                                        $this._watchChanges(project_path, function (err, watching) {
                                            if (err || !watching) {
                                                $this._disablePlugin(err);
                                            } else {
                                                // si le watch est actif
                                                // sur le fichier ./git/HEAD
                                                // activation du plugin
                                                $this._options.iswatching = watching;
                                                $($this).trigger('brackets-sixertoy-gitbranch.enable', $this._options);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            },


            _onProjectClose: function () {
                this._unwatchChanges();
                this._disablePlugin(null);
            },

            /**
             *
             * Init de l'application
             *
             */
            onAppReady: function () {
                var $this = this;
                /*
                this._dropdown.on('select', function () {
                    console.log('git branch select not yet implemented');
                });
                */
                // ecoute des events sur le projet en cours
                // this._manager.on('projectRefresh', this._onProjectRefresh.bind(this));
                this._manager.on('beforeProjectClose', this._onProjectClose.bind(this));
                this._manager.on('projectOpen', this._onProjectOpen.bind(this));
                // ouverture du projet
                $this._onProjectOpen();
            }

        };

    Plugin = function (projectManager, dropdown) {
        this._dropdown = dropdown;
        this._manager = projectManager;
    };
    // @TODO remove lodash
    _.extend(Plugin.prototype, __privateMethods);

    module.exports = Plugin;

});
