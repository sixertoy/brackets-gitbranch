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
/*global brackets, require, module, $ */
define(function (require, exports, module) {

    'use strict';

    var _ = brackets.getModule('thirdparty/lodash'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils');

    var Origin = new NodeDomain('git-origin', ExtensionUtils.getModulePath(module, '../node/git-origin')),
        Current = new NodeDomain('git-current', ExtensionUtils.getModulePath(module, '../node/git-current')),
        Branches = new NodeDomain('git-branches', ExtensionUtils.getModulePath(module, '../node/git-branches'));

    var __privateMethods = {

        /**
         *
         *
         *
         */
        _getBranches: function (url, current) {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Branches.exec('get', path).done(function (branches) {
                var list = [];
                branches.map(function (item, index) {
                    if (item.indexOf(current) < 0) {
                        list.push({name: item});
                    }
                });
                $($this).trigger('brackets-githubnfo.populate', [url, current, list]);
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
        _getCurrentBranch: function (url) {
            var $this = this,
                path = this._manager.getInitialProjectPath();
            Current.exec('get', path).done(function (current) {
                $this._getBranches(url, current);
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

    Helper.prototype.onAppReady = function () {
        var $this = this;
        $(this._dropdown).on('select', function () {

        });
        //
        $(this._manager).on('projectClose', function () {
            $this._onProjectClose();
        });
        $(this._manager).on('projectRefresh', function () {
            $this._onProjectRefresh();
        });
        $(this._manager).on('projectOpen', function () {
            this._getRemoteURL();
        });
        //
        this._getRemoteURL();
    };

    module.exports = Helper;

});
