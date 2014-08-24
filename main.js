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
        GithubnfoDialogHTML = require('text!htmlContent/GithubNFO_dialog.html'),
        GithubnfoButtonHTML = require('text!htmlContent/GithubNFO_button.html');

    var DEBUG_MODE = true,
        BRANCH_SET_AS_DEFAULT = false,
        BRANCH_SET_AS_DEFAULT_INDEX = false;

    var branchesSelect,
        gitDomain = new NodeDomain('git', ExtensionUtils.getModulePath(module, 'node/GitDomain'));

    /**
     *
     * Console log with debug switcher
     *
     * @params [String] msg
     */
    function __debug(msg) {
        if (DEBUG_MODE) {
            console.log(msg);
        }
    }

    /**
     *
     * Exec git checkout command between local repo branches
     *
     * Dialog prompt if error like
     * - Current branch needs commit before switch
     *
     * @params [Event] event
     * @params [Object] item
     * @params [Number] index
     */
    function _switchBranch(event, item, index) {
        __debug('[brackets-githubnfo] branch switch ' + BRANCH_SET_AS_DEFAULT + ' > ' + item.name);
        gitDomain.exec('switchBranch', projectPath, item.name)
            .fail(function (data) {
                __debug('[brackets-githubnfo] ' + data.title + ' \n' + data.message);
                data.message = data.message.split('\n').join('<br>');
                Dialog.showModalDialogUsingTemplate(Mustache.render(GithubnfoDialogHTML, data));
            });
    }

    /**
     *
     * Exec git branch command for local reppo branches
     *
     */
    function _populateBranchDropdown() {
        __debug('[brackets-githubnfo] app ready');
        if (projectPath !== null) {
            gitDomain.exec('getBranches', projectPath)
                .done(function (data) {
                    BRANCH_SET_AS_DEFAULT_INDEX = data.current;
                    BRANCH_SET_AS_DEFAULT = data.branches[data.current].name;
                    branchesSelect.items = data.branches;
                    branchesSelect.setButtonLabel(BRANCH_SET_AS_DEFAULT);
                    branchesSelect.$button.show();
                    $('#githubnfo').addClass('active');
                    $('#githubnfo a.icon')
                        .attr('title', 'Open in Github')
                        .attr('href', 'http://www.google.fr');
                    __debug('[brackets-githubnfo] current used branch ' + BRANCH_SET_AS_DEFAULT);
                }).fail(function (data) {
                    console.log(data);
                    if(DEBUG_MODE){
                        Dialog.showModalDialogUsingTemplate(Mustache.render(GithubnfoDialogHTML, data));
                    }
                    __debug('[brackets-githubnfo] ' + data.title + ' :: ' + data.message);
                });
        }
    }

    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');

    /**
     *
     * Init des vues de l'extension
     *
     */
    function _init() {
        __debug('[brackets-githubnfo] app init');
        var  $parent = $('.main-view .content #status-bar #status-indicators #status-overwrite');
        $parent.before(Mustache.render(GithubnfoButtonHTML, Strings));

        branchesSelect = new DropdownButton('', [], function (item, index) {
            var html = _.escape(item.name);
            if (index === BRANCH_SET_AS_DEFAULT_INDEX) {
                html = "<span class='checked-branch'></span>" + html;
            }
            return html;
        });
        $(branchesSelect).on('select', _switchBranch);
        branchesSelect.dropdownExtraClasses = "dropdown-github-branch";
        branchesSelect.$button.addClass("btn-status-bar")
            .css("width", "auto")
            .hide();
        $("#githubnfo").append(branchesSelect.$button);
    }

    // Log memory when extension is loaded
    AppInit.htmlReady(_init);
    AppInit.appReady(_populateBranchDropdown);
});
