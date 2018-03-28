// 渲染進程 renderer-process

// <webview>
// https://electronjs.org/docs/api/webview-tag

const {shell, remote} = require('electron');
const {app, Menu, MenuItem} = remote;
// remote 可以調用 main 進程對象的方法

const webview = document.getElementById('wv_kk');

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