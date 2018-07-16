// 主進程 main-process

const electron = require('electron');
const {app, BrowserWindow, Menu, Tray} = electron;
const path = require('path');
const url = require('url');

// 定義系統選單+右鍵選單
require('./common-process/context-menu');

//視窗大小
const window_width = 350;
const window_height = 500;

// 保持一個對於 window 對象的全局引用，如果你不這樣做，
// 當 JavaScript 對象被垃圾回收， window 會被自動地關閉
let win;

// 畫面右下的系統圖示
// https://electronjs.org/docs/api/tray
let tray = null;

function createWindow () {
    //取得桌面可使用區域寬高 (通常是螢幕解析度扣掉系統工具列)
    let screen_size = electron.screen.getPrimaryDisplay().workAreaSize;
    //console.log(screen_size.width, screen_size.height);

    // 創建瀏覽器窗口。
    win = new BrowserWindow({
        width: window_width,
        height: window_height,
        transparent: true, //視窗透明
        //backgroundColor: '#000000',
        frame: false, //視窗外框
        alwaysOnTop: true, //視窗置頂
        x: (screen_size.width - window_width),
        y: 200,
    });

    //win.setIgnoreMouseEvents(true); //滑鼠點擊穿透

    // 然後加載應用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打開開發者工具。
    //win.webContents.openDevTools()

    // 當 window 被關閉，這個事件會被觸發。
    win.on('closed', () => {
        // 取消引用 window 對象，如果你的應用支持多窗口的話，
        // 通常會把多個 window 對象存放在一個數組裡面，
        // 與此同時，你應該刪除相應的元素。
        win = null;
    });


    // 畫面右下的系統圖示
    tray = new Tray('./assets/img/app.ico');
    const template = [
        {label: 'BABANANA Chat Desktop', enabled: false},
        {type: 'separator'},
        {label: '置頂', type: 'checkbox', checked: true, click(e){
            //console.log(e.checked);
            e.checked? win.setAlwaysOnTop(true) : win.setAlwaysOnTop(false);
        }},
        {label: '防止點擊', type: 'checkbox', checked: false, click(e){
            //console.log(e.checked);
            e.checked? win.setIgnoreMouseEvents(true) : win.setIgnoreMouseEvents(false);
        }},
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
}

// Electron 會在初始化後並準備
// 創建瀏覽器窗口時，調用這個函數。
// 部分 API 在 ready 事件觸發後才能使用。
app.on('ready', createWindow);

// 當全部窗口關閉時退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用戶用 Cmd + Q 確定地退出，
    // 否則絕大部分應用及其菜單欄會保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // 在macOS上，當單擊dock 圖標並且沒有其他窗口打開時，
    // 通常在應用程序中重新創建一個窗口。
    if (win === null) {
        createWindow();
    }
})

// 在這文件，你可以續寫應用剩下主進程代碼。
// 也可以拆分成幾個文件，然後用 require 導入。