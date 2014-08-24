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


    /*
    EditorManager.focusEditor();

    */

    var _ = brackets.getModule("thirdparty/lodash"),
        AppInit = brackets.getModule('utils/AppInit'),
        //EditorManager = brackets.getModule("editor/EditorManager"),
        StatusBar = brackets.getModule("widgets/StatusBar"),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DropdownButton = brackets.getModule('widgets/DropdownButton').DropdownButton;

    var Strings = require("strings"),
        GithubnfoButtonHTML = require('text!htmlContent/GithubNFO_button.html');

    var BRANCH_SET_AS_DEFAULT_INDEX = false;

    var branchesSelect,
        gitDomain = new NodeDomain('git', ExtensionUtils.getModulePath(module, 'node/GitDomain'));

    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');


    /*
    function _switchBranch(num) {
        var projectPath = ProjectManager.getInitialProjectPath();
        if (projectPath !== null) {
        }
    }
    */

    function _switchBranch(event, item, index) {
        gitDomain.exec('switchBranches', item.name)
            .done(function (branches) {
                BRANCH_SET_AS_DEFAULT_INDEX = index;
                branchesSelect.setButtonLabel(item.name);
                // ProjectManager.refreshFileTree();
            })
            .fail(function (err) {
                    console.error('[brackets-githubnfo] failed to run git.switchBranches :: ' + err);
            });
    }

    function _populateBranchDropdown() {
        var projectPath = ProjectManager.getInitialProjectPath();
        if (projectPath !== null) {
            gitDomain.exec('getBranches', projectPath)
                .done(function (data) {
                    BRANCH_SET_AS_DEFAULT_INDEX = data.current;
                    branchesSelect.items = data.branches;
                    branchesSelect.setButtonLabel(data.branches[data.current].name);
                }).fail(function (err) {
                    // $("#githubnfo").addClass('error');
                    console.error('[brackets-githubnfo] failed to run git.getBranches :: ' + err);
                });
        }
    }

    /**
     *
     * Init de la vue de l'extension
     *
     */
    function _init() {
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
        _populateBranchDropdown();
    });
});
