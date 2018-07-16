// 渲染進程 renderer-process

// <webview>
// https://electronjs.org/docs/api/webview-tag

const {shell, remote} = require('electron');
const {app, Menu, MenuItem} = remote;
// remote 可以調用 main 進程對象的方法

const win2 = remote.getCurrentWindow();

//當渲染進程載入完成時
document.addEventListener('DOMContentLoaded', function () {
    //視窗縮小到工具列
    document.getElementById("winButtonMinimize").addEventListener('click',function(){
        win2.minimize();
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
    document.getElementById("winButtonClose").addEventListener('click',function(){
        app.quit();
    });
});


const webview = document.getElementById('wv_kk');

//要注意webview中的網頁重新載入時會再次觸發這個事件,要注意使用
webview.addEventListener('dom-ready', () => {
    //自訂webview內網頁的CSS
    webview.insertCSS(`
        body {
            font-family: "Microsoft JhengHei", "Microsoft YaHei", Arial, 'LiHei Pro', sans-serif;
        }
        #tool_bar { display: none !important; }
        .output_lines, #announcements {
            font-size: 16px !important;
            font-weight: normal;
        }
    `);
    
    //自訂webview內網頁的JS
    webview.executeJavaScript(`
        //alert("executeJavaScript test");
    `);
});

// 將網頁中的連結開在外部瀏覽器
webview.addEventListener('new-window', (e) => {
    const protocol = require('url').parse(e.url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
        shell.openExternal(e.url);
    }
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

const template = [
    {label: 'BABANANA Chat Desktop', enabled: false},
    {type: 'separator'},
    //{label: '置頂', type: 'checkbox', checked: true},
    //{label: '防止點擊', type: 'checkbox', checked: false},
    {label: '重新整理', click() { webview.reload(); } },
    {type: 'separator'},
    {label: '說明', click() { require('electron').shell.openExternal('https://hackmd.io/s/B183d6iwG') } },
    {label: '關閉', click() { app.quit(); } }
];

const contextMenu = Menu.buildFromTemplate(template);

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
}, false)