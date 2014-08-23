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

    var AppInit = brackets.getModule('utils/AppInit'),
        NodeDomain = brackets.getModule('utils/NodeDomain'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        ExtensionUITemplate = require("text!htmlContent/GithubNFO.html");

    var $statusbar = $( '#status-indicators .spinner' );
        gitDomain = new NodeDomain('git', ExtensionUtils.getModulePath(module, 'node/GitDomain'));

    function _createEtensionUI(branches) {
        $( Mustache.render(ExtensionUITemplate, {
            'current': branches.current,
            'branches': branches.branches
        }) )
        .insertBefore($statusbar);
    }


    // Helper function that runs the simple.getBranches command and
    // logs the result to the console
    function getGitBranches() {
        // console.log('[brackets-githubnfo] APP :: getGitBranches');
        var projectPath = ProjectManager.getInitialProjectPath();
        if (projectPath !== null) {
            gitDomain.exec('getBranches', projectPath)
                .done(function (branches) {
                    console.log('[brackets-githubnfo] git.getBranches success');
                    _createEtensionUI(branches);
                }).fail(function (err) {
                    console.error('[brackets-githubnfo] failed to run git.getBranches :: ' + err);
                });
        }
    }

    // Log memory when extension is loaded
    AppInit.appReady(function () {
        // console.log('[brackets-githubnfo] APP :: appReady');
        getGitBranches();
    });
});
