// 主進程 main-process
console.log('[main-process] start');

const electron = require('electron');
const {app, BrowserWindow, Menu, Tray, ipcMain, screen} = electron;
const path = require('path');
//const url = require('url');

//const date_format = require('./libs/date_format.js');

// 定義系統選單+右鍵選單
//require('./common-process/context-menu');

//視窗大小
const window_width = 350;
const window_height = 500;

// 保持一個對於 window 對象的全局引用，如果你不這樣做，
// 當 JavaScript 對象被垃圾回收， window 會被自動地關閉
let win = [];
// let win_main;
// let win_chat;

//偵測視窗載入狀態
let win_loaded_main = false;
let win_loaded_chat = false;

// 畫面右下的系統圖示
// https://electronjs.org/docs/api/tray
let tray = null;




const createWindow = {
    main: function(){
        //取得桌面可使用區域寬高 (通常是螢幕解析度扣掉系統工具列)
        let screen_size = screen.getPrimaryDisplay().workAreaSize;
        //console.log(screen_size.width, screen_size.height);
        
        // 創建瀏覽器窗口。
        win['main'] = new BrowserWindow({
            width: window_width,
            height: window_height,
            //transparent: true, //視窗透明
            backgroundColor: '#000000',
            frame: false, //視窗外框
            alwaysOnTop: true, //視窗置頂
            x: (screen_size.width - window_width - window_width -10),
            y: 200,
            webPreferences: {
                webviewTag: true, //Electron >= 5 之後禁用 <webview>,要透過這個設定值打開
                nodeIntegration: true, //同上, 在index.html中啟用require()
                enableRemoteModule: true, //Electron >=9 之後禁用 remote,要透過這個設定值打開
            },
        });

        //win.setIgnoreMouseEvents(true); //滑鼠點擊穿透

        // 然後加載應用的 index.html。
        // win.loadURL(url.format({ //舊
        //     pathname: path.join(__dirname, 'index.html'),
        //     protocol: 'file:',
        //     slashes: true
        // }));
        win['main'].loadFile(path.join(__dirname, 'renderer-process/renderer-main.html'));

        // 打開開發者工具。
        //win.webContents.openDevTools();

        // 當 window 被關閉，這個事件會被觸發。
        win['main'].on('closed', () => {
            // 取消引用 window 對象，如果你的應用支持多窗口的話，
            // 通常會把多個 window 對象存放在一個數組裡面，
            // 與此同時，你應該刪除相應的元素。
            win = null;
        });


        // 畫面右下的系統圖示
        tray = new Tray( path.join(__dirname, 'assets/img/app.ico') );

        const template = [
            {label: 'BABANANA Chat Desktop', enabled: false},
            {type: 'separator'},
            {label: '置頂', type: 'checkbox', checked: true, click(e){
                //console.log(e.checked);
                e.checked? win_main.setAlwaysOnTop(true) : win_main.setAlwaysOnTop(false);
            }},
            {label: '防止點擊', type: 'checkbox', checked: false, click(e){
                //console.log(e.checked);
                e.checked? win_main.setIgnoreMouseEvents(true) : win_main.setIgnoreMouseEvents(false);
            }},
            {type: 'separator'},
            {label: '重新整理', click() { win_main.webContents.reload(); } },
            {type: 'separator'},
            {label: '說明', click() { require('electron').shell.openExternal('https://hackmd.io/s/B183d6iwG') } },
            {label: '關閉', click() { app.quit(); } }
        ];

        const contextMenu = Menu.buildFromTemplate(template);

        tray.setToolTip('BABANANA Chat Desktop');
        tray.setContextMenu(contextMenu);
        /*
        tray.on('click', (event) => {
            console.log(event);
        });
        */

        /*
        win.webContents.executeJavaScript(`
            document.getElementById("winButtonClose").addEventListener('click',function(){win.close()});
        `);
        */

        win['main'].webContents.on('did-finish-load', () => {
            win_loaded_main = true;
            this.ipcCheck();
            
            win['main'].webContents.send('ping', 'whoooooooh!');

            // setInterval(() => {
            //     let datetime = date_format.format(new Date());
            //     win_main.webContents.send('ping', datetime);
            // }, 1000);

            // ipcMain.on('renderer-to-main', (event, arg) => {
            //     win_chat.webContents.send('ping', arg);
            // });
        });
    },
    chat: function(){
        //取得桌面可使用區域寬高 (通常是螢幕解析度扣掉系統工具列)
        let screen_size = screen.getPrimaryDisplay().workAreaSize;
        //console.log(screen_size.width, screen_size.height);

        // 創建瀏覽器窗口。
        win['chat'] = new BrowserWindow({
            width: window_width,
            height: window_height,
            transparent: true, //視窗透明
            //backgroundColor: '#000000',
            frame: false, //視窗外框
            alwaysOnTop: true, //視窗置頂
            x: (screen_size.width - window_width),
            y: 200,
            webPreferences: {
                webviewTag: true, //Electron >= 5 之後禁用 <webview>,要透過這個設定值打開
                nodeIntegration: true, //同上, 在index.html中啟用require()
                enableRemoteModule: true, //Electron >=9 之後禁用 remote,要透過這個設定值打開
            },
        });

        

        //win.setIgnoreMouseEvents(true); //滑鼠點擊穿透

        // 然後加載應用的 index.html。
        // win.loadURL(url.format({ //舊
        //     pathname: path.join(__dirname, 'index.html'),
        //     protocol: 'file:',
        //     slashes: true
        // }));
        win['chat'].loadFile(path.join(__dirname, 'renderer-process/renderer-chat-window.html'));

        // 打開開發者工具。
        //win.webContents.openDevTools();

        // 當 window 被關閉，這個事件會被觸發。
        win['chat'].on('closed', () => {
            // 取消引用 window 對象，如果你的應用支持多窗口的話，
            // 通常會把多個 window 對象存放在一個數組裡面，
            // 與此同時，你應該刪除相應的元素。
            win = null;
        });

        win['chat'].webContents.on('did-finish-load', () => {
            win_loaded_chat = true;
            this.ipcCheck();
            
            win['chat'].setIgnoreMouseEvents(true); //防止點擊
            
            //win['chat'].webContents.send('ping', 'whoooooooh!');

            // setInterval(() => {
            //     let datetime = date_format.format(new Date());
            //     win['chat'].webContents.send('ping', datetime);
            // }, 1000);
        });

        

        ipcMain.on('renderer-to-main', (event, arg) => {
            win['chat'].webContents.send('main-to-chat', arg);
        });
    },
    ipcCheck:function(){
        //當兩個視窗都載入完成時才讓兩個視窗進行通訊
        // ipcMain.on('win-loaded', (event, arg) => {
        //     console.log(`[ipc: win-loaded] ${arg}`);

        //     if(arg === 'main-window') win_loaded_main = true;
        //     if(arg === 'chat-window') win_loaded_chat = true;

        //     if(win_loaded_main === true && win_loaded_chat === true){
        //         this.ipcStart();
        //     }
        // });

        if(win_loaded_main === true && win_loaded_chat === true){
            this.ipcStart();
        }
    },
    ipcStart: function(){
        win['main'].webContents.send('win-loaded', 'all-windows-loaded');
        win['chat'].webContents.send('win-loaded', 'all-windows-loaded');
    }
};


// Electron 會在初始化後並準備
// 創建瀏覽器窗口時，調用這個函數。
// 部分 API 在 ready 事件觸發後才能使用。
//app.on('ready', createWindow); //舊
app.whenReady().then(()=>{
    createWindow.main();
    createWindow.chat();

    // setTimeout(()=>{
        
    // }, 3000);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});
  
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 在這文件，你可以續寫應用剩下主進程代碼。
// 也可以拆分成幾個文件，然後用 require 導入。