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

    var AppInit = require(''),
        GitNFO = require('./lib/brackets-githubnfo.js');

    AppInit.htmlReady(function(){
        /*
        var $parent = $('.main-view .content #status-bar #status-indicators #status-overwrite');
        $parent.before(Mustache.render(GithubnfoButtonHTML, {'label': Strings.GIT_UNAVAILABLE}));

        branchesSelect = new DropdownButton('', [], function (item, index) {
            var html = _.escape(item.name);
            if (index === BRANCH_SET_AS_DEFAULT_INDEX) {
                html = '<span class="checked-branch"></span>' + html;
            }
            return html;
        });
        $(branchesSelect).on('select', _switchBranch);
        branchesSelect.dropdownExtraClasses = 'dropdown-github-branch';
        branchesSelect.$button.addClass('btn-status-bar')
            .css('width', 'auto')
            .hide();
        $('#githubnfo').append(branchesSelect.$button);
        */
    });

    AppInit.appReady(function () {
        // _onProjectOpen();
        // $(ProjectManager).on('projectClose', function () {});
        // $(ProjectManager).on('projectOpen projectRefresh', _onProjectOpen);
    });


});
