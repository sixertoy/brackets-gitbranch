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

    var Origin = new NodeDomain('git-origin', ExtensionUtils.getModulePath(module, '../node/git-origin'));

    var __privateMethods = {

        _getRemoteURL: function () {
            var path = this._manager.getInitialProjectPath();
            Origin.exec('get', path).done(function (url) {
                console.log(url);
                // populate branch
            }).fail(function (data) {
                console.log('fail fail fail fail');
                // Dialog.showModalDialogUsingTemplate(Mustache.render(GithubnfoDialogHTML, data));
            });
            /*
            if (projectPath !== null) {
                    .done(function (url) {
                        branchesSelect.$button.show();
                        $('#githubnfo').addClass('active');
                        $('#githubnfo a.icon')
                            .attr('title', Strings.OPEN_IN_GITHUB)
                            .attr('href', url);
                        _populateBranchDropdown();
                    }).fail(function (data) {
                        if (DEBUG_MODE) {
                        }
                        __debug(data.title + ' :: ' + data.message);
                    });
            }
            */
        },

        _onProjectOpen: function () {
            this._getRemoteURL();
        },

        _onProjectClose: function () {},

        _onProjectRefresh: function () {}

    };

    var Helper = function (projectManager) {
        this._manager = projectManager;
    };
    // @TODO remove lodash
    _.extend(Helper.prototype, __privateMethods);

    Helper.prototype.onAppReady = function () {
        var $this = this;
        //
        $(this._manager).on('projectClose', function () {
            $this._onProjectClose();
        });
        $(this._manager).on('projectRefresh', function () {
            $this._onProjectRefresh();
        });
        $(this._manager).on('projectOpen', function () {
            $this._onProjectOpen();
        });
        //
        this._onProjectOpen();
    };

    module.exports = Helper;

});
