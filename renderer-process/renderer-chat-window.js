// 渲染進程 renderer-process
console.log('[renderer-process] start');

const {ipcRenderer} = require('electron');


document.addEventListener('DOMContentLoaded', function () {
    //傳送視窗載入完成狀態
    //(主進程本身有偵測視窗載入完成的狀況,另外再寫ipc通訊是可以讓程式依需求往後調整延遲執行)
    // ipcRenderer.send('win-loaded', 'chat-window');

    //當兩個視窗都載入完成時才讓兩個視窗進行通訊
    ipcRenderer.on('win-loaded', (event, message) => {
        if(message === 'all-windows-loaded') {
            //ipc code..
        }
    });

    let i = 0;
    
    //ipcRenderer
    ipcRenderer.on('main-to-chat', (event, message) => {
        //console.log(message); // Prints 'whoooooooh!'
        document.querySelector("#footer_msg").textContent = `接收: ${message}`;

        if(i < 20){ //測試用
            document.querySelector("main.js-content").innerHTML += `<div>${message}</div>`;
            i++
        }
        
    });
});