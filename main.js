/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {

    "use strict";

    var ProjectManager = brackets.getModule("project/ProjectManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        FileUtils = brackets.getModule("file/FileUtils");

    /**
     * Check content on git HEAD file
     * https://github.com/adobe/brackets/wiki/Brackets-Development-How-Tos
     */
    function _handleProjectOpen(event){
        var file,
            filename = '.git/HEAD',
            result = new $.Deferred(),
            path = ProjectManager.getInitialProjectPath(),
            $statusbar = $( '#status-indicators .spinner' ),
            modulePath = ExtensionUtils.getModulePath(module),
            template = '<div id="githubnfo" style="background:url('+modulePath+'images/github_icon-15x15.png) no-repeat 5px center transparent;padding-left:25px;"><span style="color:#8fddff;">GIT BRANCH:&nbsp;</span>%%VERSION%%</div>';

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
        return result.promise();
    }

    $( ProjectManager ).on( "projectOpen ", _handleProjectOpen );

});
