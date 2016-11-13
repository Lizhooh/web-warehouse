'use strict';

    /**
     * 引入模块
     */
    const electron        = require('electron');

    /**
     * 设置应用生命周期模块
     */
    const {app}           = electron;
    const {BrowserWindow} = electron;

    var mainWin = null;

    var createWindow = function(options) {

        var defaults = {
                width  : 1200,
                height : 840,
            };

        if(typeof options === 'object') {
            for(var i in options) {
                if(defaults.hasOwnProperty(i)) {
                    defaults[i] = options[i]
                }
            }
        }

        mainWin = new BrowserWindow(defaults);

        mainWin.loadURL("file://" + __dirname + '/../web/index.html');
        mainWin.webContents.openDevTools();

        mainWin.on('close', function() {
            mainWin = null;
        });
    };

    app.on('ready', createWindow);

    app.on('windows-all-close', function() {
        if(process.platform !== 'darwin') {
            // 退出
            app.quit();
        }
    });

    app.on('activate', function() {
        if(mainWin === null) {
            createWindow();
        }
    });

