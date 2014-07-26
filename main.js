/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        Menus           = brackets.getModule("command/Menus"),
        LanguageManager = brackets.getModule("language/LanguageManager");

    var _defaultLanguagesJSON = JSON.parse(brackets.getModule("text!language/languages.json"));
        
    var menu = Menus.addMenu("File Language", "p4bl1t0.languageSwitcher.mainMenu");
    
    // Function to run when the menu item is clicked
    function changeLanguage(argKey) {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            if (_defaultLanguagesJSON[argKey].mode !== undefined && _defaultLanguagesJSON[argKey] !== null) {
                //console.log(_defaultLanguagesJSON[argKey].mode);
                $("#status-language").text(_defaultLanguagesJSON[argKey].name);
                editor._codeMirror.setOption("mode", _defaultLanguagesJSON[argKey].mode);
            }
        }
        
        
    }
    
    var keys = Object.keys(_defaultLanguagesJSON);
    
    /*for (var key in _defaultLanguagesJSON) {
        if (_defaultLanguagesJSON.hasOwnProperty(key)) {
            keys.push(key.toString());
            if (_defaultLanguagesJSON[key].mode !== undefined && _defaultLanguagesJSON[key] !== null) {
                menu.addMenuItem(attachCommand(key));
            }
        }
    }*/
    
    keys.sort();
    
    for (var index = 0; index < keys.length; index++) {
        if (_defaultLanguagesJSON[keys[index]].mode !== undefined && _defaultLanguagesJSON[keys[index]] !== null) {
            menu.addMenuItem(attachCommand(keys[index]));
        }
    }
    
    
    function attachCommand(k) {
        var id = "p4bl1t0.languageSwitcher." + k;
        var cmd = CommandManager.register(_defaultLanguagesJSON[k].name, id, function() {
                changeLanguage(k);
        });
        return cmd;
    }
    
    exports.changeLanguage = changeLanguage;
});
