const {
    shell,
    contextBridge,
    ipcRenderer,
    //remote
} = require('electron');
// const {app, Menu, MenuItem} = remote;

// const win2 = remote.getCurrentWindow();


contextBridge.exposeInMainWorld('_app', {
    quit: () => ipcRenderer.invoke('_app:quit'),
    main_win_minimize: () => ipcRenderer.invoke('_app:main_win_minimize')
});


//右鍵選單
/*
const menu = new Menu();
menu.append(new MenuItem( {label: 'BABANANA Chat Desktop', enabled: false} ));
menu.append(new MenuItem( {type: 'separator'}));
menu.append(new MenuItem( {label: '置頂', type: 'checkbox', checked: true} ));
menu.append(new MenuItem( {label: '防止點擊', type: 'checkbox', checked: false} ));
menu.append(new MenuItem( {type: 'separator'}));
menu.append(new MenuItem( {label: '說明', click() { require('electron').shell.openExternal('https://hackmd.io/s/B183d6iwG') }} ));
*/

// const template = [
//     {label: 'BABANANA Chat Desktop', enabled: false},
//     {type: 'separator'},
//     //{label: '置頂', type: 'checkbox', checked: true},
//     //{label: '防止點擊', type: 'checkbox', checked: false},
//     {label: '重新整理', click() { webview.reload(); } },
//     {type: 'separator'},
//     {label: '說明', click() { require('electron').shell.openExternal('https://hackmd.io/s/B183d6iwG') } },
//     {label: '關閉', click() { app.quit(); } }
// ];

// const contextMenu = Menu.buildFromTemplate(template);


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    


    //視窗縮小到工具列
    document.getElementById("winButtonMinimize").addEventListener('click', () => {
        //win2.minimize();
        ipcRenderer.invoke('_app:main_win_minimize');
    });
    //縮放視窗
    /*
        win7在視窗設為背景透明時`isMaximized()`無法正確偵測視窗大小,
        導致放大後無法正確偵測狀態來縮小視窗
        若視窗設定為不透明時則不會有這個問題
        看英文討論區說這個是electron官方的bug,而且存在很久看起來沒有打算修正,
        所以暫時取消視窗縮放按紐的功能(透明視窗是這個聊天室程式很重要的一環,不能取消)
    */
    /*
    let winButtonMaximize;
    winButtonMaximize = document.getElementById("winButtonMaximize").addEventListener('click',function(){
        console.log(remote.getCurrentWindow().isMaximized());
        if(win2.isMaximized()){
            //win2.unmaximize();
            win2.restore();
            //remote.getCurrentWindow().setSize(1000, 800, true);
        }else{
            win2.maximize();
            //remote.getCurrentWindow().setSize(1000, 800, true);
        }
    });
    */
    //關閉視窗
    document.getElementById("winButtonClose").addEventListener('click', () => {
        //app.quit();
        ipcRenderer.invoke('_app:quit');
    });

    

    // window.addEventListener('contextmenu', (e) => {
    //     console.log('[event] contextmenu');
    //     e.preventDefault();
    //     contextMenu.popup({ window: remote.getCurrentWindow() });
    // }, true);

    
    // const replaceText = (selector, text) => {
    //     const element = document.getElementById(selector);
    //     if (element) element.innerText = text;
    // };
  
    // for (const dependency of ['chrome', 'node', 'electron']) {
    //     replaceText(`${dependency}-version`, process.versions[dependency]);
    // }


    

});

// webview.addEventListener('dom-ready', () => {
    
// });


// const webview = document.getElementById('wv_kk');

// // 將網頁中的連結開在外部瀏覽器
// webview.addEventListener('new-window', async (e) => {
//     const protocol = (new URL(e.url)).protocol;
//     if (protocol === 'http:' || protocol === 'https:') {
//         await shell.openExternal(e.url);
//     }
// });