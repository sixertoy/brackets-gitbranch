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
/*global $, define, brackets, Mustache */
define(function (require, exports, module) {
    'use strict';

    var _ = brackets.getModule("thirdparty/lodash"),
        AppInit = brackets.getModule('utils/AppInit'),
        Dialog = brackets.getModule('widgets/Dialogs'),
        StatusBar = brackets.getModule("widgets/StatusBar"),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DropdownButton = brackets.getModule('widgets/DropdownButton').DropdownButton;

    var Strings = require("strings"),
        projectPath = ProjectManager.getInitialProjectPath(),
        GithubnfoButtonHTML = require('text!htmlContent/GithubNFO_button.html');

    var DEBUG_MODE = true,
        BRANCH_SET_AS_DEFAULT = false,
        BRANCH_SET_AS_DEFAULT_INDEX = false;

    var branchesSelect,
        gitDomain = new NodeDomain('git', ExtensionUtils.getModulePath(module, 'node/GitDomain'));

    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');

    function __debug(msg) {
        if (DEBUG_MODE) { console.log(msg); }
    }

    function _switchBranch(event, item, index) {
        __debug('[brackets-githubnfo] branch switch ' + BRANCH_SET_AS_DEFAULT + ' > ' + item.name);
        gitDomain.exec('switchBranch', projectPath, item.name)
            .fail(function (data) {
                __debug(data.err);
                var message = 'il y a une erreur';
                Dialog.showModalDialog('', 'Github Error', message);
                // console.log('[brackets-githubnfo] failed to run git.switchBranch :: ' + data.msg);
            });
    }

    function _populateBranchDropdown() {
        __debug('[brackets-githubnfo] branches initliaze');
        if (projectPath !== null) {
            gitDomain.exec('getBranches', projectPath)
                .done(function (data) {
                    BRANCH_SET_AS_DEFAULT_INDEX = data.current;
                    BRANCH_SET_AS_DEFAULT = data.branches[data.current].name;
                    branchesSelect.items = data.branches;
                    branchesSelect.setButtonLabel(BRANCH_SET_AS_DEFAULT);
                    __debug('[brackets-githubnfo] current used branch  ' + BRANCH_SET_AS_DEFAULT);
                }).fail(function (err) {
                    // console.log('[brackets-githubnfo] failed to run git.getBranches :: ' + err);
                });
        }
    }

    /**
     *
     * Init de la vue de l'extension
     *
     */
    function _init() {
        __debug('[brackets-githubnfo] init');
        var  $parent = $('.main-view .content #status-bar #status-indicators #status-overwrite');
        $parent.before(Mustache.render(GithubnfoButtonHTML, Strings));

        branchesSelect = new DropdownButton('', [], function (item, index) {
            var html = _.escape(item.name);
            if (index === BRANCH_SET_AS_DEFAULT_INDEX) {
                html = "<span class='checked-branch'></span>" + html;
            }
            return html;
        });
        branchesSelect.dropdownExtraClasses = "dropdown-github-branch";
        branchesSelect.$button.addClass("btn-status-bar");
        branchesSelect.$button.css("width", "auto");
        $(branchesSelect).on('select', _switchBranch);
        $("#githubnfo").append(branchesSelect.$button);
    }

    // Log memory when extension is loaded
    AppInit.htmlReady(_init);
    AppInit.appReady(function () {
        __debug('[brackets-githubnfo] ready');
        _populateBranchDropdown();
    });
});
