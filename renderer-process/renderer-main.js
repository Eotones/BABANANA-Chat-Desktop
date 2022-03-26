// 渲染進程 renderer-process
console.log('[renderer-process] start');

// <webview>
// https://electronjs.org/docs/api/webview-tag

//const {shell, remote} = require('electron');
//const {app, Menu, MenuItem} = remote;
// remote 可以調用 main 進程對象的方法


//const webview = document.getElementById('wv_kk');





//當渲染進程載入完成時
// document.addEventListener('DOMContentLoaded', function () {
    
// });




const webview = document.querySelector('webview')
webview.addEventListener('dom-ready', () => {
    //webview.openDevTools();

    //自訂webview內網頁的CSS
    webview.insertCSS(`
        html {
            margin-bottom: 40px;
        }
        body {
            /*font-family: "Microsoft JhengHei", "Microsoft YaHei", Arial, 'LiHei Pro', sans-serif;*/
            background-color: rgba(0, 0, 0, 0) !important;
        }

        #tool_bar {
            /*display: none !important;*/
            top: initial !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            background-color: rgba(0,0,0,0.7) !important;
            color: #fff !important;
            text-align: right !important;
            min-height: 40px !important;
            line-height: 40px !important;
            font-family: Consolas, monospace;
            font-size: 12px !important;
        }
        #setting_img {
            display: none !important;
        }
        #setting_div {
            top: initial !important;
            bottom: 40px !important;
            background-color: rgba(255,255,255,0.9) !important;
            border-radius: 3px 3px 0 0 !important;
        }

        .output_lines, #announcements {
            font-size: 1rem !important;
            font-weight: normal;
        }
        .pod, .kk_time {
            font-size: 0.7rem !important;
            font-family: Arial, sans-serif !important;
        }

        /* scrollbar */
        /* width */
        ::-webkit-scrollbar {
            width: 2px;
        }
        /* Track */
        ::-webkit-scrollbar-track {
            background: rgba(230,230,230,0.7); 
        }
        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.7); 
        }
        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(50,50,50,0.7); 
        }
    `);

    //自訂webview內網頁的JS
    webview.executeJavaScript(`
        //alert("executeJavaScript test");

        // window.addEventListener('contextmenu', (e) => {
        //     e.preventDefault();
        //     //alert("executeJavaScript test");
        // }, false);
    `);
});


// webview.addEventListener('contextmenu', (e) => {
//     console.log('[event] contextmenu');
//     e.preventDefault();
//     contextMenu.popup({ window: win2 });
// }, false);
//});



