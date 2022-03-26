// 主進程 main-process
console.log('[main-process] start');

const electron = require('electron');
const {
    app,
    BrowserWindow,
    Menu,
    Tray,
    nativeImage,
    ipcMain,
    shell
} = electron;
const path = require('path');
//const url = require('url');

/*
    如果cmd出現以下錯誤訊息:
        [23364:0207/144435.276:ERROR:gpu_init.cc(454)] Passthrough is not supported, GL is disabled, ANGLE is
    解決方式:
        錯誤原因可能是chrome和顯卡驅動之間的問題(2022/3/27 看electron官方github的issues #32317 也還沒解決這問題)
        暫時解決方式是關閉顯卡硬體加速,改用CPU渲染
        但不關也不影響運作,只是會噴錯誤訊息
        還有網頁的CSS渲染,動畫,影片用顯卡渲染效能會比CPU好(這是顯卡的強項)
        所以建議是不關
        https://stackoverflow.com/questions/70267992/win10-electron-error-passthrough-is-not-supported-gl-is-disabled-angle-is
        https://github.com/electron/electron/issues/32317
*/
// app.disableHardwareAcceleration(); //關閉硬體加速(顯卡)

// 定義系統選單+右鍵選單
require('./common-process/context-menu');

//視窗大小
const window_width = 350;
const window_height = 500;

// 保持一個對於 window 對象的全局引用，如果你不這樣做，
// 當 JavaScript 對象被垃圾回收， window 會被自動地關閉
//let mainWindow;

// 畫面右下的系統圖示
// https://electronjs.org/docs/api/tray
let tray = null;

const _app_quit = () => {
    app.quit();
};

const createWindow = () => {
    //取得桌面可使用區域寬高 (通常是螢幕解析度扣掉系統工具列)
    let screen_size = electron.screen.getPrimaryDisplay().workAreaSize;
    //console.log(screen_size.width, screen_size.height);

    // 創建瀏覽器窗口。
    const mainWindow = new BrowserWindow({
        width: window_width,
        height: window_height,
        transparent: true, //視窗透明(windows上要搭配無視窗外框 frame:false 使用)
        //backgroundColor: '#000000',
        frame: false, //視窗外框
        alwaysOnTop: true, //視窗置頂
        x: (screen_size.width - window_width),
        y: 200,
        webPreferences: {
            webviewTag: true, //Electron >= 5 之後禁用 <webview>,要透過這個設定值打開
            //nodeIntegration: true, //同上, 在index.html中啟用require()
            //enableRemoteModule: true, //Electron >=9 之後禁用 remote,要透過這個設定值打開
            preload: path.join(__dirname, 'preload.js')
        },
        defaultFontFamily: {
            monospace: "Consolas" //electron的預設monospace等寬字字體是"Courier New",這邊改回和chrome預設一樣的"Consolas"(維持一致性)
        },
    });

    //win.setIgnoreMouseEvents(true); //滑鼠點擊穿透

    // 然後加載應用的 index.html。
    // win.loadURL(url.format({ //舊
    //     pathname: path.join(__dirname, 'index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
    mainWindow.loadFile('index.html');

    // 打開開發者工具。
    //mainWindow.webContents.openDevTools();

    // 當 window 被關閉，這個事件會被觸發。
    // mainWindow.on('closed', () => {
    //     // 取消引用 window 對象，如果你的應用支持多窗口的話，
    //     // 通常會把多個 window 對象存放在一個數組裡面，
    //     // 與此同時，你應該刪除相應的元素。
    //     mainWindow = null;
    // });


    const icon = nativeImage.createFromPath( path.join(__dirname, 'assets/img/icon.png') );
    //const icon = path.join(__dirname, 'assets/img/icon.png');
    //const icon = path.join(__dirname, 'assets/img/app.ico');
    // 畫面右下的系統圖示
    tray = new Tray(icon);

    const template = [
        {label: 'BABANANA Chat Desktop', enabled: false},
        {type: 'separator'},
        {label: '置頂', type: 'checkbox', checked: true, click(e){
            //console.log(e.checked);
            e.checked? mainWindow.setAlwaysOnTop(true) : mainWindow.setAlwaysOnTop(false);
        }},
        {label: '防止點擊', type: 'checkbox', checked: false, click(e){
            //console.log(e.checked);
            e.checked? mainWindow.setIgnoreMouseEvents(true) : mainWindow.setIgnoreMouseEvents(false);
        }},
        {type: 'separator'},
        {label: '重新整理', click() { mainWindow.webContents.reload(); } },
        {type: 'separator'},
        {label: '說明', click() { require('electron').shell.openExternal('https://hackmd.io/s/B183d6iwG') } },
        {label: '關閉', click() { _app_quit(); } }
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

    ipcMain.handle('_app:quit', () => {
        _app_quit();
    });

    ipcMain.handle('_app:main_win_minimize', () => {
        mainWindow.minimize();
    });
}

// Electron 會在初始化後並準備
// 創建瀏覽器窗口時，調用這個函數。
// 部分 API 在 ready 事件觸發後才能使用。
//app.on('ready', createWindow); //舊
app.whenReady().then(()=>{
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') _app_quit();
});

// 在這文件，你可以續寫應用剩下主進程代碼。
// 也可以拆分成幾個文件，然後用 require 導入。


// Listen for web contents being created
// https://stackoverflow.com/questions/48914542/cant-open-electron-webview-links-with-target-blank
app.on('web-contents-created', (e, contents) => {

    // Check for a webview
    if (contents.getType() == 'webview') {
  
        // Listen for any new window events
        contents.on('new-window', async (e2, url) => {
            e2.preventDefault();

            console.log("[Open URL]", url);
            
            const protocol = (new URL(url)).protocol;
            if (protocol === 'http:' || protocol === 'https:') {
                await shell.openExternal(url);
            }
        });
    }
});