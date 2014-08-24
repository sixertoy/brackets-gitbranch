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
        StatusBar = brackets.getModule("widgets/StatusBar"),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DropdownButton = brackets.getModule('widgets/DropdownButton').DropdownButton;

    var Strings = require("strings"),
        GithubnfoButtonHTML = require('text!htmlContent/GithubNFO_button.html');

    var BRANCH_SET_AS_DEFAULT = false;

    var branchesSelect,
        gitDomain = new NodeDomain('git', ExtensionUtils.getModulePath(module, 'node/GitDomain'));

    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');


    /*
    function _switchBranch(num) {
        console.log('[brackets-githubnfo] APP :: getGitBranches');
        var projectPath = ProjectManager.getInitialProjectPath();
        if (projectPath !== null) {
            gitDomain.exec('switchBranches', num).done(function (branches) {}).fail(function (err) {});
        }
    }
    */

    /*
    function _createEtensionUI(branches) {

        $(Mustache.render(ButtonUITemplate, {
            'current': branches.current
        }))
            .insertBefore($statusbar);

        $(Mustache.render(ListUITemplate, {
            'branches': branches.branches
        }))
            .appendTo($content);
        var $list = $('#githubnfo-list');
        var $button = $('#githubnfo-button a');
        $list.css({
            'width': ($button.width() + 'px'),
            'bottom': ('-' + $list.height() + 'px')
        });
        $button.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $list.css({
                'bottom': ($button.height() + 'px'),
                'left': (($button.position().left + $('#status-indicators').position().left) + 'px')
            }).addClass('open');
        });
        $('#githubnfo-list a').on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            _switchBranch($(this).attr('href'));
        });
        $('body').on('click', function () {
            if ($list.hasClass('open')) {
                $list.removeClass('open').css({
                    'bottom': ('-' + $list.height() + 'px'),
                    'left': (($button.position().left + $('#status-indicators').position().left) + 'px')
                }).addClass('open');
            }
        });

    }
    */

    function _populateBranchDropdown() {
        var projectPath = ProjectManager.getInitialProjectPath();
        if (projectPath !== null) {
            gitDomain.exec('getBranches', projectPath)
                .done(function (data) {
                    BRANCH_SET_AS_DEFAULT = data.current;
                    branchesSelect.items = data.branches;
                    branchesSelect.setButtonLabel(BRANCH_SET_AS_DEFAULT);
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
            /*
            if (item.name === BRANCH_SET_AS_DEFAULT) {
                html = "<span class='checked-branch'></span>" + html;
            }
            */
            return html;
        });
        branchesSelect.dropdownExtraClasses = "dropdown-github-branch";
        branchesSelect.$button.addClass("btn-status-bar");
        $("#githubnfo").append(branchesSelect.$button);
    }

    // Log memory when extension is loaded
    AppInit.htmlReady(_init);
    AppInit.appReady(function () {
        // console.log('[brackets-githubnfo] APP :: appReady');
        //_createDropDownButton();
        _populateBranchDropdown();
        // on('brancheChanged', _populateBranchDropdown);
    });
});
