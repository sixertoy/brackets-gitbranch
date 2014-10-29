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
/*global $, define, brackets, Mustache, process */
define(function (require, exports, module) {
    'use strict';

    var _ = brackets.getModule('thirdparty/lodash'),
        AppInit = brackets.getModule('utils/AppInit'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        ProjectManager = brackets.getModule('project/ProjectManager'),
        DropdownButton = brackets.getModule('widgets/DropdownButton').DropdownButton;

    var Strings = require('strings'),
        ButtonHTML = require('text!htmlContent/button.html'),
        DialogHTML = require('text!htmlContent/dialog.html');
    ExtensionUtils.loadStyleSheet(module, 'styles/styles.css');

    var Helper = require('./lib/brackets-githubnfo');

    var _helper = null,
        _module = module,
        _dropdown = null;

    AppInit.htmlReady(function () {

        var $parent = $('.main-view .content #status-bar #status-indicators #status-overwrite');
        $parent.before(Mustache.render(ButtonHTML, {
            'label': Strings.UNAVAILABLE
        }));

        _dropdown = new DropdownButton('', [], function (item, index) {
            var html = _.escape(item.name);
            return html;
        });
        _dropdown.dropdownExtraClasses = 'dropdown-github-branch';
        _dropdown.$button.addClass('btn-status-bar').css('width', 'auto').hide();
        $('#githubnfo').append(_dropdown.$button);

    });

    AppInit.appReady(function () {
        _helper = new Helper(ProjectManager, _dropdown);

        /**
         *
         *
         *
         */
        $(_helper).on('brackets-githubnfo.populate', function (event, url, current, branches) {
            if (url) {
                $('#githubnfo').addClass('active');
                $('#githubnfo a.icon')
                    .attr('title', Strings.OPEN_IN_GITHUB)
                    .attr('href', url);
                _dropdown.$button.show();
                _dropdown.items = branches;
                _dropdown.setButtonLabel(current);
                //
            } else {
                console.log('Current project has no git repository');
                $('#githubnfo').removeClass('active');
                $('#githubnfo a.icon')
                    .attr('title', Strings.UNAVAILABLE)
                    .attr('href', '#');
                _dropdown.$button.hide();
                //
            }

        });
        _helper.onAppReady();
    });


});
