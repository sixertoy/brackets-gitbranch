/*
 * The MIT License (MIT)
 * Copyright (c) 2012 Dennis Kehrig. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function (require, exports, module) {

    "use strict";

    var FileSystemEntry = brackets.getModule("filesystem/FileSystemEntry"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        FileUtils = brackets.getModule("file/FileUtils");

    function _loadConfigFiles()
    {
        var file,
            filename = '.git/HEAD',
            result = new $.Deferred(),
            path = ProjectManager.getInitialProjectPath(),
            $statusbar = $( '#status-indicators .spinner' ),
            modulePath = ExtensionUtils.getModulePath(module),
            template = '<div id="githubnfo" style="background:url('+modulePath+'images/github_icon-15x15.png) no-repeat 5px center transparent;padding-left:25px;"><a style="color:#FFF;text-decoration:none"; href="%%REPOURL%%" title="View on GITHUB"><span style="color:#8fddff;">GIT BRANCH:&nbsp;</span><span>%%VERSION%%</span></a></div>';

        file = FileSystem.getFileForPath(path+filename);
        file.read(function(err,content){
            var branch, html;
            if( !err || ( err === null ) ){
                try{
                    if( content.indexOf( '/' ) != -1 && content.indexOf( ':' ) != -1 ){
                        // Split last path
                        branch = content.split( "/" );
                        branch = branch[ branch.length - 1 ];
                        // Capitalize First Letter
                        branch = branch.trim().charAt(0).toUpperCase() + branch.slice(1);
                        // Replace Version in template
                        html = template.split( '%%VERSION%%' ).join( branch );
                        $( html ).insertBefore( $statusbar );
                    }
                    else{
                        console.error("Brackets NFO incorrect format " + file.fullPath );
                        result.reject(err);
                    }
                }catch (e) {
                    console.error("Brackets NFO: error parsing " + file.fullPath + ". Details: " + e);
                    result.reject(e);
                    return;
                }
            }
            else{
                result.reject(err);
            }
        });
        filename = '.git/config';
        file = FileSystem.getFileForPath(path+filename);
        file.read(function(err,content){
            var html, url,start,end;
            if( !err || ( err === null ) ){
                try{
                    start = content.indexOf( 'https://github.com' );
                    if( start != -1 )
                    {
                        url = content.slice( start );
                        end = url.indexOf( '.git' );
                        if( end != -1 )
                        {
                            url = url.slice( 0, ( end + ( '.git' ).length ) ).trim();
                            html = $( '#githubnfo' ).html().split( '%%REPOURL%%' ).join( url );
                            $( '#githubnfo' ).html( html );
                        }
                    }
                    else{
                        console.error("Brackets NFO unable to parse URL " + file.fullPath );
                        result.reject(err);
                    }
                }catch (e) {
                    console.error("Brackets NFO: error parsing " + file.fullPath + ". Details: " + e);
                    result.reject(e);
                    return;
                }
            }
            else{
                result.reject(err);
            }
        });
        return result.promise();
    }

    function _handleProjectClose(event)
    {
        var container = $( '#githubnfo' ),
            result = new $.Deferred();
        if( container.length ) container.remove();
        return result.promise();
    }

    /**
     * Check content on git HEAD file
     * https://github.com/adobe/brackets/wiki/Brackets-Development-How-Tos
     */
    function _handleProjectOpen(event){

        var directory,
            gitdir = '.git',
            result = new $.Deferred(),
            path = ProjectManager.getInitialProjectPath();
        directory = FileSystem.getDirectoryForPath(path+gitdir);
        directory.exists(function(err, exists){
            if( exists ) _loadConfigFiles();
            return result.promise();
        });
    }

    $( ProjectManager ).on( "projectOpen ", _handleProjectOpen );
    $( ProjectManager ).on( "projectClose ", _handleProjectClose );

});
